//npm install firebase

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDS4Qh_4cA75xnKRBg3SKiEJFbJMqjtKC8",
  authDomain: "actam-58be4.firebaseapp.com",
  projectId: "actam-58be4",
  storageBucket: "actam-58be4.appspot.com",
  messagingSenderId: "80521062339",
  appId: "1:80521062339:web:d567624f9dd017667eff76",
  measurementId: "G-9S82Y3KQHB"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);