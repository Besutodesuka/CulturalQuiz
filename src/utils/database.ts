import { initializeApp } from "firebase/app";
import { doc, getFirestore, setDoc } from "firebase/firestore";
// Optionally, import other Firebase services you might need, like getAnalytics
// import { getAnalytics } from "firebase/analytics";

// Firebase project configuration loaded from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  // measurementId is optional, include if you're using Google Analytics for Firebase
  // measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and get a reference to the service
const db = getFirestore(app);

const Feedback = doc(db, 'feedbacks/test');

// async function init() {
//   const test = {
//     "score": 0
//   }
//   await setDoc(Feedback, test, {"merge":true});
//   console.log("Document written successfully.");
// }

// init();
// console.log()

// Optional: Initialize Analytics
// const analytics = getAnalytics(app);

export { db };
// export { db, analytics }; // if you initialized analytics