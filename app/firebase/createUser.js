import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';

export default async function createUser(email, password, name, photoURL) {
    const auth = getAuth();
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password)
        const {user} = userCredential

        //update user displayname here
        await updateProfile(user, {
            displayName: name,
            photoURL: photoURL
        })
        return "successful"; // Return "successful" if the user is created
    } catch (error) {
        return error.message; // Return the error message if there's an error
    }
}