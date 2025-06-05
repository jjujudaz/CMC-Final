import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import "./global.css";
import { useEffect } from "react";

function RootLayout() {
  const [loaded, error] = useFonts({
    "OpenSans-Regular": require("../assets/fonts/OpenSans-Regular.ttf"),
    "Roboto-Regular": require("../assets/fonts/Roboto-Regular.ttf"),
    "Urbanist-Regular": require("../assets/fonts/Urbanist-Regular.ttf"),
    "OpenSans-Bold": require("../assets/fonts/OpenSans-Bold.ttf"),
    "Roboto-Bold": require("../assets/fonts/Roboto-Bold.ttf"),
    "Urbanist-Bold": require("../assets/fonts/Urbanist-Bold.ttf"),
    "OpenSans-Italic": require("../assets/fonts/OpenSans-Italic.ttf"),
    "Roboto-Italic": require("../assets/fonts/Roboto-Italic.ttf"),
    "Urbanist-Italic": require("../assets/fonts/Urbanist-Italic.ttf"),
    "OpenSans-BoldItalic": require("../assets/fonts/OpenSans-BoldItalic.ttf"),
    "Roboto-BoldItalic": require("../assets/fonts/Roboto-BoldItalic.ttf"),
    "Urbanist-BoldItalic": require("../assets/fonts/Urbanist-BoldItalic.ttf"),
  });

  useEffect(() => {
    if (error) {
      console.error("Error loading fonts.", error);
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null; // Or a loading indicator
  }

  return (
    <Stack>
      {/* This screen will render the TabLayout from app/(tabs)/_layout.tsx */}
      <Stack.Screen
        name="(tabs)"
        options={{
          headerBackVisible: false, // No back button on tabs
          headerTitle: '',          // No static title, let tabs set their own
        }}
      />

      {/* Other stack screens outside the tab navigator */}
      <Stack.Screen name="register" options={{ title: "Register" }} />
      <Stack.Screen name="home" options={{ title: "Home" }} />
      <Stack.Screen name="login" options={{ title: "Login" }} />
      <Stack.Screen name="profile" options={{ title: "Profile" }} />
      <Stack.Screen name="notifications" options={{ title: "Notifications" }} />
      <Stack.Screen name="settings" options={{ title: "Settings" }} />
      <Stack.Screen name="findmentors" options={{ title: "Find Mentors" }} />
      <Stack.Screen name="cybermatch" options={{ title: "Cyber Match" }} />
       <Stack.Screen name="chat" options={{ title: "Chat Match" }} />
    </Stack>
  );
}

export default RootLayout;