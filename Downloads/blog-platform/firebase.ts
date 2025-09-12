// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAQRoA9ldLDl1PFwAFXZi_IDrrwC98EjFk",
  authDomain: "blogg-161ed.firebaseapp.com",
  projectId: "blogg-161ed",
  storageBucket: "blogg-161ed.firebasestorage.app",
  messagingSenderId: "237233143368",
  appId: "1:237233143368:web:7064aca0b3f2eb0237a27d",
  measurementId: "G-9T6FRM5PXV",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
