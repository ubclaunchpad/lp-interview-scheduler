import { Timestamp } from "@firebase/firestore";
import { createHash } from "../../util/createHash";
import { dataAccess } from "../data/dataAccess";
import { Event } from "../data/models";

const get_uri: string = "localhost:8080/v1/event/";

export async function addEvent(body: AddEventBody) {
  const leadNames = body.leads.map((lead) => {
    return lead.name;
  });

  const eventUID: string = createHash(
    body.intervieweeEmail,
    leadNames,
    body.expires
  );

  const event: Event = {
    leads: body.leads,
    intervieweeEmail: body.intervieweeEmail,
    confirmedTime: null,
    length: body.length,
    expires: body.expires,
    eventUID: eventUID,
  };

  await dataAccess.setEvent(event, body.organization);

  return event;
}

export async function getEvent(organization: string, eventUID: string) {
  return await dataAccess.getEvent(organization, eventUID);
}

export interface AddEventBody {
  organization: string;
  leads: Array<{ leadUID: string; name: string }>;
  intervieweeEmail: string;
  length: number;
  expires: string;
}

export interface GetEventBody {
  organization: string;
  eventUID: string;
}
