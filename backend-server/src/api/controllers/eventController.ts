import { createHash } from "../../util/createHash";
import * as Database from "../data/database";
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

  const allEvents = await Database.listEvents(body.organization);
  const duplicateHash = allEvents.find((event) => event.eventUID === eventUID);

  if (duplicateHash) {
    throw new Error(`Duplicate event`);
  }

  await Database.setEvent(event, body.organization);

  return event;
}

export async function getEvent(eventUID: string) {
  return Database.getEvent(eventUID);
}

export async function bookEvent(
  eventUID: string,
  interviewerUIDs: string[],
  timesToBook: string[]
) {
  return Database.bookInterview(
    interviewerUIDs,
    timesToBook,
    eventUID,
    timesToBook[0]
  );
}

export async function getBookingCount(organization: string) {
  // get list of all documents under event collection for given organization
  const allEvents = await Database.listEvents(organization);

  const bookingCounts: BookingCounts = {
    organization: organization,
    leads: {},
  };

  // iterate through all the documents, map each event to two associated leads
  // for each event in allEvents
  Object.entries(allEvents).forEach(([eventUID, event]) => {
    const leads: Array<{ leadUID: string; name: string }> = event.leads;
    const confirmedTime: string = event.confirmedTime;

    //iterate over all leads in event
    Object.entries(leads).forEach(([index, lead]) => {
      const leadUID = lead.leadUID;
      // if leadName not in bookingCounts, set its pending and confirmed values to 0
      if (!(leadUID in bookingCounts.leads)) {
        bookingCounts.leads[leadUID] = {
          name: lead.name,
          confirmed: 0,
          pending: 0,
        };
      }
      // add 1 to confirmed time if confirmedTime is not null, or 1 to pending if it is
      if (confirmedTime != null) {
        bookingCounts.leads[leadUID].confirmed++;
      } else {
        bookingCounts.leads[leadUID].pending++;
      }
    });
  });

  return bookingCounts;
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

interface BookingCounts {
  organization: string;
  leads: {
    [leadUID: string]: {
      name: string;
      confirmed: number;
      pending: number;
    };
  };
}
