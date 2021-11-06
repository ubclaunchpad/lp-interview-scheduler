import { differenceInMinutes, formatISO } from "date-fns";
import { dataAccess } from "../data/dataAccess";
import { Availability, EventAPI } from "../data/models";

export interface AddAvailabilityBody {
  organization: string;
  interviewerUID: string;
  startTime: string;
  isBooked: boolean;
  bookedByEmail: string;
  durationMins: number;
}
export interface GetAvailabilityBody {
  organization: string;
  interviewerUID: string;
  startTime: string;
}

export interface getAllAvailabilitiesBody {
  allAvailabilitiesBody: GetAvailabilityBody[];
}
export interface AddMultipleAvailablitiesBody {
  eventsAPI: EventAPI[];
  interviewerUID: string;
  organization: string;
}

export async function addAvailability(body: AddAvailabilityBody) {
  const availability: Availability = {
    interviewerUID: body.interviewerUID,
    startTime: body.startTime,
    isBooked: body.isBooked,
    bookedByEmail: body.bookedByEmail,
    durationMins: body.durationMins,
  };

  await dataAccess.setAvailability(availability, body.organization);
}

export async function addAvailabilities(body: AddMultipleAvailablitiesBody) {
  const availabilitiesFromEvents: Availability[] =
    transformCalendarAvaialabilities(body.eventsAPI);

  for (const availability of availabilitiesFromEvents) {
    await dataAccess.setAvailability(availability, body.organization);
  }
}

export async function getAvailability(
  organization: string,
  interviewerUID: string,
  startTime: string
) {
  return await dataAccess.getAvailability(
    organization,
    interviewerUID,
    startTime
  );
}

export async function getAllAvailabilities(
  organization: string,
  interviewerUID: string
) {
  return await dataAccess.getAllAvailabilities(organization, interviewerUID);
}

export function transformCalendarAvaialabilities(
  calEvents: EventAPI[]
): Availability[] {
  const availabilities: Availability[] = [];
  for (const calEvent of calEvents) {
    availabilities.push(transformSingleCalendarAvailability(calEvent));
  }

  return availabilities;
}

function transformSingleCalendarAvailability(calEvent: EventAPI): Availability {
  const startDate: Date = new Date(calEvent.start);
  const endDate: Date = new Date(calEvent.end);
  const durationMins = differenceInMinutes(endDate, startDate);
  const startTime = formatISO(startDate);
  const isBooked = false;
  const bookedByEmail = "";
  const interviewerUID = calEvent.interviewerUID;

  const availability: Availability = {
    interviewerUID,
    startTime,
    isBooked,
    bookedByEmail,
    durationMins,
  };

  return availability;
}
