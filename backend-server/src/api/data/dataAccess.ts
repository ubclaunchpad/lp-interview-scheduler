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
import { setDoc, getDocs } from "firebase/firestore";
import { db } from "../../firebase/db";
import { Availability, Interviewer, Event, OrganizationFields } from "./models";

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

    return !!org.exists();
  }

  async getOrganizationExpiry(organization: string): Promise<number> {
    const orgRef = await doc(this.rootCollection, organization);
    const org = await getDoc(orgRef);

    return org.data().availabilityExpiryDays;
  }

  async checkInterviewerExists(interviewer: Interviewer): Promise<boolean> {
    const interviewerRef = await doc(
      this.rootCollection,
      interviewer.organization,
      INTERVIEWER_COLLECTION,
      interviewer.interviewerUID
    );
    const interviewerDoc = await getDoc(interviewerRef);

    return !!interviewerDoc.exists();
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
    const interviewerExists = await this.checkInterviewerExists(interviewer);

    if (!orgExists)
      throw new Error(
        `Organization "${interviewer.organization}" does not exist in Firebase!`
      );

    if (!interviewerExists) {
      const doc = await this.interviewerDocRef(
        interviewer.organization,
        interviewer.interviewerUID
      );
      await setDoc(doc, interviewer);
    }
  }

  async listInterviewers(organization: string) {
    // return list all events in organization
    const docCollection = await getDocs(
      collection(
        this.rootCollection,
        organization,
        this.interviewerCollectionName
      )
    );
    return docCollection.docs.map((doc) => doc.data());
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
    let docCollection = await getDocs(
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
  // filter docCOllection for availabilities that are older than NDAYSBEFORE then delete them
  async deleteExpiredAvailabilities(
    organization: string,
    interviewerUID: string,
    availabilities: Availability[]
  ): Promise<DocumentData[]> {
    const today: Date = new Date();
    const availabilityExpiryDays = await this.getOrganizationExpiry(
      organization
    );

    await Promise.all(
      availabilities
        .filter((avail) => {
          const datestr: Date = new Date(avail.startTime);
          let diff: number = today.getTime() - datestr.getTime();
          diff = Math.ceil(diff / (1000 * 3600 * 24));
          return diff > availabilityExpiryDays;
        })
        .map((availDoc) => {
          this.availabilityDocRef(
            organization,
            interviewerUID,
            availDoc.startTime
          ).then((availabilityRef) => {
            return deleteDoc(availabilityRef);
          });
        })
    );

    return availabilities.filter((avail) => {
      const datestr: Date = new Date(avail.startTime);
      let diff: number = today.getTime() - datestr.getTime();
      diff = Math.ceil(diff / (1000 * 3600 * 24));
      return !(diff > availabilityExpiryDays);
    });
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

    for (const availability of collectionRef.docs) {
      const docRef = doc(
        interviewerRef,
        this.availabilityCollectionName,
        availability.id
      );
      await deleteDoc(docRef);
    }
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

        async function setAvailabilityT(t: Transaction, avail, email) {
          avail["data"]["bookedByEmail"] = email;
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
        const bookedEvent: any = await bookEvent(
          t,
          organization,
          eventUID,
          startTime,
          this
        );

        for (var avail of availabilitiesToBook) {
          await setAvailabilityT(t, avail, bookedEvent.intervieweeEmail);
        }
        return bookedEvent;
      });
    } catch (e) {
      console.log("Transaction failure:", e);
      return false;
    }
  }

  async getOrganizationFields(
    organization: string
  ): Promise<OrganizationFields> {
    const organizationRef = await doc(this.rootCollection, organization);
    const organizationDoc = await getDoc(organizationRef);
    return organizationDoc.data() as OrganizationFields;
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
