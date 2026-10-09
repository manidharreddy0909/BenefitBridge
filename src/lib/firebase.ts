import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getAnalytics } from "firebase/analytics";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyDemoPlaceholderKeyForLocalExpoDev",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "benefitbridge-a5107.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "benefitbridge-a5107",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "benefitbridge-a5107.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789012",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789012:web:demo123456789"
};

const app = initializeApp(firebaseConfig);

let analytics: any = null;
if (typeof window !== "undefined" && import.meta.env.VITE_FIREBASE_MEASUREMENT_ID) {
  try {
    analytics = getAnalytics(app);
  } catch (err) {
    console.warn("[Firebase] Analytics disabled:", err);
  }
}

const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, analytics, auth, db, storage };
