// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCmK_duxMMp9eEcajE_FLmqzIsL9Atvzco",
  authDomain: "agroventis-b73b4.firebaseapp.com",
  projectId: "agroventis-b73b4",
  storageBucket: "agroventis-b73b4.firebasestorage.app",
  messagingSenderId: "3208041849",
  appId: "1:3208041849:web:7e63e823d7bff56929cba8",
  measurementId: "G-V4F7SD8W40"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);