import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyA80P1JwyAmZB2rvn_r6BV6_O7bep24ok0",
  authDomain: "launch-pad-scheduler.firebaseapp.com",
  projectId: "launch-pad-scheduler",
  storageBucket: "launch-pad-scheduler.appspot.com",
  messagingSenderId: "145240185400",
  appId: "1:145240185400:web:ecec662db30bee01d664cd",
  measurementId: "G-KGG89MH08T",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const googleAuthProvider = new GoogleAuthProvider();
