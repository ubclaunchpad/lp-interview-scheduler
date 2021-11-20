import {
  collection,
  CollectionReference,
  doc,
  DocumentReference,
  DocumentData,
  Firestore,
  getDoc,
  runTransaction,
  Transaction,
} from "@firebase/firestore";
import { setDoc } from "firebase/firestore";
import { db } from "../../firebase/db";
import { Availability, Interviewer, Event } from "./models";

const DB_COLLECTION = "aymendb-destroylater";
const INTERVIEWER_COLLECTION = "interviewers";
const AVAILABILITY_COLLECTION = "availabilities";
const EVENT_COLLECTION = "events";

class DataAccess {
  db: Firestore;
  rootCollectionName: string;
  interviewerCollectionName: string;
  availabilityCollectionName: string;
  eventCollectionName: string;
  rootCollection: CollectionReference;

  constructor(
    db: Firestore,
    rootCollectionName: string,
    interviewerCollectionName: string,
    availabilityCollectionName: string,
    eventCollectionName: string
  ) {
    this.db = db;
    this.rootCollectionName = rootCollectionName;
    this.interviewerCollectionName = interviewerCollectionName;
    this.availabilityCollectionName = availabilityCollectionName;
    this.eventCollectionName = eventCollectionName;
    this.rootCollection = collection(db, rootCollectionName);
  }

  async checkOrganizationExists(organization: string): Promise<boolean> {
    const orgRef = await doc(this.rootCollection, organization);
    const org = await getDoc(orgRef);

    if (org.exists()) return true;
    else return false;
  }

  async interviewerDocRef(
    organization: string,
    userUID: string
  ): Promise<DocumentReference<DocumentData>> {
    return await doc(
      this.rootCollection,
      organization,
      this.interviewerCollectionName,
      userUID
    );
  }

  async availabilityDocRef(
    organization: string,
    interviewerUID: string,
    startTime: string
  ): Promise<DocumentReference<DocumentData>> {
    return await doc(
      this.rootCollection,
      organization,
      this.interviewerCollectionName,
      interviewerUID,
      this.availabilityCollectionName,
      startTime
    );
  }

  async getInterviewer(
    organization: string,
    userUID: string
  ): Promise<DocumentData> {
    const doc = await this.interviewerDocRef(organization, userUID);
    const res = await getDoc(doc);
    return res.data();
  }

  async setInterviewer(interviewer: Interviewer) {
    const orgExists = await this.checkOrganizationExists(
      interviewer.organization
    );
    if (!orgExists)
      throw new Error(
        `Organization "${interviewer.organization}" does not exist in Firebase!`
      );

    const doc = await this.interviewerDocRef(
      interviewer.organization,
      interviewer.userUID
    );
    await setDoc(doc, interviewer);
  }

  async getAvailability(
    organization: string,
    interviewerUID: string,
    startTimeString: string
  ): Promise<DocumentData> {
    const doc = await this.availabilityDocRef(
      organization,
      interviewerUID,
      startTimeString
    );
    const res = await getDoc(doc);
    return res.data();
  }

  async setAvailability(availability: Availability, organization: string) {
    const doc = await this.availabilityDocRef(
      organization,
      availability.interviewerUID,
      availability.startTime
    );
    await setDoc(doc, availability);
  }

  async eventDocRef(
    organization: string,
    eventUID: string
  ): Promise<DocumentReference<DocumentData>> {
    return await doc(
      this.rootCollection,
      organization,
      this.eventCollectionName,
      eventUID
    );
  }

  async getEvent(
    organization: string,
    eventUID: string
  ): Promise<DocumentData> {
    const doc = await this.eventDocRef(organization, eventUID);
    const res = await getDoc(doc);
    return res.data();
  }

  async setEvent(event: Event, organization: string) {
    const doc = await this.eventDocRef(organization, event.eventUID);

    await setDoc(doc, event);
  }

  // Book an interview with two leads using a transaction.
  async bookInterview(
    organization: string,
    leadUIDs: Array<string>,
    timesToBook: Array<string>,
    eventUID: string,
    startTime: string
  ) {
    try {
      await runTransaction(db, async (t: Transaction) => {
        async function verifyAvailability(instance, leadUID, time) {
          const availabilityRef = await instance.availabilityDocRef(
            organization,
            leadUID,
            time
          );
          const availabilityDoc = await t.get(availabilityRef);
          if (!availabilityDoc.exists()) {
            throw "Leads do not exist or do not have specified availability for one of requested times.";
          }
          const availabilityData = availabilityDoc.data();
          if (availabilityData["isBooked"]) {
            throw "Interviews already booked for one or both leads at one of requested times.";
          }

          return {
            ref: availabilityRef,
            data: availabilityData,
          };
        }

        async function setAvailabilityT(t: Transaction, avail) {
          avail["ref"]["isBooked"] = true;
          await t.update(avail["ref"], avail["data"]);
        }

        async function bookEvent(
          t: Transaction,
          organization: string,
          eventUID: string,
          startTime: string
        ) {
          const eventRef = await this.eventDocRef(organization, eventUID);
          const eventDoc = await t.get(eventRef);
          const confirmedTime = await eventDoc.get("confirmedTime");
          if (confirmedTime == null) {
            await t.update(eventRef, { confirmedTime: startTime });
          } else {
            throw "Event already booked";
          }
        }

        const availabilitiesToBook = [];
        for (var id of leadUIDs) {
          for (var time of timesToBook) {
            const availability = await verifyAvailability(this, id, time);
            availabilitiesToBook.push(availability);
          }
        }

        // Book Everything
        await bookEvent(t, organization, eventUID, startTime);
        for (var avail of availabilitiesToBook) {
          await setAvailabilityT(t, avail);
        }
      });
      return true;
    } catch (e) {
      console.log("Transaction failure:", e);
      return false;
    }
  }
}

export const dataAccess = new DataAccess(
  db,
  DB_COLLECTION,
  INTERVIEWER_COLLECTION,
  AVAILABILITY_COLLECTION,
  EVENT_COLLECTION
);
