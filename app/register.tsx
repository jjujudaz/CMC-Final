import { useEffect, useState } from "react";
import { View, Text, Image, TextInput, Button, Alert } from "react-native";
import { app } from "./firebase/firebse_initialize";
import createUser from "./firebase/createUser";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import AWS from "aws-sdk";
import SegmentedControl from "@react-native-segmented-control/segmented-control";



const s3 = new AWS.S3();

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

  async function generateSignedUrl(fileName: string, fileType: string) {
    const params = {
      Bucket: "cmc-capstone-image", // Replace with your bucket name
      Key: `profile-pictures/${fileName}`, // Store in profile-pictures folder
      ContentType: fileType,
      Expires: 60 * 5, // URL expires in 5 minutes
    };

    try {
      const signedUrl = await s3.getSignedUrlPromise("putObject", params);
      return signedUrl;
    } catch (error) {
      console.error("Error generating signed URL:", error);
      throw error;
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
        setImgUri(image.assets[0].uri); // Store the image URI locally
        setMessage("Image selected successfully!");
      }
    } catch (error) {
      console.error("Error picking image:", error);
      setMessage("Failed to pick an image.");
    }
  }

  async function uploadImage(imageUri: string) {
    try {
      setIsUploading(true);
      setMessage("Uploading image...");

      const imageExt = imageUri.split(".").pop();
      const imageMime = `image/${imageExt}`;
      const fileName = `user_${Date.now()}.${imageExt}`; // Unique filename

      // Generate signed URL
      const signedUrl = await generateSignedUrl(fileName, imageMime);

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
        const imageUrl = signedUrl.split("?")[0]; // Get public URL without query params
        setMessage("Image uploaded successfully!");
        return imageUrl; // Return the URL to use in handleForm
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

      // If an image is selected, upload it first
      if (imgUri) {
        imageUrl = await uploadImage(imgUri);
        if (!imageUrl) {
          setMessage("Image upload failed. Please try again.");
          return;
        }
      }

      // Create the user with the imageUrl as a parameter
      const errorMsg = await createUser(email, pwd, name, imageUrl, userType);
      if (errorMsg !== "successful") {
        setMessage(errorMsg);
        return;
      }

      // Navigate to home after successful registration
      setMessage("Registration successful!");
      router.dismissTo("/home");
    } catch (error) {
      console.error("Registration error:", error);
      setMessage("Registration failed. Please try again.");
    }
  }


  
  function navigaToLogin() {
    router.push("/login");
  }

  return (
    <View style={{ padding: 20 }}>
      <TextInput
        placeholder="Name"
        onChangeText={setName}
        style={{ marginBottom: 10, padding: 10, borderWidth: 1 }}
      />
      <TextInput
        placeholder="Email"
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
        style={{ marginBottom: 10, padding: 10, borderWidth: 1 }}
      />
      <TextInput
        placeholder="Password"
        onChangeText={setPwd}
        secureTextEntry
        style={{ marginBottom: 10, padding: 10, borderWidth: 1 }}
      />

      <Button
        onPress={pickImage}
        title={imgUri ? "Change profile picture" : "Pick a profile picture"}
        disabled={isUploading}
      />

      {imgUri && (
        <Image
          source={{ uri: imgUri }}
          style={{ width: 200, height: 200, alignSelf: "center", margin: 10 }}
        />
      )}

      <Text style={{ color: "red", textAlign: "center", marginVertical: 10 }}>
        {message}
      </Text>

      <Button onPress={handleForm} title="Register" disabled={isUploading} />
      <SegmentedControl
        values={["Student", "Tutor"]}
        backgroundColor="black"
        selectedIndex={userType}
        onChange={(event) => {
          setUsertype(event.nativeEvent.selectedSegmentIndex); // Update the state with the selected index
        }}
      />
      <Button
        onPress={navigaToLogin}
        title="Already have an account? Login"
        color="gray"
      />
    </View>
  );
}
