import { useEffect, useState } from "react";
import { View, Text, Image, TextInput, Button } from "react-native";
import {app} from "./firebase/firebse_initialize";
import createUser from './firebase/createUser'
import { useRouter } from "expo-router";
 
export default function RegisterScreen() {
  const [name, setName] = useState<String>('')
  const [email, setEmail] = useState<String>('')
  const [pwd, setPwd] = useState<String>('')
  const [message, setMessage] = useState<String>('')
  //fetching router accessbility
  const router = useRouter()

  useEffect(() => {
      if(app){
        console.log("firebased initialised")
      }

  }, []);
  //creating user on button click and if successful navigate to home otherwise show error message
  async function handleForm() {
    const errorMsg = await createUser(email, pwd, name);
    if(errorMsg !== "successful"){
      setMessage(errorMsg)
      return
    }
    router.replace('/home')
}

  function navigaToLogin(){
    router.push('/login')
  }
  return (
    <View>
      <TextInput placeholder="Name" onChangeText={(name) => setName(name)}/>
      <TextInput placeholder="Email" onChangeText={(email) => setEmail(email)}/>
      <TextInput placeholder="Password" onChangeText={(pwd) => setPwd(pwd)}/>
      <Text>{message}</Text>
      <Button onPress={handleForm} title="Submit" />
      <Button onPress={navigaToLogin} title="Already have an account?"/>
    </View>
  );
}