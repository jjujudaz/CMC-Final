import { useEffect, useState } from 'react'
import {View, Text, TextInput, Button, Alert} from 'react-native'
import { getAuth } from 'firebase/auth'
import { getDatabase, set, ref, onValue, update, push, child } from "firebase/database";
import UserInfo from './firebase/getUserInfo'
function HomeScreen(){
    const [welcomeMessage, setWelcomeMessage] = useState<String>('')
    const [textMessage, setTextMessage] = useState<string>('')
    const [messages, setMessages] = useState([])
    useEffect(() => {
        fetchUser()
    }, [])

    async function fetchUser(){
        const auth = await getAuth()
        console.log(auth.currentUser)
        if(auth.currentUser?.displayName){
            setWelcomeMessage(auth.currentUser?.displayName)
        }
    }

    useEffect(() => {
       fetchData()
    }, [])
 

    async function fetchData() {
        const db = getDatabase()
        const dbRef = ref(db, 'users');
        onValue(dbRef, (snapshot) => {
            if(snapshot.exists()){
               const data = snapshot.val()
               setMessages(Object.values(data))
            }
        })
    }
    async function sendMessage() {
    //     const name = UserInfo()
    //     console.log(name)
    //    Alert.alert("AHAH")
       
        const db = getDatabase();
        const userId = 123; // Replace with the actual user ID
        const userName = "Yaser"; // Replace with the actual user name
        const newMsgKey = push(child(ref(db), 'users')).key; // Generate a unique key for the message

        // Construct the message object
        const newMessage = {
            id: newMsgKey,
            userId: userId,
            userName: userName,
            message: textMessage, // The message from the input field
            timestamp: Date.now(), // Add a timestamp
        };
    
        // Update the database with the new message
        const updates = {};
        updates[`users/${newMsgKey}`] = newMessage;
    
        try {
            await update(ref(db), updates);
            console.log("Message sent successfully!");
            setTextMessage(''); // Clear the input field after sending the message
        } catch (error) {
            console.error("Error sending message:", error);
        }
    }
    return(
        <View>

                <Text>Welcome {welcomeMessage}</Text>
                <TextInput value={textMessage} onChangeText={(msg) => setTextMessage(msg)} placeholder='Write a message' />
                <Button onPress={sendMessage} title='send'/>
                {messages.map((item, index) => {
                    return(
                        <View key={index}>
                            <Text>{item.message}</Text>
                        </View>
                    )
                })}
        </View>
    )
}

export default HomeScreen