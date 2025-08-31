import { View, Text, TextInput, Image, FlatList, ActivityIndicator } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import CustomHeader from "@/components/CustomHeader";
import React, { useState, useEffect } from "react";
import { fetchMentors } from "@/components/fetchMentorAPI";
import { useRouter } from "expo-router";
import SearchBar from "@/components/SearchBar";

const FindMentors = () => {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [mentors, setMentors] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const loadMentors = async () => {
            setLoading(true);
            try {
                if (query.trim()) {
                    const results = await fetchMentors(query);
                    setMentors(results || []);
                } else {
                    const results = await fetchMentors();
                    setMentors(results || []);
                }
            } catch (err) {
                console.error("Error fetching mentors:", err);
                setMentors([]);
            } finally {
                setLoading(false);
            }
        };

        loadMentors();
    }, [query]);

    return (
        <View className="flex-1 bg-white pt-10">
            <CustomHeader />


            {/* Mentor list */}
            <FlatList
                data={mentors}
                keyExtractor={(item) => item.name.toString()}
                renderItem={({ item }) => (
                    <View className="flex-row items-center px-4 py-3 border-b border-gray-200">
                        {item.photoURL ? (
                            <Image
                                source={{ uri: item.photoURL }}
                                className="h-12 w-12 rounded-full mr-3"
                            />
                        ) : (
                            <View className="h-12 w-12 rounded-full bg-gray-300 mr-3 items-center justify-center">
                                <Ionicons name="person" size={20} color="white" />
                            </View>
                        )}

                        <View className="flex-1">
                            <Text className="font-semibold text-gray-900">{item.name}</Text>
                            <Text className="text-gray-600 text-sm">
                                {item.skills?.join(", ") || "No skills listed"}
                            </Text>
                        </View>
                    </View>
                )}
                ListEmptyComponent={
                    !loading && (
                        <Text className="text-center text-gray-500 mt-6">
                            No mentors found
                        </Text>
                    )
                }
            ListHeaderComponent={
                <>
                <View>
                    <SearchBar
                    value={query}
                    onChangeText={(text:string) => setQuery(text)}
                    placeholder="Search for a mentor..."
                    />
                </View>

                    {loading && (
                        <ActivityIndicator size="small" className="my-2"/>
                    )}

                    {!loading && query.trim().length > 0 && (
                        <Text
                            className="text-base text-gray-800 pl-4 pb-1"
                        >
                            Search mentors for "{query}"
                        </Text>
                    )}
                </>

            }

            />
        </View>




    );
};

export default FindMentors;


/*
      <View className='flex-row self-center items-center mt-4 p-2 bg-gray-200 w-5/6 rounded-full'>
        <Ionicons name='search' size={20} className='ml-2' color="black" />
        <TextInput
        placeholder='Search'
        className='text-lg ml-2'
        />
        <Ionicons name='filter-sharp' size={20} className='ml-auto mr-4' color="black" />
      </View>

      <Text style={{ fontFamily: "OpenSans-Bold" }} className='text-xl mt-4 ml-8'>
        Recommended Mentors
      </Text>
      <View className="flex-row mt-4 mx-8 gap-4">
        <Image
          source={{uri: "https://avatar.iran.liara.run/public/20"}}
          style={{ width: 80, height: 80 }}
          className="rounded-full border-2 border-gray-200"
        />
        <Image
          source={{uri: "https://avatar.iran.liara.run/public/40"}}
          style={{ width: 80, height: 80 }}
          className="rounded-full border-2 border-gray-200"
        />
        <Image
          source={{uri: "https://avatar.iran.liara.run/public/60"}}
          style={{ width: 80, height: 80 }}
          className="rounded-full border-2 border-gray-200"
        />
        <Image
          source={{uri: "https://avatar.iran.liara.run/public/80"}}
          style={{ width: 80, height: 80 }}
          className="rounded-full border-2 border-gray-200"
        />
      </View>

      <Text style={{ fontFamily: "OpenSans-Bold" }} className='text-xl mt-4 ml-8'>
        Mentors Near You
      </Text>
      <View className="flex-row mt-4 mx-8 gap-4">
        <Image
          source={{uri: "https://avatar.iran.liara.run/public/20"}}
          style={{ width: 80, height: 80 }}
          className="rounded-full border-2 border-gray-200"
        />
        <Image
          source={{uri: "https://avatar.iran.liara.run/public/40"}}
          style={{ width: 80, height: 80 }}
          className="rounded-full border-2 border-gray-200"
        />
        <Image
          source={{uri: "https://avatar.iran.liara.run/public/60"}}
          style={{ width: 80, height: 80 }}
          className="rounded-full border-2 border-gray-200"
        />
        <Image
          source={{uri: "https://avatar.iran.liara.run/public/80"}}
          style={{ width: 80, height: 80 }}
          className="rounded-full border-2 border-gray-200"
        />
      </View>

      <Text style={{ fontFamily: "OpenSans-Bold" }} className='text-xl mt-4 ml-8'>
        Recent Projects
      </Text>
      <View className="flex-row mt-4 mx-8 border border-gray-400 rounded-lg p-4">
        <Image
          source={{uri: "https://avatar.iran.liara.run/public/57"}}
          style={{ width: 60, height: 60 }}
          className="rounded-full border-2 border-gray-200"
        />
        <View className="flex-col w-72 ml-4 gap-2">
          <Text style={{ fontFamily: "OpenSans-Bold" }}>
            "This is a sample project title"
          </Text>
          <Text style={{ fontFamily: "OpenSans-Regular" }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </Text>
        </View>
      </View>

      <View className="flex-row mt-4 mx-8 border border-gray-400 rounded-lg p-4">
        <Image
          source={{uri: "https://avatar.iran.liara.run/public/74"}}
          style={{ width: 60, height: 60 }}
          className="rounded-full border-2 border-gray-200"
        />
        <View className="flex-col w-72 ml-4 gap-2">
          <Text style={{ fontFamily: "OpenSans-Bold" }}>
            "This is a sample project title"
          </Text>
          <Text style={{ fontFamily: "OpenSans-Regular" }}>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </Text>
        </View>
      </View>
    </View>
  );
}
            */

