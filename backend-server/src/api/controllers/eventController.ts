import { Timestamp } from "@firebase/firestore";
import { createHash } from "../../util/createHash";
import { dataAccess } from "../data/dataAccess";
import { Event } from "../data/models";

const get_uri: string = "localhost:8080/v1/event/";

export async function addEvent(
  organization: string,
  lead1: string,
  lead2: string,
  intervieweeEmail: string,
  length: number,
  expires: string
) {
  const eventUID: string = createHash(intervieweeEmail, [lead1, lead2], expires);
  const confirmedTime = null;

  const event: Event = {
    organization,
    lead1,
    lead2,
    intervieweeEmail,
    confirmedTime,
    length,
    expires,
    eventUID
  };

  await dataAccess.setEvent(event);

  return {
    link: `${get_uri}?organization=${event.organization}&eventUID=${event.eventUID}`,
    event: event
  };
}

export async function getEvent(organization: string, eventUID: string) {
  const eventData = await dataAccess.getEvent(organization, eventUID);
  eventData["expires"] = eventData["expires"].toDate().toString();
  return eventData;
}

export async function bookEvent(
  organization: string,
  eventUID: string,
  requestedTime: string) {
  try{
    // call Jin's function to update availability for both leads, if succesful then update event, otherwise throw error 
    // const updateLeads = runtransaction();
    await dataAccess.bookEvent(organization, eventUID, requestedTime);
  } catch (err) {
    
  }
}
