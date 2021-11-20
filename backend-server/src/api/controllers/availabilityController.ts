import { add, differenceInMinutes, formatISO } from "date-fns";
import { dataAccess } from "../data/dataAccess";
import { Availability, CalendarAvailablity } from "../data/models";

export interface AddAvailabilityBody {
  organization: string;
  interviewerUID: string;
  startTime: string;
  isBooked: boolean;
  bookedByEmail: string;
  durationMins: number;
}

export interface ReplaceAvailabilitiesBody {
  eventsAPI: CalendarAvailablity[];
  interviewerUID: string;
  organization: string;
}
export interface GetAvailabilityParams {
  organization: string;
  interviewerUID: string;
  startTime: string;
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

export async function addAvailabilities(body: ReplaceAvailabilitiesBody) {
  const availabilitiesFromCalendarAvailabilities: Availability[] =
    makeMultipleAvailabilities(body.eventsAPI);

  for (const availability of availabilitiesFromCalendarAvailabilities) {
    await dataAccess.setAvailability(availability, body.organization);
  }
}

export async function replaceAllAvailabilities(
  body: ReplaceAvailabilitiesBody
) {
  const availabilities: Availability[] = makeMultipleAvailabilities(
    body.eventsAPI
  );

  await dataAccess.deleteAvailabilityCollection(
    body.organization,
    body.interviewerUID
  );

  for (const availability of availabilities) {
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

export async function getAllCalendarAvailabilities(
  organization: string,
  interviewerUID: string
): Promise<CalendarAvailablity[]> {
  const availabilities = (await dataAccess.getAllAvailabilities(
    organization,
    interviewerUID
  )) as Availability[];
  return makeMultipleCalendarAvailabilities(availabilities);
}

export function makeMultipleAvailabilities(
  calendarAvailabilities: CalendarAvailablity[]
): Availability[] {
  const availabilities: Availability[] = [];
  for (const calendarAvailability of calendarAvailabilities) {
    availabilities.push(makeSingleAvailability(calendarAvailability));
  }

  return availabilities;
}

export function makeMultipleCalendarAvailabilities(
  availabilities: Availability[]
): CalendarAvailablity[] {
  const calendarAvailabilities: CalendarAvailablity[] = [];
  for (const availability of availabilities) {
    calendarAvailabilities.push(makeSingleCalendarAvailability(availability));
  }

  return calendarAvailabilities;
}

function makeSingleAvailability(
  calendarAvailability: CalendarAvailablity
): Availability {
  const startDate: Date = new Date(calendarAvailability.start);
  const endDate: Date = new Date(calendarAvailability.end);
  const durationMins = differenceInMinutes(endDate, startDate);
  const startTime = formatISO(startDate);
  const isBooked = false;
  const bookedByEmail = "";
  const interviewerUID = calendarAvailability.interviewerUID;

  const availability: Availability = {
    interviewerUID,
    startTime,
    isBooked,
    bookedByEmail,
    durationMins,
  };

  return availability;
}

function makeSingleCalendarAvailability(
  availability: Availability
): CalendarAvailablity {
  const startDate: Date = new Date(availability.startTime);
  const endDate: Date = add(startDate, { minutes: availability.durationMins });
  const start = formatISO(startDate);
  const end = formatISO(endDate);
  const interviewerUID = availability.interviewerUID;

  const calendarAvailability: CalendarAvailablity = {
    interviewerUID,
    start,
    end,
  };

  return calendarAvailability;
}
