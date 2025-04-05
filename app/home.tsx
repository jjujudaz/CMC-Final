import { useEffect, useState } from 'react'
import {View, Text} from 'react-native'
import { getAuth } from 'firebase/auth'
function HomeScreen(){
    const [message, setMessage] = useState<String>('')
    useEffect(() => {
        fetchUser()
    }, [])

    async function fetchUser(){
        const auth = await getAuth()
        console.log(auth.currentUser)
        if(auth.currentUser?.displayName){
            setMessage(auth.currentUser?.displayName)
        }
    }
    return(
        <View>
            <Text>
                <Text>Welcome {message}</Text>
            </Text>
        </View>
    )
}

export default HomeScreen