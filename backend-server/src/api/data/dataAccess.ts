import {
  collection,
  CollectionReference,
  doc,
  DocumentReference,
  DocumentData,
  Firestore,
  getDoc,
  runTransaction,
  updateDoc
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

  async bookEvent(organization: string, eventUID: string, time: string) {
    const doc = await this.eventDocRef(organization, eventUID);

    await updateDoc(doc, {confirmedTime: time});
  }

   // Book an interview with two leads using a transaction.
   async bookInterview(
    organization: string,
    lead_ids: Array<string>,
    times: Array<string>
  ) {
    try {
      await runTransaction(db, async (t) => {
        async function verify(instance, lead_UID, time) {
          const lead_ref = await instance.getInterviewerTimeRef(
            organization,
            lead_UID,
            time
          );
          const lead_time = await t.get(lead_ref);
          if (!lead_time.exists()) {
            throw "Leads do not exist or do not have specified availability for one of requested times.";
          }
          const lead_data = lead_time.data();
          if (lead_data["isBooked"]) {
            throw "Interviews already booked for one or both leads at one of requested times.";
          }

          return {
            ref: lead_ref,
            data: lead_data,
          };
        }

        async function set(lead_ref, lead_data) {
          lead_data["isBooked"] = true;
          await t.update(lead_ref, lead_data);
        }

        let lead_data_array = [];
        for (var id of lead_ids) {
          for (var time of times) {
            const lead_obj = await verify(this, id, time);
            lead_data_array.push(lead_obj);
          }
        }

        for (var lead of lead_data_array) {
          await set(lead["ref"], lead["data"]);
        }
      });
      console.log("Transaction success!");
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
