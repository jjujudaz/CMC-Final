import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity, TextInput, Platform, KeyboardAvoidingView, ActivityIndicator, Alert } from "react-native";
import React, { useState, useEffect } from 'react';
import { supabase } from "@/app/supabase/initiliaze";
import { useRouter } from "expo-router";
import SegmentedControl from "@react-native-segmented-control/segmented-control";
import * as ImagePicker from "expo-image-picker";
import AWS from "aws-sdk";
import Constants from "expo-constants";

interface User {
    id: number;
    created_at: string;
    user_type: string;
    photoURL: string;
    email: string;
    name: string;
    bio: string;
    Location: string;
    DOB: string;
}

export default function UpdateProfile() {
    const [newDetail, setNewDetail] = useState({ Name: "", Bio: "", Role: "", DOB: "", Email: "", Location: "" });
    const [user, setUser] = useState<User | null>(null);
    const [session, setSession] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(false);
    const router = useRouter();

    // AWS S3 config
    const s3 = new AWS.S3({
        accessKeyId: Constants.expoConfig?.extra?.AWS_ACCESS_KEY_ID ?? "",
        secretAccessKey: Constants.expoConfig?.extra?.AWS_SECRET_ACCESS_KEY ?? "",
        region: Constants.expoConfig?.extra?.AWS_REGION ?? "",
    });

    // Fetch session and user data
    useEffect(() => {
        async function fetchSession() {
            const currentSession = await supabase.auth.getSession();
            setSession(currentSession.data.session);
        }
        fetchSession();

        const { data: authListener } = supabase.auth.onAuthStateChange(
            (_event, session) => setSession(session)
        );
        return () => {
            authListener.subscription.unsubscribe();
        };
    }, []);

    // Fetch user data
    useEffect(() => {
        async function fetchUser() {
            if (session && session.user) {
                setLoading(true);
                const { error, data } = await supabase.from("users").select("*").eq("email", session.user.email).single();
                if (!error) {
                    setUser(data);
                    setNewDetail({
                        Name: data.name || "",
                        Bio: data.bio || "",
                        Role: data.user_type || "",
                        DOB: data.DOB || "",
                        Email: data.email || "",
                        Location: data.Location || ""
                    });
                }
                setLoading(false);
            }
        }
        fetchUser();
    }, [session]);

    // Pick image and upload to S3, then update Supabase
    const pickAndUploadImage = async () => {
        try {
            const image = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!image.canceled) {
                setUploading(true);
                const uri = image.assets[0].uri;
                const response = await fetch(uri);
                const blob = await response.blob();
                const fileName = `profile-images/${Date.now()}-${Math.random().toString(36).substring(7)}.jpg`;

                const params = {
                    Bucket: Constants.expoConfig?.extra?.AWS_S3_BUCKET_NAME ?? "",
                    Key: fileName,
                    Body: blob,
                    ContentType: blob.type,
                    ACL: 'public-read',
                };

                const data = await s3.upload(params).promise();
                // Update photoURL in Supabase
                const { error } = await supabase
                    .from("users")
                    .update({ photoURL: data.Location })
                    .eq("email", user?.email);

                if (!error) {
                    setUser(prev => prev ? { ...prev, photoURL: data.Location } : prev);
                    Alert.alert("Success", "Profile photo updated!");
                } else {
                    Alert.alert("Error", "Failed to update profile photo.");
                }
            }
        } catch (err) {
            Alert.alert("Error", "Image upload failed.");
        } finally {
            setUploading(false);
        }
    };

    // Handle update
    const handleSubmit = async (email: string) => {
        const updatedFields: any = {};
        if (newDetail.Name) updatedFields.name = newDetail.Name;
        if (newDetail.Bio) updatedFields.bio = newDetail.Bio;
        if (newDetail.Role) updatedFields.user_type = newDetail.Role;
        if (newDetail.DOB) updatedFields.DOB = newDetail.DOB;
        if (newDetail.Email) updatedFields.email = newDetail.Email;
        if (newDetail.Location) updatedFields.Location = newDetail.Location;

        if (Object.keys(updatedFields).length > 0) {
            const { error } = await supabase
                .from("users")
                .update(updatedFields)
                .eq("email", email);

            if (!error) {
                setTimeout(() => {
                    router.canGoBack() ? router.back() : router.push("/profile");
                }, 1000);
            }
        }
    };

    // Handle delete
    const deleteUser = async (email: string) => {
        const { error } = await supabase.from("users").delete().eq("email", email);
        if (!error) {
            router.push("/login");
        }
    };

    // Handle cancel
    const handleCancel = () => {
        router.canGoBack() ? router.back() : router.push("/profile");
    };

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-white">
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            keyboardVerticalOffset={Platform.OS === "ios" ? 80 : 0}
            className="flex-1 bg-white"
        >
            <ScrollView 
                contentContainerStyle={{ flexGrow: 1 }} 
                keyboardShouldPersistTaps="handled" 
                className="bg-white"
            >
                <View className="w-full p-6 items-center">
                    <TouchableOpacity onPress={pickAndUploadImage} disabled={uploading}>
                        <Image
                            style={styles.profileAvatar}
                            className="rounded-full border-2 border-gray-200"
                            source={{ uri: user?.photoURL || 'https://avatar.iran.liara.run/public/41' }}
                        />
                        {uploading && (
                            <ActivityIndicator
                                style={{ position: "absolute", top: 40, left: 40 }}
                                size="large"
                                color="#3b82f6"
                            />
                        )}
                    </TouchableOpacity>
                </View>

                {user && (
                    <View className="px-6 w-full">
                        <Text className="text-base font-medium text-gray-700 mb-1">Name</Text>
                        <TextInput
                            value={newDetail.Name}
                            onChangeText={text => setNewDetail(prev => ({ ...prev, Name: text }))}
                            className="bg-gray-100 rounded-lg px-4 h-12 text-base mb-4 border border-gray-300"
                            placeholderTextColor="#6b7280"
                        />

                        <Text className="text-base font-medium text-gray-700 mb-1">Role</Text>
                        <SegmentedControl
                            values={["Student", "Tutor"]}
                            selectedIndex={newDetail.Role === "Tutor" ? 1 : 0}
                            onChange={event => {
                                const value = event.nativeEvent.selectedSegmentIndex === 1 ? "Tutor" : "Student";
                                setNewDetail(prev => ({ ...prev, Role: value }));
                            }}
                            className="mb-4"
                            tintColor="#3b82f6"
                        />

                        <Text className="text-base font-medium text-gray-700 mb-1">Bio</Text>
                        <TextInput
                            value={newDetail.Bio}
                            onChangeText={text => setNewDetail(prev => ({ ...prev, Bio: text }))}
                            className="bg-gray-100 rounded-lg px-4 h-12 text-base mb-4 border border-gray-300"
                            placeholderTextColor="#6b7280"
                            multiline
                        />

                        <Text className="text-base font-medium text-gray-700 mb-1">Date of Birth</Text>
                        <TextInput
                            value={newDetail.DOB}
                            onChangeText={text => setNewDetail(prev => ({ ...prev, DOB: text }))}
                            className="bg-gray-100 rounded-lg px-4 h-12 text-base mb-4 border border-gray-300"
                            placeholderTextColor="#6b7280"
                            placeholder="YYYY-MM-DD"
                        />

                        <Text className="text-base font-medium text-gray-700 mb-1">Email</Text>
                        <TextInput
                            value={newDetail.Email}
                            onChangeText={text => setNewDetail(prev => ({ ...prev, Email: text }))}
                            className="bg-gray-100 rounded-lg px-4 h-12 text-base mb-4 border border-gray-300"
                            placeholderTextColor="#6b7280"
                            keyboardType="email-address"
                        />

                        <Text className="text-base font-medium text-gray-700 mb-1">Location</Text>
                        <TextInput
                            value={newDetail.Location}
                            onChangeText={text => setNewDetail(prev => ({ ...prev, Location: text }))}
                            className="bg-gray-100 rounded-lg px-4 h-12 text-base mb-4 border border-gray-300"
                            placeholderTextColor="#6b7280"
                        />

                        <View className="flex-row justify-between mb-4">
                            <TouchableOpacity
                                onPress={handleCancel}
                                className="flex-1 mr-2 justify-center items-center bg-gray-300 rounded-lg h-12"
                            >
                                <Text className="text-lg font-medium text-gray-800">
                                    Cancel
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                onPress={() => handleSubmit(user.email)}
                                className="flex-1 ml-2 justify-center items-center bg-blue-500 rounded-lg h-12"
                            >
                                <Text className="text-lg font-medium text-white">
                                    Update
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                            onPress={() => deleteUser(user.email)}
                            className="w-full justify-center items-center bg-red-600 rounded-lg h-12 mb-8"
                        >
                            <Text className="text-lg font-medium text-white">
                                Delete Account
                            </Text>
                        </TouchableOpacity>
                    </View>
                )}
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    profileAvatar: {
        width: 120,
        height: 120,
        marginBottom: 20,
    },
});