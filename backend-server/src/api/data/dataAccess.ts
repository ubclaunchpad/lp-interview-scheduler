import {
  collection,
  CollectionReference,
  doc,
  DocumentReference,
  DocumentData,
  Firestore,
  getDoc,
} from "@firebase/firestore";
import { setDoc } from "firebase/firestore";
import { db } from "../../firebase/db";

import {Availability, Interviewer } from "./models";

const DB_COLLECTION = "aymendb-destroylater";
const INTERVIEWER_COLLECTION = "interviewers";
const AVAILABILITY_COLLECTION = "availabilities";


class DataAccess {
  db: Firestore;
  rootCollectionName: string;
  interviewerCollectionName: string;
  availabilityCollectionName: string;
  rootCollection: CollectionReference;

  constructor(db, rootCollectionName, interviewerCollectionName, availabilityCollectionName) {
    this.db = db;
    this.rootCollectionName = rootCollectionName;
    this.interviewerCollectionName = interviewerCollectionName;
    this.availabilityCollectionName = availabilityCollectionName;
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

  async availabilityDocRef(
      organization: string,
      interviewerUID: string,
      startTimeString: string,
  ): Promise<DocumentReference<DocumentData>> {
    return await doc(
        this.rootCollection,
        organization,
        this.interviewerCollectionName,
        interviewerUID,
        this.availabilityCollectionName,
        startTimeString
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

  async getAvailability(
      organization: string,
      interviewerUID: string,
      startTimeString: string,
  ): Promise<DocumentData> {
    const doc = await this.availabilityDocRef(organization, interviewerUID, startTimeString);
    const res = await getDoc(doc);
    return res.data();
  }

  async setAvailability(availability: Availability) {
    const doc = await this.availabilityDocRef(
        availability.organization,
        availability.interviewerUID,
        availability.startTimeString,
    );
    await setDoc(doc, availability);
  }
}

export const dataAccess = new DataAccess(
    db,
    DB_COLLECTION,
    INTERVIEWER_COLLECTION,
    AVAILABILITY_COLLECTION
);
