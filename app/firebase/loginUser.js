import {getAuth, signInWithEmailAndPassword} from 'firebase/auth'

export async function loginUser(email, pwd){
    const auth = getAuth()
    try {
        //signed in
        const user = await signInWithEmailAndPassword(auth, email, pwd)
        return true
    } catch (error) {
        return error.message
    }
}