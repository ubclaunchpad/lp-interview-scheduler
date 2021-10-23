// Import the functions you need from the SDKs you need

import { initializeApp } from "firebase/app";
import {
  addDoc,
  collection,
  doc,
  getDoc,
  getFirestore,
  setDoc,
  updateDoc,
} from "firebase/firestore";

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
  measurementId: "G-KGG89MH08T",
};

// Initialize Firebase
const firebase = initializeApp(firebaseConfig);
const db = getFirestore(firebase);

const testSpecial = doc(db, "hello/world");
// Write document if it exists, replace document otherwise
async function testSet() {
  console.log("Test Set");
  const docData = {
    hello: "world",
    foo: "boo",
  };
  console.log("Defined docData");
  try {
    await setDoc(testSpecial, docData);
  } catch (error) {
    console.log("Got an error");
    console.log(error);
  }
}

// Only update specified fields
async function testUpdate() {
  console.log("Test Set");
  const docData = {
    hello: "eqeworld",
  };
  try {
    await updateDoc(testSpecial, docData);
  } catch (error) {
    console.log("Got an error");
    console.log(error);
  }
}

async function testGet() {
  console.log("Test Get");
  try {
    const snapshot = await getDoc(testSpecial);
    if (snapshot.exists()) {
      const docData = snapshot.data();
      console.log(`Data is ${JSON.stringify(docData)}`);
    }
  } catch (error) {
    console.log("Got an error");
    console.log(error);
  }
}

const testCollection = collection(db, "testingBackend");
async function testNewDoc() {
  try {
    const newdoc = await addDoc(testCollection, {
      testing: "yes this is a test",
    });
    console.log(`New doc created at ${newdoc.path}`);
  } catch (error) {
    console.log("Oops, error with newdoc");
  }
}

// testSet();
// testUpdate();
// testNewDoc();
// testGet();
// console.log("Testing");

export { db };
