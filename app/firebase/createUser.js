// Original Firebase email verification parts have been removed.
// Supabase will handle sending a verification email if "Enable email confirmations" is active in your Supabase project settings.

import { getAuth, createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'; // Removed sendEmailVerification
import { supabase } from '@/app/supabase/initiliaze';

export default async function createUser(email, password, name, photoURL, userType) {
    const auth = getAuth();
    try {
        // Step 1: Create user in Firebase
        console.log("Creating Firebase user...");
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const { user } = userCredential;

        // Step 2: Update Firebase user profile
        console.log("Updating Firebase profile...");
        await updateProfile(user, {
            displayName: name,
            photoURL: photoURL,
        });
        console.log("Firebase profile updated for:", user.email);

        // Step 3: Create user in Supabase Auth
        // Supabase will send its own verification email if email confirmations are enabled in project settings.
        console.log("Creating Supabase auth user (Supabase will send verification email if enabled)...");
        const { data: signUpData, error: supabaseAuthError } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: { // Custom metadata for Supabase Auth user
                    name: name,
                    user_type: userType == 0 ? "student" : 'tutor',
                    photo_url: photoURL, // Supabase Auth often uses snake_case for metadata
                    // firebase_uid: user.uid // Optionally store Firebase UID if needed for linking
                }
            }
        });

        if (supabaseAuthError) {
            console.error("Supabase auth error:", supabaseAuthError.message);
            // Consider rolling back Firebase user creation or other cleanup if critical
            return `Supabase auth error: ${supabaseAuthError.message}`;
        }
        console.log("Supabase auth user created/signed up. Email:", signUpData.user?.email, "Initial verification status (email_confirmed_at):", signUpData.user?.email_confirmed_at || "pending");

        // Step 4: Create user record in Supabase 'users' public table
        // This step proceeds regardless of immediate email verification status by Supabase.
        // The user will need to click the link in the Supabase email to fully verify.
        console.log("Creating user record in Supabase 'users' database table...");
        const { data: supabaseDbData, error: supabaseDbError } = await supabase
            .from('users')
            .insert({
                // If your 'users' table 'id' column is meant to be the Supabase auth user's ID,
                // you might want to use signUpData.user?.id here, ensuring your table's RLS allows it
                // or that the 'id' column is a foreign key to auth.users(id).
                // For simplicity, if 'id' is auto-generated serial, this is fine.
                name: name,
                email: email,
                user_type: userType == 0 ? "student" : 'tutor',
                photoURL: photoURL, // Assuming your 'users' table uses 'photoURL'
            })
            .select(); // Return the inserted data

        if (supabaseDbError) {
            console.error("Supabase database insert error:", supabaseDbError.message);
            // Consider rolling back Firebase/Supabase auth user creation or other cleanup
            return `Supabase database error: ${supabaseDbError.message}`;
        }

        console.log("User record inserted into Supabase 'users' table:", supabaseDbData);
        console.log("User successfully created in Firebase and Supabase auth. Supabase email verification pending user action.");
        return "successful";

    } catch (error) {
        // This will catch errors from Firebase operations primarily, or unhandled issues from Supabase if not caught above.
        console.error("Overall user creation error:", error.message);
        // Check if the error is from Firebase and includes a specific code
        if (error.code) {
            // Firebase specific error codes (e.g., 'auth/email-already-in-use')
            return `Firebase error: ${error.message} (Code: ${error.code})`;
        }
        return error.message;
    }
}