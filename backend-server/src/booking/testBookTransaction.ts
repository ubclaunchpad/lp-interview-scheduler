const {
  doc,
  collection,
  setDoc,
  addDoc,
  getDoc,
  updateDoc,
} = require("firebase/firestore");

import { runTransaction } from "firebase/firestore";
import { db } from "../firebase/db";

const testSpecial = doc(db, "transactionTestLeadSchedules/lead_john");
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

async function testCandidateBooks(lead1, lead2, timeslot) {
  try {
    await runTransaction(db, async (t) => {
      const lead1_doc = doc(db, `transactionTestLeadSchedules/${lead1}`);
      const lead2_doc = doc(db, `transactionTestLeadSchedules/${lead2}`);

      // get scheds from db
      let lead1_data = await (await t.get(lead1_doc)).data();
      let lead2_data = await (await t.get(lead2_doc)).data();

      console.log(lead1_data);
      console.log(lead2_data);

      // make sure both leads free at specified time
      if (
        !lead1_data["free"].includes(timeslot) ||
        !lead2_data["free"].includes(timeslot)
      ) {
        throw "Both leads must be free in the timeslot specified";
      }

      // remove scheds from free section of both leads schedules
      const lead1_ind = lead1_data["free"].indexOf(timeslot);
      const lead2_ind = lead2_data["free"].indexOf(timeslot);
      lead1_data["free"].splice(lead1_ind, 1);
      lead2_data["free"].splice(lead2_ind, 1);

      // add timeslot to booked for both leads
      lead1_data["booked"].push(timeslot);
      lead2_data["booked"].push(timeslot);

      t.update(lead1_doc, lead1_data);
      t.update(lead2_doc, lead2_data);
    });
    console.log("Transaction success!");
  } catch (e) {
    console.log("Transaction failure:", e);
  }
}

testCandidateBooks("lead_jane", "lead_john", "slot4");
