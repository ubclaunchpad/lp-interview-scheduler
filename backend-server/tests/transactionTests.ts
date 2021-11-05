import { dataAccess } from "../src/api/data/dataAccess";
import { collection, doc } from "@firebase/firestore";
import { setDoc } from "firebase/firestore";
import { Interviewer } from "./../src/api/data/models";

// Sorta formal-informal testing for transaction validity.
// In the future we can add a formal framework w/ asserts.
const Interviewer1: Interviewer = {
  organization: "launchpad",
  userUID: "transactionTest1",
  email: "test@test.com",
  name: "Transaction Test 1",
};
const Interviewer2: Interviewer = {
  organization: "launchpad",
  userUID: "transactionTest2",
  email: "test@test.com",
  name: "Transaction Test 2",
};
const Interviewer3: Interviewer = {
  organization: "launchpad",
  userUID: "transactionTest3",
  email: "test@test.com",
  name: "Transaction Test 3",
};

// Set test interviewers in aymendb-destroylater->launchpad->interviewers
async function beforeEach() {
  await dataAccess.setInterviewer(Interviewer1);
  await dataAccess.setInterviewer(Interviewer2);
  await dataAccess.setInterviewer(Interviewer3);

  async function setTime(interviewerID: string, time: string, booked: boolean) {
    async function getAvailRef(interviewerID: string) {
      const interviewer_ref = await dataAccess.interviewerDocRef(
        "launchpad",
        interviewerID
      );
      const avail_collect = await collection(interviewer_ref, "availabilities");
      return avail_collect;
    }
    const avail_col = await getAvailRef(interviewerID);
    const time_doc = await doc(avail_col, time);
    await setDoc(time_doc, {
      isBooked: booked,
    });
  }

  // Interviewer 1:
  // transactionTest1 (doc) -> availabilities (collection) -> Time1 (doc) -> isBooked : False
  //                                                       -> Time2 (doc) -> isBooked : False
  // Interviewer 2:
  // transactionTest1 (doc) -> availabilities (collection) -> Time1 (doc) -> isBooked : False
  //                                                       -> Time2 (doc) -> isBooked : True
  // Interviewer 3:
  // transactionTest1 (doc) -> availabilities (collection) -> Time1 (doc) -> isBooked : False
  //                                                       -> Time2 (doc) -> isBooked : True
  await setTime(Interviewer1.userUID, "Time1", false);
  await setTime(Interviewer1.userUID, "Time2", false);
  await setTime(Interviewer2.userUID, "Time1", false);
  await setTime(Interviewer2.userUID, "Time2", true);
  await setTime(Interviewer3.userUID, "Time1", false);
  await setTime(Interviewer3.userUID, "Time2", true);
}

// Attempt a single transaction and await it
async function testTransactionSuccess() {
  await beforeEach();
  const res = await dataAccess.bookInterview(
    "launchpad",
    "transactionTest1",
    "transactionTest2",
    "Time1"
  );
  console.log("Done Success Test!");
  console.log(res);
  // await Attempt to book Time 1 for interviewers 1 and 2
  // Result: Time1 isBooked marked as true for both.
}

async function testTransactionFailure() {
  await beforeEach();
  const res = await dataAccess.bookInterview(
    "launchpad",
    "transactionTest1",
    "transactionTest2",
    "Time2"
  );
  console.log("Done Failure Test!");
  console.log(res);
  // await Attempt to book Time 2 for both interviewers 1 and 2

  // Result: Time2 isBooked stays False for Interviwer 1, stays True for interviewer 2
  // Transaction returns false
}

async function testMultipleTransactions() {
  await beforeEach();
  // Do not await and send multiple asynchronous calls to book
  // Call 1: Interviewer1, Interviewer2, Time2
  // Call 2: Interviewer2, Interviwer3, Time2
  // Call 3: Interviewer1, Interviewer3, Time2
  const res1 = dataAccess.bookInterview(
    "launchpad",
    "transactionTest1",
    "transactionTest2",
    "Time1"
  );
  const res2 = dataAccess.bookInterview(
    "launchpad",
    "transactionTest1",
    "transactionTest3",
    "Time1"
  );
  const res3 = dataAccess.bookInterview(
    "launchpad",
    "transactionTest2",
    "transactionTest3",
    "Time1"
  );
  console.log("Called multiple transactions w/o await..");
  console.log(
    "Check firebase console in a bit! 2 Failures and 1 success expected."
  );
  // Result: Time1 should be booked for exactly 2 out of 3 interviewers. Should output 2 failures
  // and one success.
}

async function runAllTests() {
  await testTransactionSuccess();
  await testTransactionFailure();
  await testMultipleTransactions();
}

runAllTests();
