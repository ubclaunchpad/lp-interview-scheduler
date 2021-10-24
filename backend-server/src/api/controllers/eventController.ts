import { Timestamp } from "@firebase/firestore";
import {
    addEventToOrganization,
} from "../data/addEntity";

export async function addEvent(
  organization: string,
  lead1: string,
  lead2: string,
  intervieweeEmail: string,
  length: number,
  expires: string
) {
    await addEventToOrganization(
        organization,
        lead1,
        lead2,
        intervieweeEmail,
        length,
        expires);
}