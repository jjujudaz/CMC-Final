import { initializeApp } from "firebase/app";

// Firebase configuration
export const firebaseConfig = {
  apiKey: "AIzaSyD4cByyZFB7mjDWTrJK0FQZ196Nupg1mtA",
  authDomain: "cmc-db-9077c.firebaseapp.com",
  projectId: "cmc-db-9077c",
  storageBucket: "cmc-db-9077c.firebasestorage.app",
  messagingSenderId: "1094053580566",
  appId: "1:1094053580566:web:7da2f914ed36aa9d5c8a37",
  measurementId: "G-V4J597CCKX",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);