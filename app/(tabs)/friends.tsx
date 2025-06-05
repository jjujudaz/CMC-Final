import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { supabase } from "../supabase/initiliaze";
import { router } from "expo-router";
export default function Friends() {
  const [users, setUsers] = useState<[]>([]);
  useEffect(() => {
    fetchUsers();
  }, [users]);

  async function fetchUsers() {
    try {
      const { data, error }: { data: any; error: any } = await supabase
        .from("users")
        .select("*");

      if (error) {
        console.log(error);
      }

      setUsers(data)
    } catch (error) {
        console.log(error)
    }
  }

  function handleChat(userId: number){
      router.push({ pathname: '/chat', params: { userId } });
  }
  return (
    <View>
      {users.map((user, index) => {
        return(
            <View key={index}>
                <TouchableOpacity onPress={() => handleChat(user.id)}>
                <Text>{user.name}</Text>
                </TouchableOpacity>
            </View>
        )
      })}
    </View>
  );
}
