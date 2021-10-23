import { doc, getDoc } from "@firebase/firestore";
import { setDoc } from "firebase/firestore";
import { db } from "../../firebase/db";
import { DB_COLLECTION } from "./config";

export const INTERVIEWER_COLLECTION = "interviewers";
const AVAILABILITY_COLLECTION = "availabilities";


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
    INTERVIEWER_COLLECTION,
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
    INTERVIEWER_COLLECTION,
    userUID
  );

  const res = await getDoc(interviewerRefInOrganization);
  return res.data();
}

export async function addAvailabilityToInterviewer(
    organization: string,
    interviewerUID: string,
    startTimeString: string,
    startTime: Date,
    isBooked: boolean,
    durationMins: number) {
  const availabilityRefInInterviewer = await doc(
      db,
      DB_COLLECTION,
      organization,
      INTERVIEWER_COLLECTION,
      interviewerUID,
      AVAILABILITY_COLLECTION,
      startTimeString
  );
  await setDoc(availabilityRefInInterviewer, { startTime, isBooked, durationMins });
}

export async function getAvailabilityFromInterviewer(
    organization: string,
    interviewerUID: string,
    startTimeString: string,
) {
  const availabilityRefInInterviewer = await doc(
      db,
      DB_COLLECTION,
      organization,
      INTERVIEWER_COLLECTION,
      interviewerUID,
      AVAILABILITY_COLLECTION,
      startTimeString
  );

  const res = await getDoc(availabilityRefInInterviewer);
  return res.data();
}
