import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// const firebaseConfig = {
//   apiKey: "AIzaSyA80P1JwyAmZB2rvn_r6BV6_O7bep24ok0",
//   authDomain: "launch-pad-scheduler.firebaseapp.com",
//   projectId: "launch-pad-scheduler",
//   storageBucket: "launch-pad-scheduler.appspot.com",
//   messagingSenderId: "145240185400",
//   appId: "1:145240185400:web:ecec662db30bee01d664cd",
//   measurementId: "G-KGG89MH08T",
// };

const firebaseConfig = {
  apiKey: "AIzaSyCoRVlKcWnP5CeGFZ7jWLAvsg4J0znXHgI",
  authDomain: "kake-fc2e1.firebaseapp.com",
  projectId: "kake-fc2e1",
  storageBucket: "kake-fc2e1.appspot.com",
  messagingSenderId: "979789660510",
  appId: "1:979789660510:web:9efeb8cf0db0d9eaf50fcf",
};

export const app = initializeApp(firebaseConfig);
export const auth = getAuth();
export const googleAuthProvider = new GoogleAuthProvider();
