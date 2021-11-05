import { dataAccess } from "../src/api/data/dataAccess";
import {
  collection,
  CollectionReference,
  doc,
  DocumentReference,
  DocumentData,
  Firestore,
  getDoc,
  runTransaction,
} from "@firebase/firestore";
import { setDoc } from "firebase/firestore";
import { db } from "../src/firebase/db";

// Sorta formal-informal testing for transaction validity.
// In the future we can add a formal framework w/ asserts.

// Set test interviewers in aymendb-destroylater->interviewers
async function beforeEach() {
  // Interviewer 1:
  // transactionTest1 (doc) -> availabilities (collection) -> Time1 (doc) -> isBooked : False
  //                                                       -> Time2 (doc) -> isBooked : True
  // Interviewer 2:
  // transactionTest1 (doc) -> availabilities (collection) -> Time1 (doc) -> isBooked : True
  //                                                       -> Time2 (doc) -> isBooked : True
  // Interviewer 3:
  // transactionTest1 (doc) -> availabilities (collection) -> Time1 (doc) -> isBooked : True
  //                                                       -> Time2 (doc) -> isBooked : True
}

// Attempt a single transaction and await it
async function testTransactionSuccess() {
  await beforeEach();
  // await Attempt to book Time 2 for both interviewers

  // Result: Time2 isBooked marked as false for both.
  // Transaction returns True
}

async function testTransactionFailure() {
  await beforeEach();
  // await Attempt to book Time 1 for both interviewers

  // Result: Time1 isBooked stays False for Interviwer 1, stays True for interviewer 2
  // Transaction returns false
}

async function testMultipleTransactions1() {
  await beforeEach();
  // Do not await and send multiple asynchronous calls to book
  // Call 1: Interviewer1, Interviewer2, Time2
  // Call 2: Interviewer2, Interviwer3, Time2
  // Call 3: Interviewer1, Interviewer3, Time2

  // Result: Whichever transaction returns true - only their schedules are booked as false.
}

dataAccess.bookInterview("launchpad", "aymen123", "hello2", "Oct 24 11:30");
