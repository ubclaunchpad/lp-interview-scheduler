import {
  collection,
  CollectionReference,
  doc,
  DocumentReference,
  DocumentData,
  Firestore,
  getDoc,
  Timestamp,
} from "@firebase/firestore";
import { setDoc } from "firebase/firestore";
import { db, } from "../../firebase/db";

import { Interviewer } from "./models";
import { Event } from "./models"

const DB_COLLECTION = "aymendb-destroylater";
const INTERVIEWER_COLLECTION = "interviewers";
const EVENT_COLLECTION = "events";

class DataAccess {
  db: Firestore;
  rootCollectionName: string;
  interviewerCollectionName: string;
  eventCollectionName: string;
  rootCollection: CollectionReference;

  constructor(db, rootCollectionName, interviewerCollectionName, eventCollectionName) {
    this.db = db;
    this.rootCollectionName = rootCollectionName;
    this.interviewerCollectionName = interviewerCollectionName;
    this.eventCollectionName = eventCollectionName;
    this.rootCollection = collection(db, rootCollectionName);
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

  async getInterviewer(
    organization: string,
    userUID: string
  ): Promise<DocumentData> {
    const doc = await this.interviewerDocRef(organization, userUID);
    const res = await getDoc(doc);
    return res.data();
  }

  async setInterviewer(interviewer: Interviewer) {
    const doc = await this.interviewerDocRef(
      interviewer.organization,
      interviewer.userUID
    );
    await setDoc(doc, interviewer);
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

  async setEvent(event: Event) {
    const doc = await this.eventDocRef(
      event.organization,
      event.eventUID
    );

    await setDoc(doc, event);
  }
  async bookEvent(
    organization: string,
    eventUID: string,
    requestedTime: string
  ) {
    const doc = await this.eventDocRef(organization, eventUID);
    const confirmedTimeStamp = Timestamp.fromDate(new Date(requestedTime));
    await setDoc(doc, 
      { confirmedTime: confirmedTimeStamp },
      { merge: true });
  }
}



export const dataAccess = new DataAccess(
  db,
  DB_COLLECTION,
  INTERVIEWER_COLLECTION,
  EVENT_COLLECTION
);
