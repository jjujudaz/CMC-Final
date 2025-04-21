import { View, Text, Image } from "react-native";

function NotificationsScreen() {
  return (
    <View className="bg-gray-100">
      <Text style={{ fontFamily: "OpenSans-Regular" }} className="text-2xl font-bold ml-4 mt-4">
        Today
      </Text>
      <View className="flex-row items-center border-b border-gray-600 p-4 w-screen">
        <Image
        source={{uri: "https://avatar.iran.liara.run/public/15"}}
        style={{ width: 80, height: 80 }}
        />
        <Text style={{ fontFamily: "OpenSans-Regular" }} className="ml-4 w-80">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </Text>
      </View>

      <Text style={{ fontFamily: "OpenSans-Regular" }} className="text-2xl font-bold ml-4 mt-4">
        Last Week
      </Text>
      <View className="flex-row items-center border-b border-gray-600 p-4 w-screen">
        <Image
        source={{uri: "https://avatar.iran.liara.run/public/92"}}
        style={{ width: 80, height: 80 }}
        />
        <Text style={{ fontFamily: "OpenSans-Regular" }} className="ml-4 w-80">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </Text>
      </View>
      <View className="flex-row items-center border-b border-gray-600 p-4 w-screen">
        <Image
        source={{uri: "https://avatar.iran.liara.run/public/42"}}
        style={{ width: 80, height: 80 }}
        />
        <Text style={{ fontFamily: "OpenSans-Regular" }} className="ml-4 w-80">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </Text>
      </View>

      <Text style={{ fontFamily: "OpenSans-Regular" }} className="text-2xl font-bold ml-4 mt-4">
        Last Month
      </Text>
      <View className="flex-row items-center border-b border-gray-600 p-4 w-screen">
        <Image
        source={{uri: "https://avatar.iran.liara.run/public/27"}}
        style={{ width: 80, height: 80 }}
        />
        <Text style={{ fontFamily: "OpenSans-Regular" }} className="ml-4 w-80">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </Text>
      </View>
      <View className="flex-row items-center border-b border-gray-600 p-4 w-screen">
        <Image
        source={{uri: "https://avatar.iran.liara.run/public/13"}}
        style={{ width: 80, height: 80 }}
        />
        <Text style={{ fontFamily: "OpenSans-Regular" }} className="ml-4 w-80">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.
        </Text>
      </View>
    </View>
  );
}

export default NotificationsScreen;