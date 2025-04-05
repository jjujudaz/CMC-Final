import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';

export async function createUser(email, password) {
    const auth = getAuth();
    try {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        return "successful"; // Return "successful" if the user is created
    } catch (error) {
        return error.message; // Return the error message if there's an error
    }
}