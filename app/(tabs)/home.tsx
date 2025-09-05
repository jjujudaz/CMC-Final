import React, { useEffect, useState } from "react";
import {View, Text, TextInput, Button, ScrollView, Image, TouchableOpacity} from "react-native";
import { getAuth } from "firebase/auth";
import {
  getDatabase,
  ref,
  onValue,
  update,
  push,
  child,
} from "firebase/database";
import {useRouter} from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import UserInfo from "../firebase/getUserInfo";
import { supabase } from "@/app/supabase/initiliaze";
import Ionicons from '@expo/vector-icons/Ionicons';
import Feather from '@expo/vector-icons/Feather';
import CustomHeader from "@/components/CustomHeader";
import SearchBar from "@/components/SearchBar";
import { useNavigation } from "@react-navigation/native";


function HomeScreen() {
  const [welcomeMessage, setWelcomeMessage] = useState<String>("");
  const [textMessage, setTextMessage] = useState<string>("");
  const [messages, setMessages] = useState([]);
  const [photoUrl, setPhotoUrl] = useState(null);
  const [tutors, setTutors] = useState([]);
  const [mentors, setMentors] = useState([]);
  const [loadingMentors, setLoadingMentors] = useState(false);
  const router = useRouter();
  const navigation = useNavigation();

  useEffect(() => {
    fetchUser();
    initializeUser();
    fetchMentors();
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
/*
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
 */

  async function fetchMentors() {
    try {
      const { data, error } = await supabase.from("mentors").select("*");

      if (error) {
        console.error("Error fetching mentors:", error.message);
        return [];
      }

      if (data) {
        const shuffledMentors = data.sort(() => 0.5 - Math.random()); //shuffle select 5 mentors
        return shuffledMentors.slice(0, 5);
      }
      return [];
    } catch (error) {
      console.error("Supabase fetch error:", error);
      return [];
    }
  }

  useEffect(() => {
    const loadMentors = async () => {
      setLoadingMentors(true);
      const mentorData = await fetchMentors();
      setMentors(mentorData);
      setLoadingMentors(false);
    };

    loadMentors();
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
    <View className=" flex-1 bg-white pt-10">
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ minHeight: "100%", paddingBottom: 10 }}
      >
        <CustomHeader />
        <Text className="text-4xl font-bold font-Title text-black text-center pt-5">
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
        <View className={"flex-1 mt-4 mx-8 mb-5"}>
          <TouchableOpacity
              className=
                "flex-row items-center bg-white rounded-full px-5 h-16 border border-gray-400"
              onPress={() => navigation.navigate("Explore")}
          >
            <Ionicons name="search-outline" size={24} color="black" />

            <Text
                className="flex-1 ml-2 font-Text text-lg font-normal text-gray-600">
              "Search for a mentor..."
            </Text>
          </TouchableOpacity>
        </View>

          <Text className={"text-lg font-extrabold font-Menu ml-7 mb-4"}>
            Recent Updates
          </Text>


          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row gap-5 ml-7 mb-5">
              <Image
                source={{uri: "https://avatar.iran.liara.run/public/"}}
                style={{width:80,height:80,}}
                className="rounded-full border-2 border-gray-200"
             />
              <Image
                  source={{uri: "https://avatar.iran.liara.run/public/"}}
                  style={{width:80,height:80,}}
                  className="rounded-full border-2 border-gray-200"
              />
              <Image
                  source={{uri: "https://avatar.iran.liara.run/public/"}}
                  style={{width:80,height:80,}}
                  className="rounded-full border-2 border-gray-200"
              />
              <Image
                  source={{uri: "https://avatar.iran.liara.run/public/"}}
                  style={{width:80,height:80,}}
                  className="rounded-full border-2 border-gray-200"
              />
              <Image
                  source={{uri: "https://avatar.iran.liara.run/public/"}}
                  style={{width:80,height:80,}}
                  className="rounded-full border-2 border-gray-200"
              />
              <Image
                  source={{uri: "https://avatar.iran.liara.run/public/"}}
                  style={{width:80,height:80,}}
                  className="rounded-full border-2 border-gray-300"
              />

            </View>
          </ScrollView>

        <Text className="text-lg font-extrabold font-Menu ml-7 mb-4 ">
          Recommended Mentors
        </Text>

        {loadingMentors ? (
            <Text className="ml-7 text-gray-500">Loading mentors...</Text>
        ) : (
            mentors.map((mentor, index) => (
                <View key={index} className="bg-white rounded-xl mb-4 mx-7 border border-stone-400 p-4">
                  <View className="flex-row items-center">
                    {mentor.photoURL ? (
                        <Image
                            source={{ uri: mentor.photoURL }}
                            className="h-14 w-14 rounded-full mr-4 border-stone-400"
                        />
                    ) : (
                        <View className="h-14 w-14 rounded-full bg-gray-300 mr-4 items-center justify-center">
                      <Ionicons name="person" size={30} color="white"/>
                        </View>
                    )}

                    <View className="flex-1">
                      <Text className="font-Menu font-bold text-black text-lg">
                        {mentor.name || "Unknown User"}
                      </Text>

                      {/* Display skills, specialised roles, and experience */}
                      {mentor.skills && (
                          <Text className="font-Text mt-1">
                            <Text className="font-medium text-gray-700">Skills: </Text>
                            <Text className="font-normal text-gray-700">{mentor.skills.join(", ")}</Text>
                          </Text>
                      )}
                      {mentor.specialization_roles && (
                          <Text className="font-Text mt-1">
                            <Text className="font-medium text-gray-700">Specialised Roles: </Text>
                            <Text className="font-normal text-gray-700">{mentor.specialization_roles.join(", ")}</Text>
                          </Text>
                      )}
                      {mentor.experience_level && (
                          <Text className="font-Text mt-1">
                            <Text className="font-medium text-gray-700">Experience Level: </Text>
                            <Text className="font-normal text-gray-700">{mentor.experience_level}</Text>
                          </Text>
                      )}

                      <Text className="text-[14px] font-Menu font-light text-gray-500 mt-1">
                        Mentor since: {mentor.created_at ? new Date(mentor.created_at).toLocaleDateString() : "N/A"}
                      </Text>
                    </View>
                  </View>
                </View>
            ))
        )}



      </ScrollView>
    </View>
  );
}

export default HomeScreen;