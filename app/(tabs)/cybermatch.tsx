import { useEffect, useState } from "react";
import { View, Text, ScrollView, Image, Button, Alert } from "react-native";
import { supabase } from "@/app/supabase/initiliaze";
import Ionicons from '@expo/vector-icons/Ionicons';

interface Tutor {
  id: string;
  name: string;
  photoURL?: string | null;
  user_type: string;
}

function CyberMatchScreen() {
  const [recommendedTutors, setRecommendedTutors] = useState<Tutor[]>([]);
  const [currentUserSupabaseId, setCurrentUserSupabaseId] = useState<string | null>(null);

  useEffect(() => {
    fetchCurrentSupabaseUserId();
    fetchTutors();
  }, []);

  async function fetchCurrentSupabaseUserId() {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error || !session?.user?.email) {
      Alert.alert("Error", "You are not logged in.");
      return;
    }
    try {
      const { data, error: fetchUserError } = await supabase
        .from("users")
        .select("id")
        .eq("email", session.user.email)
        .single();

      if (fetchUserError || !data?.id) {
        Alert.alert("Error", "Could not load your user profile.");
        return;
      }
      setCurrentUserSupabaseId(data.id);
    } catch (e: any) {
      Alert.alert("Error", "An unexpected error occurred while fetching your profile.");
    }
  }

  async function fetchTutors() {
    try {
      const { data, error: fetchTutorsError } = await supabase
        .from("users")
        .select("id, name, photoURL, user_type")
        .eq("user_type", "tutor");

      if (fetchTutorsError) {
        setRecommendedTutors([]);
        return;
      }
      if (data) {
        setRecommendedTutors(data as Tutor[]);
      }
    } catch (e: any) {
      setRecommendedTutors([]);
    }
  }

  async function handleRequestMentorship(tutorId: string) {
    if (!currentUserSupabaseId) {
      Alert.alert("Error", "Your user profile could not be loaded. Please log in and try again.");
      return;
    }

    try {
      const { error: insertError } = await supabase
        .from("request_mentorship")
        .insert([{ student_id: currentUserSupabaseId, tutor_id: tutorId, status: 'pending' }]);

      if (insertError) {
        Alert.alert("Error", `Failed to send mentorship request: ${insertError.message}`);
      } else {
        Alert.alert("Success", "Mentorship request sent successfully!");
      }
    } catch (e: any) {
      Alert.alert("Error", "An unexpected error occurred while sending the request.");
    }
  }

  return (
    <View className="flex-1 bg-white">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 20 }}
      >
        <Text
          style={{ fontFamily: "OpenSans-Regular" }}
          className="w-5/6 self-center text-xl text-center mt-8 mb-4"
        >
          Based on your interests, we recommend the following mentors:
        </Text>

        {recommendedTutors.length === 0 && (
          <Text className="text-center text-gray-500 mt-10">No tutors available at the moment.</Text>
        )}

        {recommendedTutors.map((tutor) => (
          <View
            key={tutor.id}
            className="flex-row mt-4 mx-7 border border-gray-300 rounded-lg p-4 bg-white shadow-sm"
          >
            <View className="flex-col items-center gap-y-2 mr-3">
              <Image
                source={tutor.photoURL ? { uri: tutor.photoURL } : require('../../assets/images/icon.png')}
                style={{ width: 60, height: 60 }}
                className="rounded-full border-2 border-gray-200"
              />
              <Ionicons name="bookmark-outline" size={24} color="gray" className="self-center" />
            </View>
            <View className="flex-1 flex-col gap-y-1">
              <Text style={{ fontFamily: "OpenSans-Bold" }} className="text-lg">
                {tutor.name || "Mentor Name"}
              </Text>
              <Text style={{ fontFamily: "OpenSans-Regular" }} className="mb-2 text-gray-600 capitalize">
                {tutor.user_type}
              </Text>
              <View className="mt-auto">
                <Button
                  title="Request Mentorship"
                  onPress={() => handleRequestMentorship(tutor.id)}
                  color="#155dfc"
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