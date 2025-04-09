import { useEffect } from "react";
import { View, Text, Image } from "react-native";
import { firebaseConfig } from "./firebase/firebse_initialize";
import { initializeApp } from "firebase/app";
import { getDatabase, set, ref } from "firebase/database";
import { router } from "expo-router";

export default function HomeScreen() {
  useEffect(() => {
    // Initialize Firebase App
    const app = initializeApp(firebaseConfig);

    // Initialize Firebase Database
    const database = getDatabase(app);

    console.log("Firebase App Initialized:", app.name);
    console.log("Database Initialized:", database);

    // Example: Navigate to home after initialization
    setTimeout(() => {
      router.push('/home')
    }, 2000);
  }, []);


 
  return (
    <View
      style={{
        backgroundColor: "#16519f",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        source={require("../assets/images/icon.png")}
        style={{ width: 300, height: 300 }}
      />
      <Text style={{ color: "#fff", fontSize: 30 }}>Coffee Meets Careers</Text>
    </View>
  );
}