import { useEffect, useState } from "react";
import { View, Text, Image, TextInput, Button } from "react-native";
import {app} from "./firebase/firebse_initialize";
import { useRouter } from "expo-router";
 
export default function HomeScreen() {
  const router = useRouter()
  useEffect(() => {
      if(app){
        setTimeout(() => {
          router.replace('/register')
        }, 2000)
      }

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