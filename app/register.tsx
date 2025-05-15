import { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  ScrollView,
  Platform,
} from "react-native";
import { app } from "./firebase/firebse_initialize";
import createUser from "./firebase/createUser";
import { useRouter } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import Constants from "expo-constants";
import AWS from "aws-sdk";
import { getAuth } from "firebase/auth";

export default function RegisterScreen() {
  const [name, setName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [pwd, setPwd] = useState<string>("");
  const [message, setMessage] = useState<string>("");
  const [imgUri, setImgUri] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [userType, setUsertype] = useState(0);
  const [isWaitingForVerification, setIsWaitingForVerification] =
    useState(false);
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

      setIsWaitingForVerification(true); // Set waiting state
      const errorMsg = await createUser(email, pwd, name, imageUrl, userType);

      if (errorMsg !== "successful") {
        // Handle Firebase error codes
        console.error("Error creating user:1", errorMsg);
        switch (errorMsg) {
          case "Firebase: Error (auth/email-already-in-use).":
            setMessage(
              "This email is already in use. Please use a different email."
            );
            break;
          case "Firebase: Error (auth/invalid-email).":
            setMessage(
              "The email address is not valid. Please enter a valid email."
            );
            break;
          case "Firebase: Error (auth/weak-password).":
            setMessage(
              "The password is too weak. Please use a stronger password."
            );
            break;
          case "Firebase: Error (auth/network-request-failed).":
            setMessage(
              "Network error. Please check your internet connection and try again."
            );
            break;
          default:
            setMessage("An unexpected error occurred. Please try again.");
            break;
        }
        console.error("Error creating user:", errorMsg);
        setIsWaitingForVerification(false); // Reset waiting state
        return;
      }

      setMessage("Registration successful! Please verify your email.");
    } catch (error) {
      console.error("Registration error:", error);
      setMessage("Registration failed. Please try again.");
      setIsWaitingForVerification(false); // Reset waiting state
    }
  }

  async function checkEmailVerification() {
    const auth = getAuth();
    const user = auth.currentUser;

    if (!user) {
      setMessage("No user is logged in.");
      return;
    }

    try {
      await user.reload(); // Reload user data
      if (user.emailVerified) {
        setMessage("Email verified! Redirecting...");
        setIsWaitingForVerification(false);
        router.replace("/home"); // Navigate to the home page
      } else {
        setMessage("Email not verified yet. Please check your inbox.");
      }
    } catch (error) {
      console.error("Error checking email verification:", error);
      setMessage("Failed to check email verification. Please try again.");
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
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        keyboardShouldPersistTaps="handled"
      >
        <Text className="text-4xl font-bold font-Title text-black text-center pt-5 pb-8">
          Create New Account
        </Text>
        <View className="flex-row justify-center items-center pb-10">
          <Text className="text-lg font-Menu text-center">
            Already registered?
          </Text>
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
            onChange={(event) =>
              setUsertype(event.nativeEvent.selectedSegmentIndex)
            }
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
            secureTextEntry={true}
          />
        </View>
        {/* <View className="mb-8">
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
        </View> */}
        {imgUri && (
          <Image
            source={{ uri: imgUri }}
            className="w-48 h-48 rounded-full self-center my-2"
          />
        )}
        <Text className="text-center text-red-600 my-4 font-medium text-base">
          {message}
        </Text>
        <View className="mb-12">
          {!isWaitingForVerification ? (
            <TouchableOpacity
              onPress={handleForm}
              disabled={isUploading}
              className="flex-row bg-primary mx-10 px-4 rounded-lg h-14 items-center justify-center"
            >
              <Text className="text-2xl font-Menu text-white font-medium ">
                Sign Up
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={checkEmailVerification}
              className="flex-row bg-blue-500 mx-10 px-4 rounded-lg h-14 items-center justify-center"
            >
              <Text className="text-2xl font-Menu text-white font-medium ">
                Verify Email
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
