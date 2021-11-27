import { createHash } from "../../util/createHash";
import { dataAccess } from "../data/dataAccess";
import { Event } from "../data/models";

export async function addEvent(body: AddEventBody) {
  const leadUIDs = body.leads.map((lead) => {
    return lead.leadUID;
  });

  const eventUID: string = createHash(
    body.intervieweeEmail,
    leadUIDs,
    body.expires
  );

  const event: Event = {
    leads: body.leads,
    intervieweeEmail: body.intervieweeEmail,
    confirmedTime: null,
    eventLengthInMinutes: body.length,
    expires: body.expires,
    eventUID: eventUID,
  };

  await dataAccess.setEvent(event, body.organization);

  return event;
}

export async function getEvent(organization: string, eventUID: string) {
  return await dataAccess.getEvent(organization, eventUID);
}

export async function bookEvent(
  organization: string,
  eventUID: string,
  leadUIDs: string[],
  times: string[]
) {
  const transactionResult = await dataAccess.bookInterview(
    organization,
    leadUIDs,
    times,
    eventUID,
    times[0]
  );
  if (!transactionResult) throw `Booking event ${eventUID} transaction failed`;
  return transactionResult;
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

export interface BookEventBody {
  organization: string;
  eventUID: string;
  leadUIDs: string[];
  times: string[];
}
