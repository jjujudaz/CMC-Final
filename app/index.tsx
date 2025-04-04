import { useEffect } from "react";
import { View, Text, Image } from "react-native";
import { app } from "./firebase/firebse_initialize";

export default function HomeScreen() {
  useEffect(() => {

    console.log("Firebase initialized:", app);
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
        source={require("./icon.png")}
        style={{ width: 300, height: 300 }}
      />
      <Text style={{ color: "#fff", fontSize: 30 }}>Coffee Meets Careers</Text>
    </View>
  );
}