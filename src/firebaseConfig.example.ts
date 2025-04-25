// This is an example configuration file for Firebase.
// 1. Copy this file to src/firebaseConfig.ts
// 2. Replace the placeholder values with your actual Firebase project credentials.
// 3. Make sure src/firebaseConfig.ts is listed in your .gitignore file!

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// Get these values from your Firebase project settings
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
  appId: "YOUR_APP_ID"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

// Export the Firestore instance
export { db }; 