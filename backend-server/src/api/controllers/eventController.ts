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

export async function getBookingCount(organization: string) {
  // get list of all documents under event collection for given organization
  const allEvents = await dataAccess.listEvents(organization);

  const bookingCounts: BookingCounts = {
    organization: organization,
    leads: {},
  };

  // iterate through all the documents, map each event to two associated leads
  // for each event in allEvents
  Object.entries(allEvents).forEach(([eventUID, eventDocument]) => {
    const leads: Array<{ leadUID: string; name: string }> = eventDocument.leads;
    const confirmedTime: string = eventDocument.confirmedTime;

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
