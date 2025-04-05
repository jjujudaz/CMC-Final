import { Stack } from "expo-router"
function RootLayout(){
    return(
        <Stack>
            <Stack.Screen name="register" options={{title: "Register"}} />
            <Stack.Screen name="index" options={{headerShown: false}} />
            <Stack.Screen name="home" options={{title: "Home"}} />
        </Stack>
    )
}


export default RootLayout
