import { doc, getDoc, Timestamp, collection } from "@firebase/firestore";
import { setDoc } from "firebase/firestore";
import { db } from "../../firebase/db";
import { DB_COLLECTION } from "./config";
import { sha3_256 } from 'js-sha3';

const INTERVIEWR_COLLECTION = "interviewers";
const EVENT_COLLECTION = "events";

export async function addInterviewerToOrganization(
  organization: string,
  userUID: string,
  email: string,
  name: string
) {
  const interviewerRefInOrganization = await doc(
    db,
    DB_COLLECTION,
    organization,
    INTERVIEWR_COLLECTION,
    userUID
  );

  await setDoc(interviewerRefInOrganization, { name, email });
}

export async function getInterviewerFromOrganizationByID(
  organization: string,
  userUID: string
) {
  const interviewerRefInOrganization = await doc(
    db,
    DB_COLLECTION,
    organization,
    INTERVIEWR_COLLECTION,
    userUID
  );

  const res = await getDoc(interviewerRefInOrganization);
  return res.data();
}

export async function addEventToOrganization(
  organization: string,
  lead1: string,
  lead2: string,
  intervieweeEmail: string,
  length: number,
  expires: string
) {
  //const eventID = createHash([lead1, lead2, intervieweeEmail, expires]);
  console.log(organization);
  const eventRef = await doc(
    db,
    "ray-temp",
    organization,
    EVENT_COLLECTION,
    "testkey"
  );

  await setDoc(eventRef, {lead1, lead2, intervieweeEmail, length, expires});
}

function createHash(interviewInfo: any): string{
  let keys: string[] = interviewInfo.keys();
  return String(sha3_256(interviewInfo.reduce((prevVal, currVal) => {
      return String(prevVal + String(sha3_256(interviewInfo[currVal])));
  })))
  // or
  return sha3_256(JSON.stringify(interviewInfo));
}
