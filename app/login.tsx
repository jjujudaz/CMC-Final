import { useEffect, useState } from "react";
import { View, Text, Image, TextInput, Button } from "react-native";
import loginUser from './firebase/loginUser'
import { useRouter } from "expo-router";
 
export default function RegisterScreen() {

  const [email, setEmail] = useState<String>('')
  const [pwd, setPwd] = useState<String>('')
  const [message, setMessage] = useState<String>('')
  //fetching router accessbility
  const router = useRouter()

  //logging user on button click and if successful navigate to home otherwise show error message
  async function handleForm() {
    const result = await loginUser(email, pwd);
    if(typeof(result) == "boolean"){
       router.replace({
        pathname: '/home',
        params:{
          email: email,
          password: pwd
        }
       })
    }else {
        setMessage(result)
    }

}

  return (
    <View>
      <TextInput placeholder="Email" onChangeText={(email) => setEmail(email)}/>
      <TextInput placeholder="Password" onChangeText={(pwd) => setPwd(pwd)}/>
      <Text>{message}</Text>
      <Button onPress={handleForm} title="Submit" />
    </View>
  );
}