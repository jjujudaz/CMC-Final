import { useEffect, useState } from "react";
import { View, Text, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, ScrollView, Platform } from "react-native";
import { app } from "./firebase/firebse_initialize";
import createUser from "./firebase/createUser";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import Constants from "expo-constants";
import AWS from "aws-sdk";

export default function RegisterScreen() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [pwd, setPwd] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [imgUri, setImgUri] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [userType, setUsertype] = useState(0);
  const router = useRouter();

  useEffect(() => {
    if (app) {
      console.log("Firebase initialized");
      
    }
  }, []);

  // Configure AWS S3
  const s3 = new AWS.S3({
    accessKeyId: Constants.expoConfig?.extra?.AWS_ACCESS_KEY_ID ?? "",
    secretAccessKey: Constants.expoConfig?.extra?.AWS_SECRET_ACCESS_KEY ?? "",
    region: Constants.expoConfig?.extra?.AWS_REGION ?? "",
  });

  // 1. Get a pre-signed URL from AWS S3
  async function getPresignedUrl(fileName: string, fileType: string) {
    const params = {
      Bucket: "cmc-capstone-image", // Replace with your S3 bucket name
      Key: fileName, // File name (e.g., "user_12345.jpg")
      Expires: 60, // URL expiration time in seconds
      ContentType: fileType, // MIME type of the file
    };

    try {
      const signedUrl = await s3.getSignedUrlPromise("putObject", params);
      return signedUrl;
    } catch (error) {
      console.error("Error generating pre-signed URL:", error);
      throw new Error("Failed to generate pre-signed URL");
    }
  }

  async function pickImage() {
    try {
      const image = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!image.canceled) {
        setImgUri(image.assets[0].uri);
        setMessage("Image selected successfully!");
      }
    } catch (error) {
      console.error("Error picking image:", error);
      setMessage("Failed to pick an image.");
    }
  }

  // 2. Upload the image to S3 using the pre-signed URL
  async function uploadImage(imageUri: string) {
    try {
      setIsUploading(true);
      setMessage("Uploading image...");

      const imageExt = imageUri.split(".").pop() || "jpg";
      const imageMime = `image/${imageExt}`;
      const fileName = `user_${Date.now()}.${imageExt}`;

      // Get pre-signed URL
      const signedUrl = await getPresignedUrl(fileName, imageMime);

      // Upload to S3
      const response = await fetch(imageUri);
      const blob = await response.blob();

      const uploadResponse = await fetch(signedUrl, {
        method: "PUT",
        body: blob,
        headers: {
          "Content-Type": imageMime,
        },
      });

      if (uploadResponse.ok) {
        const imageUrl = signedUrl.split("?")[0];
        setMessage("Image uploaded successfully!");
        return imageUrl;
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      setMessage("Image upload failed");
      return null;
    } finally {
      setIsUploading(false);
    }
  }

  async function handleForm() {
    if (!name || !email || !pwd) {
      setMessage("Please fill all fields");
      return;
    }

    try {
      let imageUrl = null;

      if (imgUri) {
        imageUrl = await uploadImage(imgUri);
        if (!imageUrl) {
          setMessage("Image upload failed. Please try again.");
          return;
        }
      }

      const errorMsg = await createUser(email, pwd, name, imageUrl, userType);
      if (errorMsg !== "successful") {
        setMessage(errorMsg);
        console.error("Error creating user:", errorMsg);
        return;
      }

      setMessage("Registration successful!");
      router.replace("/home");
    } catch (error) {
      console.error("Registration error:", error);
      setMessage("Registration failed. Please try again.");
    }
  }

  function navigaToLogin() {
    router.replace("/login");
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
      className="flex-1 bg-white"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
        <Text className="text-4xl font-bold font-Title text-black text-center pt-5 pb-8">
          Create New Account
        </Text>
        <View className="flex-row justify-center items-center pb-10">
          <Text className="text-lg font-Menu text-center">Already registered?</Text>
          <TouchableOpacity onPress={navigaToLogin}>
            <Text className="text-lg font-semibold font-Menu text-center text-primary pl-1">
              Log in here
            </Text>
          </TouchableOpacity>
        </View>
        <View className="mx-20 mb-5">
          <SegmentedControl
            values={["Student", "Tutor"]}
            selectedIndex={userType}
            onChange={(event) => setUsertype(event.nativeEvent.selectedSegmentIndex)}
          />
        </View>
        <Text className="text-base font-bold font-Menu pl-11">Name</Text>
        <View className="flex-row items-center bg-gray-200 mx-10 px-4 rounded-lg h-14 mb-10">
          <TextInput
            className="flex-1 text-base font-Text text-gray-800"
            placeholder="Full Name"
            onChangeText={setName}
          />
        </View>
        <Text className="text-base font-bold font-Menu pl-11">Email</Text>
        <View className="flex-row items-center bg-gray-200 mx-10 px-4 rounded-lg h-14 mb-10">
          <TextInput
            className="flex-1 text-base font-Text text-gray-800"
            placeholder="someone@example.com"
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>
        <Text className="text-base font-bold font-Menu pl-11">Password</Text>
        <View className="flex-row items-center bg-gray-200 mx-10 px-4 rounded-lg h-14 mb-10">
          <TextInput
            className="flex-1 text-base font-Text text-gray-800"
            placeholder="Password"
            onChangeText={setPwd}
            secureTextEntry
          />
        </View>
        <View className="mb-8">
          <TouchableOpacity
            onPress={pickImage}
            disabled={isUploading}
            className={`flex-row mx-20 px-4 rounded-lg h-14 items-center justify-center ${
              isUploading ? "bg-gray-400" : "bg-neutral-700"
            }`}
          >
            <Text className="text-xl font-Menu text-white font-bold">
              {imgUri ? "Change Profile Picture" : "Upload Profile Picture"}
            </Text>
          </TouchableOpacity>
        </View>
        {imgUri && (
          <Image source={{ uri: imgUri }} className="w-48 h-48 rounded-full self-center my-2" />
        )}
        <Text className="text-center text-red-600 my-4 font-medium text-base">{message}</Text>
        <View className="mb-12">
          <TouchableOpacity
            onPress={handleForm}
            disabled={isUploading}
            className="flex-row bg-primary mx-10 px-4 rounded-lg h-14 items-center justify-center"
          >
            <Text className="text-2xl font-Menu text-white font-medium ">Sign Up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}