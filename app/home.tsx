import { useEffect, useState } from "react";
import { View, Text, TextInput, Button, Alert,ScrollView, FlatList } from "react-native";
import { getAuth } from "firebase/auth";
import {
  getDatabase,
  set,
  ref,
  onValue,
  update,
  push,
  child,
} from "firebase/database";
import UserInfo from "./firebase/getUserInfo";
function HomeScreen() {
  const [welcomeMessage, setWelcomeMessage] = useState<String>("");
  const [textMessage, setTextMessage] = useState<string>("");
  const [messages, setMessages] = useState([]);
  useEffect(() => {
    fetchUser();
  }, []);

  async function fetchUser() {
    const auth = await getAuth();
    console.log(auth.currentUser);
    if (auth.currentUser?.displayName) {
      setWelcomeMessage(auth.currentUser?.displayName);
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
    //     const name = UserInfo()
    //     console.log(name)
    //    Alert.alert("AHAH")

    const db = getDatabase();
    const userId = 123; // Replace with the actual user ID
    const userName = "Yaser"; // Replace with the actual user name
    const newMsgKey = push(child(ref(db), "users")).key; // Generate a unique key for the message

    // Construct the message object
    const newMessage = {
      id: newMsgKey,
      userId: userId,
      userName: userName,
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
      <ScrollView className="flex-1 px-5"
                  showsVerticalScrollIndicator={false} contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}>
        <Text className="text-3xl font-bold font-Title text-black text-center pt-5">Coffee Meets Careers {welcomeMessage}</Text>

        <View className={"flex-1 mt-5 mx-2.5"}>
          <View className={"flex-row items-center bg-gray-300 rounded-full px-5 py-5 border-2 border-primary"}>
            <TextInput
                value={textMessage}
                onChangeText={(msg) => setTextMessage(msg)}
                placeholder="Search"
                placeholderTextColor={"#16519f"}
                className={"flex-1 ml-2"}
            />
          </View>


            <Text className={"text-lg font-semibold font-Menu mt-5 mb-4"}>Recent Updates</Text>

          <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
          >
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

          <>
          <Text className={"text-lg font-semibold font-Menu mt-5 mb-4"}>Recomended</Text>
          </>

          <View className="bg-gray-400 rounded-xl py-20 mb-4 mx-2 shadow">
            <Text className={"text-2xl font-medium font-Title text-white text-center"}>MentorID</Text>
          </View>
          <View className="bg-gray-400 rounded-xl py-20 mb-4 mx-2 shadow">
            <Text className={"text-2xl font-medium font-Title text-white text-center"}>MentorID</Text>
          </View>
          <View className="bg-gray-400 rounded-xl py-20 mb-4 mx-2 shadow">
            <Text className={"text-2xl font-medium font-Title text-white text-center"}>MentorID</Text>
          </View>
          <View className="bg-gray-400 rounded-xl py-20 mb-2 mx-2 shadow">
            <Text className={"text-2xl font-medium font-Title text-white text-center"}>MentorID</Text>
          </View>

        </View>

      </ScrollView>




      <Button onPress={sendMessage} title="send" />
      {messages.map((item, index) => {
        return (
          <View key={index}>
            <Text>{item.message}</Text>
          </View>
        );
      })}
    </View>
  );
}

export default HomeScreen;
