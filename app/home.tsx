import { useEffect, useState } from 'react'
import {View, Text, TextInput, Button, Alert} from 'react-native'
import { getDatabase, set, ref, onValue, update, push, child } from "firebase/database";
import {getAuth, initializeAuth} from 'firebase/auth'
import UserInfo from './firebase/getUserInfo'
import { useLocalSearchParams } from 'expo-router/build/hooks';

import AsyncStorage from '@react-native-async-storage/async-storage';

import { initializeApp } from 'firebase/app';
import firebaseConfig from './firebase/firebse_initialize';
// import getReactNativePersistence from "@react-native-firebase/auth"



export default function HomeScreen(){
    const [welcomeMessage, setWelcomeMessage] = useState<String>('')
    const [textMessage, setTextMessage] = useState<string>('')
    const [messages, setMessages] = useState([])

    const {email, password} = useLocalSearchParams()


    useEffect(() => {
        fetchUser()
        async function initializeUser (){
            const UserLoginCredentials = {
                email: email,
                pwd: password
            }
            try {
                await AsyncStorage.setItem("USERCREDENTIALS", JSON.stringify(UserLoginCredentials))
                console.log("user cred set")
            } catch (error) {
                console.log(error)
            }
        }
        initializeUser()
    }, [])


    async function fetchUser(){
        const auth = await getAuth()
        console.log("welcome: "+ auth.currentUser?.displayName)
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
        if(!UserInfo()){
            return
        }
        const {name, uid, photoUrl} = UserInfo()
       
        const db = getDatabase();
        const newMsgKey = push(child(ref(db), 'users')).key; // Generate a unique key for the message

        // Construct the message object
        const newMessage = {
            id: newMsgKey,
            userId: uid,
            userName: name,
            photoUrl: photoUrl,
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
                        <View key={index} style={{display: 'flex', flexDirection: 'row', gap: 10}}>
                            <Text>{item.userName}: </Text>
                            <Text>{item.message}</Text>
                        </View>
                    )
                })}
        </View>
    )
}