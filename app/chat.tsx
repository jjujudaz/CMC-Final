import { useEffect, useState, useRef } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform, Alert } from "react-native";
import { useLocalSearchParams } from "expo-router";
import { supabase } from "../app/supabase/initiliaze";
import { getDatabase, ref, push, onValue, off } from "firebase/database";
import { firebaseConfig } from "../app/firebase/firebse_initialize"; 
import { initializeApp } from "firebase/app";

type User = {
  id: number;
  name: string;
  email: string;
};

type Message = {
  id?: string;
  senderId: number;
  senderName: string;
  text: string;
  timestamp: number;
};

let firebaseApp: any = null;

export default function Chat() {
  const { userId, userName } = useLocalSearchParams<{ userId: string; userName: string }>();
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const flatListRef = useRef<FlatList>(null);

  // Ensure Firebase is initialized only once
  function getFirebaseApp() {
    if (!firebaseApp) {
      try {
        firebaseApp = initializeApp(firebaseConfig);
      } catch (e: any) {
        if (!/already exists/u.test(e.message)) {
          setErrorMsg("Firebase initialization error: " + e.message);
        }
      }
    }
    return firebaseApp;
  }

  // Fetch current user from Supabase
  useEffect(() => {
    async function fetchCurrentUser() {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        if (sessionError) {
          setErrorMsg("Supabase session error: " + sessionError.message);
          setLoading(false);
          return;
        }
        if (session?.user?.email) {
          const { data, error } = await supabase
            .from("users")
            .select("*")
            .eq("email", session.user.email)
            .single();
          if (error) {
            setErrorMsg("Supabase user fetch error: " + error.message);
          } else {
            setCurrentUser(data);
          }
        } else {
          setErrorMsg("No user session found.");
        }
      } catch (e: any) {
        setErrorMsg("Unexpected error: " + (e.message || String(e)));
      } finally {
        setLoading(false);
      }
    }
    fetchCurrentUser();
  }, []);

  // Listen to messages in Firebase
  useEffect(() => {
    if (!currentUser) return;
    setErrorMsg(null);
    setLoading(true);
    try {
      const app = getFirebaseApp();
      const db = getDatabase(app);
      const chatId = [currentUser.id, Number(userId)].sort((a, b) => a - b).join("_");
      const messagesRef = ref(db, `chats/${chatId}`);

      const handleNewMessages = (snapshot: any) => {
        try {
          const msgs = snapshot.val() || {};
          const msgList = Object.entries(msgs).map(([id, msg]: any) => ({ id, ...msg }));
          msgList.sort((a, b) => a.timestamp - b.timestamp);
          setMessages(msgList);
          setTimeout(() => flatListRef.current?.scrollToEnd({ animated: true }), 100);
        } catch (e: any) {
          setErrorMsg("Error processing messages: " + (e.message || String(e)));
        } finally {
          setLoading(false);
        }
      };

      onValue(messagesRef, handleNewMessages, (err) => {
        setErrorMsg("Firebase onValue error: " + err.message);
        setLoading(false);
      });
      return () => off(messagesRef, "value", handleNewMessages);
    } catch (e: any) {
      setErrorMsg("Firebase listener error: " + (e.message || String(e)));
      setLoading(false);
    }
  }, [currentUser, userId]);

  // Send message
  async function sendMessage() {
    if (!input.trim() || !currentUser) return;
    try {
      const app = getFirebaseApp();
      const db = getDatabase(app);
      const chatId = [currentUser.id, Number(userId)].sort((a, b) => a - b).join("_");
      const messagesRef = ref(db, `chats/${chatId}`);
      await push(messagesRef, {
        senderId: currentUser.id,
        senderName: currentUser.name,
        text: input,
        timestamp: Date.now(),
      });
      setInput("");
    } catch (e: any) {
      setErrorMsg("Send message error: " + (e.message || String(e)));
      Alert.alert("Error", "Failed to send message.");
    }
  }

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading chat...</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "#f9f9f9" }}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={80}
    >
      <View style={{ flex: 1, paddingHorizontal: 8 }}>
        {errorMsg && (
          <Text style={{ color: "red", marginBottom: 8 }}>{errorMsg}</Text>
        )}
        <FlatList
          ref={flatListRef}
          data={messages}
          keyExtractor={item => item.id || Math.random().toString()}
          renderItem={({ item }) => {
            const isMe = item.senderId === currentUser?.id;
            return (
              <View
                style={{
                  alignSelf: isMe ? "flex-end" : "flex-start",
                  backgroundColor: isMe ? "#2563eb" : "#e5e7eb",
                  borderRadius: 16,
                  marginVertical: 4,
                  padding: 10,
                  maxWidth: "75%",
                  shadowColor: "#000",
                  shadowOpacity: 0.05,
                  shadowRadius: 2,
                  marginRight: isMe ? 4 : 0,
                  marginLeft: isMe ? 0 : 4,
                }}
              >
                <Text style={{ color: isMe ? "#fff" : "#111", fontWeight: "bold", marginBottom: 2 }}>
                  {item.senderName}
                </Text>
                <Text style={{ color: isMe ? "#fff" : "#111" }}>{item.text}</Text>
                <Text style={{ color: isMe ? "#dbeafe" : "#6b7280", fontSize: 10, marginTop: 2, alignSelf: "flex-end" }}>
                  {item.timestamp ? new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : ""}
                </Text>
              </View>
            );
          }}
          contentContainerStyle={{ paddingVertical: 8 }}
        />
        {/* Input Bar - edge-to-edge, no border or margin */}
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "100%",
            backgroundColor: "#fff",
            borderRadius: 0,
            paddingHorizontal: 0,
            paddingVertical: 0,
            overflow: "hidden",
          }}
        >
          <TextInput
            value={input}
            onChangeText={setInput}
            placeholder="Type a message..."
            style={{
              flex: 1,
              borderWidth: 0,
              borderRadius: 0,
              backgroundColor: "#fff",
              paddingVertical: 14,
              paddingHorizontal: 16,
              fontSize: 16,
            }}
            onSubmitEditing={sendMessage}
            returnKeyType="send"
          />
          <TouchableOpacity
            onPress={sendMessage}
            style={{
              backgroundColor: "#2563eb",
              paddingVertical: 14,
              paddingHorizontal: 22,
              borderRadius: 0,
              justifyContent: "center",
              alignItems: "center",
            }}
            disabled={!input.trim()}
          >
            <Text style={{ color: "#fff", fontWeight: "bold", fontSize: 16 }}>Send</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}