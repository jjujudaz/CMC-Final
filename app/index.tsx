import { useEffect, useState } from "react";
import { View, Text, Image, TextInput, Button } from "react-native";
import {app} from "./firebase/firebse_initialize";
import {createUser} from './firebase/createUser'
 
export default function HomeScreen() {

  const [email, setEmail] = useState<String>('')
  const [pwd, setPwd] = useState<String>('')
  const [message, setMessage] = useState<String>('')
  useEffect(() => {
      if(app){
        console.log("firebased init")
      }

  }, []);


  async function handleForm() {
    const result = await createUser(email, pwd);
    if(result !== "successful"){
      setMessage(result)
    }

}

  return (
    <View
      style={{
        backgroundColor: "#16519f",
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Image
        source={require("./icon.png")}
        style={{ width: 300, height: 300 }}
      />
      <TextInput placeholder="Email" onChangeText={(email) => setEmail(email)}/>
      <TextInput placeholder="Password" onChangeText={(pwd) => setPwd(pwd)}/>
      <Text>{message}</Text>
      <Button onPress={handleForm} title="Submit" />
      <Text style={{ color: "#fff", fontSize: 30 }}>Coffee Meets Careers</Text>
    </View>
  );
}