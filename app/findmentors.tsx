import { View, Text, TextInput, Image, ScrollView } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import CustomHeader from "@/components/CustomHeader";

function FindMentorsScreen() {
  return (
    <View className="flex-1 bg-white">
        <ScrollView>
            <CustomHeader />
            <Text className="text-3xl font-bold font-Title text-black text-center pb-4">
                Explore Mentors
            </Text>
      <View className=
                "flex-row items-center self-center bg-white rounded-full w-5/6 px-5 h-16 border border-gray-400">
        <Ionicons name='search' size={20} className='ml-2' color="black" />
        <TextInput
        placeholder='Search'
        className='text-lg ml-2'
        />
        <Ionicons name='filter-sharp' size={20} className='ml-auto mr-4' color="black" />
      </View>

      <Text className='font-Text text-xl mt-4 ml-8'>
        Recommended Mentors
      </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row gap-5 ml-7 mt-4 mb-4">
                    <Image
                        source={{uri: "https://avatar.iran.liara.run/public/"}}
                        style={{width:80,height:80,}}
                        className="rounded-full border-2 border-gray-200"
                    />
                    <Image
                        source={{uri: "https://avatar.iran.liara.run/public/"}}
                        style={{width:80,height:80,}}
                        className="rounded-full border-2 border-gray-200"
                    />
                    <Image
                        source={{uri: "https://avatar.iran.liara.run/public/"}}
                        style={{width:80,height:80,}}
                        className="rounded-full border-2 border-gray-200"
                    />
                    <Image
                        source={{uri: "https://avatar.iran.liara.run/public/"}}
                        style={{width:80,height:80,}}
                        className="rounded-full border-2 border-gray-200"
                    />
                    <Image
                        source={{uri: "https://avatar.iran.liara.run/public/"}}
                        style={{width:80,height:80,}}
                        className="rounded-full border-2 border-gray-200"
                    />
                    <Image
                        source={{uri: "https://avatar.iran.liara.run/public/"}}
                        style={{width:80,height:80,}}
                        className="rounded-full border-2 border-gray-300"
                    />

                </View>
            </ScrollView>

      <Text className='font-Text text-xl mt-4 ml-8'>
        Mentors Near You
      </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                <View className="flex-row gap-5 ml-7 mt-4 mb-4">
                    <Image
                        source={{uri: "https://avatar.iran.liara.run/public/"}}
                        style={{width:80,height:80,}}
                        className="rounded-full border-2 border-gray-200"
                    />
                    <Image
                        source={{uri: "https://avatar.iran.liara.run/public/"}}
                        style={{width:80,height:80,}}
                        className="rounded-full border-2 border-gray-200"
                    />
                    <Image
                        source={{uri: "https://avatar.iran.liara.run/public/"}}
                        style={{width:80,height:80,}}
                        className="rounded-full border-2 border-gray-200"
                    />
                    <Image
                        source={{uri: "https://avatar.iran.liara.run/public/"}}
                        style={{width:80,height:80,}}
                        className="rounded-full border-2 border-gray-200"
                    />
                    <Image
                        source={{uri: "https://avatar.iran.liara.run/public/"}}
                        style={{width:80,height:80,}}
                        className="rounded-full border-2 border-gray-200"
                    />
                    <Image
                        source={{uri: "https://avatar.iran.liara.run/public/"}}
                        style={{width:80,height:80,}}
                        className="rounded-full border-2 border-gray-300"
                    />

                </View>
            </ScrollView>

      <Text className='font-Text text-xl mt-4 ml-8'>
        Recent Projects
      </Text>
      <View className="flex-row mt-4 mx-8 border border-stone-400 rounded-lg p-4">
        <Image
          source={{uri: "https://avatar.iran.liara.run/public/57"}}
          style={{ width: 60, height: 60 }}
          className="rounded-full border-2 border-stone-200"
        />
        <View className="flex-col w-72 ml-4 pr-5 gap-2">
          <Text className="font-Text">
            "This is a sample project title"
          </Text>
          <Text className="font-Text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </Text>
        </View>
      </View>

      <View className="flex-row mt-4 mx-8 border border-stone-400 rounded-lg p-4">
        <Image
          source={{uri: "https://avatar.iran.liara.run/public/74"}}
          style={{ width: 60, height: 60 }}
          className="rounded-full border-2 border-stone-200"
        />
        <View className="flex-col w-72 ml-4 pr-5 gap-2">
          <Text className="font-Text">
            "This is a sample project title"
          </Text>
          <Text className="font-Text">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
          </Text>
        </View>
      </View>
      </ScrollView>
    </View>
  );
}

export default FindMentorsScreen;