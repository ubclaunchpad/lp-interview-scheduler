import {
  collection,
  CollectionReference,
  deleteDoc,
  doc,
  DocumentReference,
  DocumentData,
  Firestore,
  getDoc,
  runTransaction,
  Transaction,
} from "@firebase/firestore";
import { 
  setDoc,
  getDocs,
  Timestamp 
} from "firebase/firestore";
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
    interviewerUID: string
  ): Promise<DocumentReference<DocumentData>> {
    return await doc(
      this.rootCollection,
      organization,
      this.interviewerCollectionName,
      interviewerUID
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

  async allAvailabilitiesDocRef(
    organization: string,
    interviewerUID: string
  ): Promise<DocumentReference<DocumentData>> {
    return await doc(
      this.rootCollection,
      organization,
      this.interviewerCollectionName,
      interviewerUID,
      this.availabilityCollectionName
    );
  }

  async getInterviewer(
    organization: string,
    interviewerUID: string
  ): Promise<DocumentData> {
    const doc = await this.interviewerDocRef(organization, interviewerUID);
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
      interviewer.interviewerUID
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

  async getAllAvailabilities(
    organization: string,
    interviewerUID: string
  ): Promise<DocumentData[]> {
    const docCollection = await getDocs(
      collection(
        this.rootCollection,
        organization,
        this.interviewerCollectionName,
        interviewerUID,
        this.availabilityCollectionName
      )
    );
    return docCollection.docs.map((doc) => doc.data());
  }

  async setAvailability(availability: Availability, organization: string) {
    const doc = await this.availabilityDocRef(
      organization,
      availability.interviewerUID,
      availability.startTime
    );
    await setDoc(doc, availability);
  }

  async deleteAvailabilityCollection(
    organization: string,
    interviewerUID: string
  ) {
    const collectionRef = await getDocs(
      collection(
        this.rootCollection,
        organization,
        this.interviewerCollectionName,
        interviewerUID,
        this.availabilityCollectionName
      )
    );
    const interviewerRef = await this.interviewerDocRef(
      organization,
      interviewerUID
    );

    collectionRef.forEach(async (availability) => {
      const docRef = doc(
        interviewerRef,
        this.availabilityCollectionName,
        availability.id
      );
      await deleteDoc(docRef);
    });
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
    leadUIDs: string[],
    timesToBook: string[],
    eventUID: string,
    startTime: string
  ) {
    try {
      return await runTransaction(db, async (t: Transaction) => {
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
          avail["data"]["isBooked"] = true;
          await t.update(avail["ref"], avail["data"]);
        }

        async function bookEvent(
          t: Transaction,
          organization: string,
          eventUID: string,
          startTime: string,
          instance: any
        ) {
          const eventRef = await instance.eventDocRef(organization, eventUID);
          const eventDoc = await t.get(eventRef);
          const confirmedTime = await eventDoc.get("confirmedTime");
          if (confirmedTime == null) {
            const event = eventDoc.data();
            event["confirmedTime"] = startTime;
            await t.update(eventRef, event);
            return event;
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
        const bookedEvent = await bookEvent(
          t,
          organization,
          eventUID,
          startTime,
          this
        );
        for (var avail of availabilitiesToBook) {
          await setAvailabilityT(t, avail);
        }
        return bookedEvent;
      });
    } catch (e) {
      console.log("Transaction failure:", e);
      return false;
    }
  }
  
  async getOrganizationFields(organization: string) {
    const organizationRef = await doc(this.rootCollection, organization);
    const organizationDoc = await getDoc(organizationRef);
    return organizationDoc.data();
  }

  async listEvents(organization: string): Promise<DocumentData[]> {
    // return list all events in organization
    const docCollection = await getDocs(
      collection(this.rootCollection, organization, this.eventCollectionName)
    );
    return docCollection.docs.map((doc) => doc.data());
  }
}

export const dataAccess = new DataAccess(
  db,
  DB_COLLECTION,
  INTERVIEWER_COLLECTION,
  AVAILABILITY_COLLECTION,
  EVENT_COLLECTION
);
