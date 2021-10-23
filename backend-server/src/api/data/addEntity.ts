import { doc, getDoc } from "@firebase/firestore";
import { setDoc } from "firebase/firestore";
import { db } from "../../firebase/db";
import { DB_COLLECTION } from "./config";

const INTERVIEWER_COLLECTION = "interviewers";


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
