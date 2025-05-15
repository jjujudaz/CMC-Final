import { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, Button, Alert, StyleSheet } from "react-native";
import { getAuth } from "firebase/auth";
import { supabase } from "@/app/supabase/initiliaze"; // Ensure this path is correct
import Ionicons from '@expo/vector-icons/Ionicons';

// Define an interface for the Tutor object from Supabase
interface Tutor {
  id: string; // Supabase user ID
  name: string;
  photoURL?: string | null;
  user_type: string; // Will be 'tutor' for these users
  // Add any other fields you might want to display, e.g., bio
}

function CyberMatchScreen() {
  const [recommendedTutors, setRecommendedTutors] = useState<Tutor[]>([]);
  const [currentUserSupabaseId, setCurrentUserSupabaseId] = useState<string | null>(null);
  // Optional: Add loading and error states for better UX
  // const [isLoading, setIsLoading] = useState(true);
  // const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCurrentSupabaseUserId();
    fetchTutors();
  }, []);

  async function fetchCurrentSupabaseUserId() {
    const auth = getAuth();
    const firebaseUser = auth.currentUser;

    if (firebaseUser && firebaseUser.email) {
      try {
        const { data, error: fetchUserError } = await supabase
          .from("users")
          .select("id")
          .eq("email", firebaseUser.email) // Assumes email in Firebase Auth matches email in Supabase users table
          .single();

        if (fetchUserError) {
          console.error("Error fetching current user's Supabase ID:", fetchUserError.message);
          // setError("Could not load your user profile.");
          return;
        }
        if (data) {
          setCurrentUserSupabaseId(data.id);
        }
      } catch (e: any) {
        console.error("Exception fetching current user's Supabase ID:", e.message);
        // setError("An unexpected error occurred while fetching your profile.");
      }
    } else {
      console.warn("CyberMatchScreen: No Firebase user logged in or email is missing.");
      // Handle appropriately, e.g., show message or redirect
    }
  }

  async function fetchTutors() {
    // setIsLoading(true);
    // setError(null);
    try {
      // Fetch users who are tutors.
      const { data, error: fetchTutorsError } = await supabase
        .from("users")
        .select("id, name, photoURL, user_type") // Selecting user_type
        .eq("user_type", "tutor");

      if (fetchTutorsError) {
        console.error("Error fetching tutors:", fetchTutorsError.message);
        // setError("Failed to load recommended tutors.");
        setRecommendedTutors([]);
        return;
      }
      if (data) {
        setRecommendedTutors(data as Tutor[]);
      }
    } catch (e: any) {
      console.error("Exception fetching tutors:", e.message);
      // setError("An unexpected error occurred while fetching tutors.");
      setRecommendedTutors([]);
    } finally {
      // setIsLoading(false);
    }
  }

  async function handleRequestMentorship(tutorId: string) {
    if (!currentUserSupabaseId) {
      Alert.alert("Error", "Your user profile could not be loaded. Please log in and try again.");
      console.error("handleRequestMentorship: Current user's Supabase ID is not available.");
      return;
    }

    try {
      const { error: insertError } = await supabase
        .from("request_mentorship") // Your Supabase table name for requests
        .insert([{ student_id: currentUserSupabaseId, tutor_id: tutorId, status: 'pending' }]); // Added a default status

      if (insertError) {
        console.error("Error creating mentorship request:", insertError.message);
        Alert.alert("Error", `Failed to send mentorship request: ${insertError.message}`);
      } else {
        Alert.alert("Success", "Mentorship request sent successfully!");
        // Optionally, you could update the UI for this specific tutor,
        // e.g., change button text to "Request Sent" or disable it.
      }
    } catch (e: any) {
      console.error("Exception creating mentorship request:", e.message);
      Alert.alert("Error", "An unexpected error occurred while sending the request.");
    }
  }

  // if (isLoading) {
  //   return <View className="flex-1 justify-center items-center"><Text>Loading...</Text></View>;
  // }

  // if (error) {
  //   return <View className="flex-1 justify-center items-center"><Text>Error: {error}</Text></View>;
  // }

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }} // Added padding for better scrolling
      >
        <Text
          style={{ fontFamily: "OpenSans-Regular" }} // Make sure this font is loaded in your app
          className="w-5/6 self-center text-xl text-center mt-8 mb-4" // Added mb-4 for spacing
        >
          Based on your interests, we recommend the following mentors:
        </Text>

        {recommendedTutors.length === 0 && (
          <Text className="text-center text-gray-500 mt-10">No tutors available at the moment.</Text>
        )}

        {recommendedTutors.map((tutor) => (
          <View
            key={tutor.id}
            className="flex-row mt-4 mx-7 border border-gray-300 rounded-lg p-4 bg-white shadow-sm" // Adjusted mx, border, added bg and shadow
          >
            {/* Left column: Image and Bookmark Icon */}
            <View className="flex-col items-center gap-y-2 mr-3"> {/* Adjusted gap and margin */}
              <Image
                source={tutor.photoURL ? { uri: tutor.photoURL } : require('../../assets/images/icon.png')} // Fallback to a local default avatar
                style={{ width: 60, height: 60 }}
                className="rounded-full border-2 border-gray-200"
              />
              <Ionicons name="bookmark-outline" size={24} color="gray" className="self-center" />
            </View>

            {/* Right column: Mentor details and Button */}
            <View className="flex-1 flex-col gap-y-1"> {/* Changed to flex-1 and adjusted gap */}
              <Text style={{ fontFamily: "OpenSans-Bold" }} className="text-lg">
                {tutor.name || "Mentor Name"}
              </Text>
              <Text style={{ fontFamily: "OpenSans-Regular" }} className="mb-2 text-gray-600 capitalize">
                {tutor.user_type} {/* Display 'Tutor' (capitalized) */}
              </Text>
              <View className="mt-auto"> {/* Pushes button to the bottom of this column if content above is short */}
                <Button
                  title="Request Mentorship"
                  onPress={() => handleRequestMentorship(tutor.id)}
                  color="#155dfc" // Blue color for the button
                />
              </View>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

export default CyberMatchScreen;

// Optional: Add some basic styles if not using Tailwind for everything or for specific overrides
// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#fff',
//   },
// });