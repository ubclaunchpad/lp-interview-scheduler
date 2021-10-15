// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyA80P1JwyAmZB2rvn_r6BV6_O7bep24ok0",
  authDomain: "launch-pad-scheduler.firebaseapp.com",
  projectId: "launch-pad-scheduler",
  storageBucket: "launch-pad-scheduler.appspot.com",
  messagingSenderId: "145240185400",
  appId: "1:145240185400:web:ecec662db30bee01d664cd",
  measurementId: "G-KGG89MH08T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);