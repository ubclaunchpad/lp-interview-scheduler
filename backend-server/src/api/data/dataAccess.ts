import { 
  collection,
  CollectionReference,
  doc,
  DocumentReference,
  DocumentData,
  Firestore,
  getDoc,
  getDocs,
  setDoc 
} from "firebase/firestore";
import { db } from "../../firebase/db";

import { Availability, Interviewer } from "./models";

const DB_COLLECTION = "aymendb-destroylater";
const INTERVIEWER_COLLECTION = "interviewers";
const AVAILABILITY_COLLECTION = "availabilities";

class DataAccess {
  db: Firestore;
  rootCollectionName: string;
  interviewerCollectionName: string;
  availabilityCollectionName: string;
  rootCollection: CollectionReference;

  constructor(
    db: Firestore,
    rootCollectionName: string,
    interviewerCollectionName: string,
    availabilityCollectionName: string
  ) {
    this.db = db;
    this.rootCollectionName = rootCollectionName;
    this.interviewerCollectionName = interviewerCollectionName;
    this.availabilityCollectionName = availabilityCollectionName;
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
      startTime: string,
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


  async getAllAvailabilities(
    organization: string,
    interviewerUID: string
): Promise<DocumentData> {
  const docCollection = await getDocs(collection(
    this.rootCollection,
    organization,
    this.interviewerCollectionName,
    interviewerUID,
    this.availabilityCollectionName
));
  return docCollection.docs.map(doc => doc.data());
}

  async setAvailability(availability: Availability, organization: string) {
    const doc = await this.availabilityDocRef(
        organization,
        availability.interviewerUID,
        availability.startTime
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
