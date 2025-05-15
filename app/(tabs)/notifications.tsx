import { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, Button, Alert, StyleSheet } from "react-native";
import { getAuth } from "firebase/auth";
import { supabase } from "@/app/supabase/initiliaze"; // Ensure this path is correct

// Interface for the structure of a mentorship request
interface MentorshipRequest {
  id: string;
  created_at: string;
  status: 'pending' | 'accepted' | 'declined';
  student_id: string;
  tutor_id: string;
}

function NotificationsScreen() {
  const [requests, setRequests] = useState<MentorshipRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchCurrentSupabaseUserIdAndRequests();
  }, []);

  async function fetchCurrentSupabaseUserIdAndRequests() {
    setIsLoading(true);
    const auth = getAuth();
    const firebaseUser = auth.currentUser;

    if (firebaseUser && firebaseUser.email) {
      try {
        const { data: userData, error: userError } = await supabase
          .from("users")
          .select("id")
          .eq("email", firebaseUser.email)
          .single(); // Expecting one user for the email

        if (userError) {
          console.error("Error fetching current user's Supabase ID:", userError.message);
          Alert.alert("Error", "Could not verify your user profile.");
          setIsLoading(false);
          return;
        }

        if (userData && userData.id) {
          const tutorSupabaseId = userData.id;
          console.log("Current Tutor Supabase ID:", tutorSupabaseId);
          fetchMentorshipRequests(tutorSupabaseId);
        } else {
          console.log("No Supabase user found for the current Firebase email.");
          Alert.alert("Error", "User profile not found.");
          setIsLoading(false);
        }
      } catch (e: any) {
        console.error("Exception fetching user ID:", e.message);
        Alert.alert("Error", "An unexpected error occurred while fetching your profile.");
        setIsLoading(false);
      }
    } else {
      console.log("No Firebase user logged in or email is missing.");
      Alert.alert("Error", "You are not logged in.");
      setIsLoading(false);
    }
  }

  async function fetchMentorshipRequests(tutorSupabaseId: string) {
    try {
      console.log(`Fetching all requests for tutor_id: ${tutorSupabaseId}`);

      const { data, error } = await supabase
        .from('request_mentorship')
        .select(`
          id,
          created_at,
          status,
          student_id,
          tutor_id
        `)
        .eq('tutor_id', tutorSupabaseId) // Fetch all requests for this tutor
        .order('created_at', { ascending: false });

      console.log("Raw data from Supabase (fetchMentorshipRequests):", JSON.stringify(data, null, 2));
      console.log("Error from Supabase (fetchMentorshipRequests):", error);

      if (error) {
        console.error('Error fetching mentorship requests:', error.message);
        Alert.alert("Error", `Could not load mentorship requests: ${error.message}`);
        setRequests([]);
      } else if (data) {
        setRequests(data as MentorshipRequest[]);
      } else {
        setRequests([]);
      }
    } catch (e: any) {
      console.error("Exception fetching mentorship requests:", e.message);
      Alert.alert("Error", "An unexpected error occurred while fetching requests.");
      setRequests([]);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleRequestAction(requestId: string, newStatus: 'accepted' | 'declined') {
    console.log(`Attempting to update request ID: ${requestId} to status: ${newStatus}`);
    try {
      // Temporarily remove .single() for debugging the PGRST116 error
      // This will help see if any rows are returned at all by the select()
      const { data: updateData, error } = await supabase
        .from('request_mentorship')
        .update({ status: newStatus })
        .eq('id', requestId)
        .select(); // REMOVED .single() for now

      console.log("Data from update operation (select()):", JSON.stringify(updateData, null, 2));
      console.log("Error from update operation:", JSON.stringify(error, null, 2));

      if (error) {
        // This error might still be PGRST116 if .single() was the primary cause,
        // or it could be a different RLS-related error now.
        console.error(`Error updating request to ${newStatus}:`, JSON.stringify(error, null, 2));
        Alert.alert('Error', `Could not ${newStatus === 'accepted' ? 'accept' : 'decline'} the request. Details: ${error.message}`);
      } else if (updateData && updateData.length > 0) {
        // If updateData is an array and has items, the update likely affected rows.
        // We'll assume the first item is the one we care about if .select() returned multiple (though .eq('id', ...) should make it one).
        Alert.alert('Success', `Request ${newStatus}.`);
        setRequests(prevRequests =>
          prevRequests.map(req =>
            req.id === requestId ? { ...req, status: newStatus } : req
          )
        );
        console.log("Updated request in local state:", updateData[0]);
      } else if (updateData && updateData.length === 0) {
        // This means .select() returned an empty array: 0 rows were affected by the update.
        // MOST LIKELY RLS PREVENTED THE UPDATE or THE ROW ID DOESN'T EXIST/MATCH.
        console.warn("Request update affected 0 rows. Check RLS policies for UPDATE on 'request_mentorship' table and ensure the row ID exists and is correct.");
        Alert.alert('Notice', `Request status may not have updated. Please verify RLS policies or refresh.`);
      } else {
        // Other unexpected cases
        console.warn("Request update did not return expected data. Check RLS policies and row ID.");
        Alert.alert('Notice', `Request status update is uncertain. Please refresh.`);
      }
    } catch (e: any) {
      console.error(`Exception updating request to ${newStatus}:`, e.message);
      Alert.alert('Error', `An unexpected error occurred.`);
    }
  }

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <Text>Loading notifications...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-100">
      <Text style={{ fontFamily: "OpenSans-Regular" }} className="text-2xl font-bold ml-4 mt-6 mb-4">
        Mentorship Requests
      </Text>
      {requests.length === 0 ? (
        <Text style={{ fontFamily: "OpenSans-Regular" }} className="text-center text-gray-500 mt-5">
          No mentorship requests found.
        </Text>
      ) : (
        requests.map((request) => (
          <View key={request.id} className="bg-white shadow-md rounded-lg mx-4 mb-4 p-4 border border-gray-200">
            <View className="flex-row items-center">
              <Image
                source={require('../../assets/images/icon.png')} // Generic fallback image
                style={styles.avatar}
                className="rounded-full"
              />
              <View className="ml-4 flex-1">
                <Text style={{ fontFamily: "OpenSans-Bold" }} className="text-base">
                  Student ID: {request.student_id}
                </Text>
                <Text style={{ fontFamily: "OpenSans-Regular" }} className="text-sm text-gray-600 mt-1">
                  Requested on: {new Date(request.created_at).toLocaleDateString()}
                </Text>
                <Text
                  style={{ fontFamily: "OpenSans-Bold" }}
                  className={`text-sm mt-1 ${
                    request.status === 'pending' ? 'text-yellow-600' :
                    request.status === 'accepted' ? 'text-green-600' :
                    'text-red-600'
                  }`}
                >
                  Status: {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                </Text>
              </View>
            </View>
            {request.status === 'pending' && (
              <View className="flex-row justify-end mt-3 gap-x-3">
                <Button
                  title="Decline"
                  onPress={() => handleRequestAction(request.id, 'declined')}
                  color="red"
                />
                <Button
                  title="Accept"
                  onPress={() => handleRequestAction(request.id, 'accepted')}
                  color="green"
                />
              </View>
            )}
          </View>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  avatar: {
    width: 60,
    height: 60,
  },
});

export default NotificationsScreen;