import { View, Text } from "react-native";
import { useLocalSearchParams } from "expo-router";

export default function Chat() {
    const { userId, userName } = useLocalSearchParams();

    return (
        <View>
            <Text>Chat with userId: {userId}</Text>
            { <Text>User Name: {}</Text>}
        </View>
    );
}r