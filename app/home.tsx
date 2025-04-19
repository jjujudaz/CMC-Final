import { useEffect, useState } from "react";
import { View, Text, TextInput, Button, ScrollView, Image } from "react-native";
import { getAuth } from "firebase/auth";
import {
  getDatabase,
  ref,
  onValue,
  update,
  push,
  child,
} from "firebase/database";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UserInfo from "./firebase/getUserInfo";
import { supabase } from "@/app/supabase/initiliaze";

function HomeScreen() {
  const [welcomeMessage, setWelcomeMessage] = useState<String>("");
  const [textMessage, setTextMessage] = useState<string>("");
  const [messages, setMessages] = useState([]);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [tutors, setTutors] = useState([]);
  useEffect(() => {
    fetchUser();
    initializeUser();
    finitializeSupabase();
  }, []);

  async function initializeUser() {
    const auth = getAuth();
    const currentUser = auth.currentUser;

    if (currentUser) {
      const userCredentials = {
        email: currentUser.email,
        uid: currentUser.uid,
      };

      try {
        await AsyncStorage.setItem(
          "USERCREDENTIALS",
          JSON.stringify(userCredentials)
        );
        console.log("User credentials saved to AsyncStorage");
      } catch (error) {
        console.error("Error saving user credentials:", error);
      }
    }
  }

  async function fetchUser() {
    const auth = getAuth();
    console.log(auth.currentUser);
    if (auth.currentUser?.displayName && auth.currentUser.photoURL) {
      setWelcomeMessage(auth.currentUser?.displayName);
      if (photoUrl !== "") {
        setPhotoUrl(auth.currentUser?.photoURL);
      }
      console.log(auth.currentUser.photoURL);
    }
  }

  async function finitializeSupabase() {
    try {
      const { data, error } = await supabase.from("users").select("*");
      if (error) {
        console.log(error.message);
        return;
      }
      setTutors(data.filter((item) => item.user_type == 'tutor'))
      console.log(tutors);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    const db = getDatabase();
    const dbRef = ref(db, "users");
    onValue(dbRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.val();
        setMessages(Object.values(data));
      }
    });
  }

  async function sendMessage() {
    const userInfo = UserInfo();
    if (!userInfo) {
      console.error("User info not found");
      return;
    }

    const { name, uid, photoUrl } = userInfo;
    const db = getDatabase();
    const newMsgKey = push(child(ref(db), "users")).key; // Generate a unique key for the message

    // Construct the message object
    const newMessage = {
      id: newMsgKey,
      userId: uid,
      userName: name,
      photoUrl: photoUrl,
      message: textMessage, // The message from the input field
      timestamp: Date.now(), // Add a timestamp
    };

    // Update the database with the new message
    const updates = {};
    updates[`users/${newMsgKey}`] = newMessage;

    try {
      await update(ref(db), updates);
      console.log("Message sent successfully!");
      setTextMessage(""); // Clear the input field after sending the message
    } catch (error) {
      console.error("Error sending message:", error);
    }
  }

  return (
    <View className="flex-1">
      <ScrollView
        className="flex-1 px-5"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
      >
        <Text className="text-3xl font-bold font-Title text-black text-center pt-5">
          Coffee Meets Careers {welcomeMessage}
        </Text>
        {photoUrl ? (
          <Image
            style={{ width: 200, height: 200 }}
            source={{ uri: photoUrl }}
            width={40}
            height={40}
          />
        ) : (
          ""
        )}
        <View className={"flex-1 mt-5 mx-2.5"}>
          <View
            className={
              "flex-row items-center bg-gray-300 rounded-full px-5 py-5 border-2 border-primary"
            }
          >
            <TextInput
              value={textMessage}
              onChangeText={(msg) => setTextMessage(msg)}
              placeholder="Write a message"
              placeholderTextColor={"#16519f"}
              className={"flex-1 ml-2"}
            />
          </View>
          <Button onPress={sendMessage} title="Send" />
          {messages.map((item, index) => {
            return (
              <View key={index}>
                <Text>
                  {item.userName}: {item.message}
                </Text>
              </View>
            );
          })}
          <Text className={"text-lg font-semibold font-Menu mt-5 mb-4"}>
            Recent Updates
          </Text>

          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-5">
              <View className="w-24 h-24 rounded-full bg-primary items-center justify-center">
                <Text className="text-white font-bold">1</Text>
              </View>
              <View className="w-24 h-24 rounded-full bg-primary items-center justify-center">
                <Text className="text-white font-bold">2</Text>
              </View>
              <View className="w-24 h-24 rounded-full bg-primary items-center justify-center">
                <Text className="text-white font-bold">3</Text>
              </View>
              <View className="w-24 h-24 rounded-full bg-primary items-center justify-center">
                <Text className="text-white font-bold">4</Text>
              </View>
              <View className="w-24 h-24 rounded-full bg-primary items-center justify-center">
                <Text className="text-white font-bold">5</Text>
              </View>
            </View>
          </ScrollView>

          <Text className={"text-lg font-semibold font-Menu mt-5 mb-4"}>
            Recommended
          </Text>
          {tutors.map((item, index) => {
            return (
              <View
                key={index}
                className="bg-gray-400 rounded-xl py-5 mb-4 mx-2 shadow flex-row items-center"
              >
                {item.photoURL && (
                  <Image
                    source={{ uri: item.photoURL }}
                    style={{
                      width: 50,
                      height: 50,
                      borderRadius: 25,
                      marginRight: 10,
                    }}
                  />
                )}
                <View>
                  <Text
                    className={
                      "text-xl font-medium font-Title text-white text-left"
                    }
                  >
                    {item.name}
                  </Text>
                  <Text className={"text-sm font-Menu text-gray-200 text-left"}>
                    Tutor since: {new Date(item.created_at).toLocaleDateString()}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

export default HomeScreen;
