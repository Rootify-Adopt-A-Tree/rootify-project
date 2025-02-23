// src/app/api/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAv8BbPyfCxy350vvmZnSzsf8SouohfcfU",
  authDomain: "rootify-bd80c.firebaseapp.com",
  projectId: "rootify-bd80c",
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: "172935626004",
  appId: "1:172935626004:web:9a0b8f793e80dd52ddd601",
  measurementId: "G-45F22Q4Z51"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firestore and Auth instances
export const db = getFirestore(app);
export const auth = getAuth(app);
export const storage = getStorage(app);