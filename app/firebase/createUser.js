import { getAuth, createUserWithEmailAndPassword, updateProfile, sendEmailVerification } from 'firebase/auth';
import { supabase } from '@/app/supabase/initiliaze';

export default async function createUser(email, password, name, photoURL, userType) {
    const auth = getAuth();
    try {
        // Create the user with email and password
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const { user } = userCredential;

        // Update user display name and photo URL
        await updateProfile(user, {
            displayName: name,
            photoURL: photoURL,
        });

        // Send email verification
        await sendEmailVerification(user);
        console.log("Verification email sent to:", user.email);

        // Wait for the user to verify their email
        console.log("Waiting for email verification...");
        let isVerified = false;
        // Check if the user is verified  
        if (user.emailVerified) {
            isVerified = true;
        } else {
            console.log("Email not verified yet.");
        }      

        // Insert user data into Supabase only if the email is verified
        const { data, error } = await supabase.from('users').insert({
            name: name,
            email: email,
            user_type: userType == 0 ? "student" : 'tutor',
            photoURL: photoURL,
        });

        console.log(data);
        console.log(userType == 0 ? "student" : 'tutor');

        if (error) {
            return error.message;
        }

        return "successful"; // Return "successful" if the user is created and verified
    } catch (error) {
        return error.message; // Return the error message if there's an error
    }
}