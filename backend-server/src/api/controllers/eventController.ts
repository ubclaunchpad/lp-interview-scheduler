import { Timestamp } from "@firebase/firestore";
import { createHash } from "../../util/createHash";
import { dataAccess } from "../data/dataAccess";
import { Event } from "../data/models";

export async function addEvent(
  organization: string,
  lead1: string,
  lead2: string,
  intervieweeEmail: string,
  length: number,
  expires: string
) {
    const expiresTimestamp: Timestamp = Timestamp.fromDate(new Date(expires));
    const eventUID: string = createHash(lead1, lead2, intervieweeEmail);
    const confirmedTime = null;

    const event: Event = {
        organization,
        lead1,
        lead2,
        intervieweeEmail,
        confirmedTime,
        length, 
        expires: expiresTimestamp,
        eventUID
    };

    await dataAccess.setEvent(event);
}

export async function getEvent(organization:string, eventUID: string) {
  const eventData = await dataAccess.getEvent(organization, eventUID);
  eventData["expires"] = eventData["expires"].toDate().toString();
  return eventData;
}

export async function bookEvent(
  organization: string,
  eventUID: string,
  requestedTime: string) {
    await dataAccess.bookEvent(organization, eventUID, requestedTime);
  }