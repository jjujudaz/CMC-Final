import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import "./global.css";
import { useEffect } from "react";

function RootLayout() {
  // Load custom fonts.
  const [loaded, error] = useFonts({
    'OpenSans-Regular': require('../assets/fonts/OpenSans-Regular.ttf'),
    'Roboto-Regular': require('../assets/fonts/Roboto-Regular.ttf'),
    'Urbanist-Regular': require('../assets/fonts/Urbanist-Regular.ttf')
  });

  // Log any errors that occur during font loading.
  useEffect(() => {
    if (error) {
      console.error("Error loading fonts:", error);
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="register" options={{ title: "Register" }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="home" options={{ title: "Home" }} />
      <Stack.Screen name="login" options={{ title: "Login" }} />
      <Stack.Screen name="profile" options={{ title: "Profile" }} />
    </Stack>
  );
}

export default RootLayout;