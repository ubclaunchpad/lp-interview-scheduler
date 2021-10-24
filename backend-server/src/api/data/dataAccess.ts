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

import { Interviewer } from "./models";

const DB_COLLECTION = "aymendb-destroylater";
const INTERVIEWER_COLLECTION = "interviewers";

class DataAccess {
  db: Firestore;
  rootCollectionName: string;
  interviewerCollectionName: string;
  rootCollection: CollectionReference;

  constructor(
    db: Firestore,
    rootCollectionName: string,
    interviewerCollectionName: string
  ) {
    this.db = db;
    this.rootCollectionName = rootCollectionName;
    this.interviewerCollectionName = interviewerCollectionName;
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
}

export const dataAccess = new DataAccess(
  db,
  DB_COLLECTION,
  INTERVIEWER_COLLECTION
);
