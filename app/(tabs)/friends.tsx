import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";
import { supabase } from "../supabase/initiliaze";
import { router } from "expo-router";

type User = {
  id: number;
  name: string;
  email: string;
};

export default function Friends() {
  const [users, setUsers] = useState<User[]>([]);
  const [currentUserId, setCurrentUserId] = useState<number | null>(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      const { data: sessionData } = await supabase.auth.getSession();
      const email = sessionData?.session?.user?.email;
      let currentId: number | null = null;

      if (email) {
        const { data: userData } = await supabase
          .from("users")
          .select("id")
          .eq("email", email)
          .single();
        currentId = userData?.id ?? null;
        setCurrentUserId(currentId);
      }

      const { data, error } = await supabase.from("users").select("*");
      if (error) {
        console.log(error);
      }
      // Filter out current user
      if (data) {
        setUsers(data.filter((user: User) => user.id !== currentId));
      }
    } catch (error) {
      console.log(error);
    }
  }

  function handleChat(userId: number, userName: string) {
    router.push({ pathname: "/chat", params: { userId, userName } });
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Friends</Text>
      {users.length === 0 ? (
        <Text style={styles.emptyText}>No friends found.</Text>
      ) : (
        users.map((user) => (
          <TouchableOpacity
            key={user.id}
            style={styles.card}
            onPress={() => handleChat(user.id, user.name)}
            activeOpacity={0.7}
          >
            <Text style={styles.avatar}>{user.name[0]?.toUpperCase()}</Text>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{user.name}</Text>
              <Text style={styles.email}>{user.email}</Text>
            </View>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f3f4f6",
    paddingTop: 32,
    paddingHorizontal: 16,
  },
  header: {
    fontSize: 26,
    fontWeight: "bold",
    marginBottom: 18,
    color: "#222",
    letterSpacing: 0.5,
  },
  emptyText: {
    textAlign: "center",
    color: "#888",
    marginTop: 40,
    fontSize: 16,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#2563eb",
    color: "#fff",
    fontWeight: "bold",
    fontSize: 20,
    textAlign: "center",
    textAlignVertical: "center",
    marginRight: 16,
    overflow: "hidden",
    lineHeight: 44,
  },
  name: {
    fontSize: 17,
    fontWeight: "600",
    color: "#222",
  },
  email: {
    fontSize: 13,
    color: "#6b7280",
    marginTop: 2,
  },
});