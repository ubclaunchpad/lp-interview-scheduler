import {
  add,
  closestTo,
  formatISO,
  isAfter,
  isBefore,
  isSameMinute,
  startOfDay,
} from "date-fns";
import * as Database from "../data/database";
import { Availability, CalendarAvailability } from "../data/models";

export interface AddAvailabilityBody {
  organization: string;
  interviewerUID: string;
  startTime: string;
  isBooked: boolean;
  bookedByEmail: string;
  durationMins: number;
}

export interface ReplaceAvailabilitiesBody {
  eventsAPI: CalendarAvailability[];
  interviewerUID: string;
  organization: string;
}
export interface GetAvailabilityParams {
  organization: string;
  interviewerUID: string;
}

export interface GetMergedRoutesParams {
  organization: string;
  interviewerUID1: string;
  interviewerUID2: string;
}

export interface GetMultipleMergedRoutesParams {
  organization: string;
  interviewerUIDs: string[];
}

export async function addAvailability(body: AddAvailabilityBody) {
  const availability: Availability = {
    interviewerUID: body.interviewerUID,
    startTime: body.startTime,
    isBooked: body.isBooked,
    bookedByEmail: body.bookedByEmail,
    durationMins: body.durationMins,
  };

  await Database.setAvailability(availability);
}

export async function replaceAllAvailabilities(
  body: ReplaceAvailabilitiesBody
): Promise<Availability[]> {
  const availabilitiesFromRequest: Availability[] =
    await makeMultipleAvailabilities(body.eventsAPI, body.organization);

  const availabilitiesFromDB = await getInterviewerAvailabilities(
    body.organization,
    body.interviewerUID
  );

  if (doesExistConflict(availabilitiesFromRequest, availabilitiesFromDB)) {
    throw new Error(
      "One of your available slots is booked but is not yet reflected on the website. Please refresh the page to see the latest changes"
    );
  }

  await Database.deleteAvailabilityCollection(body.interviewerUID);

  for (const availability of availabilitiesFromRequest) {
    await Database.setAvailability(availability);
  }

  return availabilitiesFromRequest;
}

export async function getAvailability(
  interviewerUID: string,
  startTime: string
): Promise<Availability> {
  return Database.getAvailability(interviewerUID, startTime);
}

export async function getInterviewerAvailabilities(
  organization: string,
  interviewerUID: string
): Promise<Availability[]> {
  await Database.deleteExpiredAvailabilities(organization, interviewerUID);
  return Database.getAllAvailabilities(interviewerUID);
}

export async function getInterviewerCalendarAvailabilities(
  organization: string,
  interviewerUID: string
): Promise<CalendarAvailability[]> {
  const availabilities = (await getInterviewerAvailabilities(
    organization,
    interviewerUID
  )) as Availability[];

  return makeMultipleCalendarAvailabilities(availabilities, organization);
}

export async function makeMultipleAvailabilities(
  calendarAvailabilities: CalendarAvailability[],
  organization: string
): Promise<Availability[]> {
  const availabilities: Availability[] = [];
  for (const calendarAvailability of calendarAvailabilities) {
    availabilities.push(
      ...(await makeAvailabilitiesFromCalendarAvailability(
        calendarAvailability,
        organization
      ))
    );
  }

  return availabilities;
}

export async function makeMultipleCalendarAvailabilities(
  availabilities: Availability[],
  organization: string
): Promise<CalendarAvailability[]> {
  const availabilityBlockLength = (
    await Database.getOrganizationFields(organization)
  ).availabilityBlockLength;

  const calendarAvailabilities: CalendarAvailability[] = [];

  for (let i = 0; i < availabilities.length; i++) {
    const currStartDate = new Date(availabilities[i].startTime);
    let currEndDate = add(currStartDate, { minutes: availabilityBlockLength });

    const currIsBooked = availabilities[i].isBooked;
    const bookedByEmail = currIsBooked ? availabilities[i].bookedByEmail : "";

    if (!currIsBooked) {
      for (let j = i + 1; j < availabilities.length; j++) {
        const nextStartDate = new Date(availabilities[j].startTime);

        if (
          !isSameMinute(currEndDate, nextStartDate) ||
          availabilities[j].isBooked
        ) {
          break;
        }

        currEndDate = add(nextStartDate, { minutes: availabilityBlockLength });
        i = j;
      }
    }

    const newCalendarAvailability: CalendarAvailability = {
      interviewerUID: availabilities[i].interviewerUID,
      start: formatISO(currStartDate),
      end: formatISO(currEndDate),
      isBooked: currIsBooked,
      bookedByEmail,
    };

    calendarAvailabilities.push(newCalendarAvailability);
  }

  return calendarAvailabilities;
}

async function makeAvailabilitiesFromCalendarAvailability(
  calendarAvailability: CalendarAvailability,
  organization: string
): Promise<Availability[]> {
  const startDate: Date = new Date(calendarAvailability.start);
  const endDate: Date = new Date(calendarAvailability.end);

  const availabilityBlockLength = (
    await Database.getOrganizationFields(organization)
  ).availabilityBlockLength;

  const minsIn24Hours = 24 * 60;
  const numAvailabilityBlocksIn24Hours =
    minsIn24Hours / availabilityBlockLength;

  const intervalsOfDates: Date[] = [];

  let currentDate = startOfDay(startDate);

  // populate array of date objects with all possible intervals in 24 hours
  for (let i = 0; i < numAvailabilityBlocksIn24Hours; i++) {
    const newDate = add(currentDate, {
      minutes: availabilityBlockLength * i,
    });
    intervalsOfDates.push(newDate);
  }

  // newStart is the earliest interval start time after the given startDate
  let newStart = closestTo(startDate, intervalsOfDates);

  if (isBefore(newStart, startDate)) {
    newStart = closestTo(
      add(startDate, { minutes: availabilityBlockLength }),
      intervalsOfDates
    );
  }

  // newEnd is the potential end time for this slot relative to newStart
  let newEnd = add(newStart, { minutes: availabilityBlockLength });

  const availabilities: Availability[] = [];

  // populate the availabilities array
  while (!isAfter(newEnd, endDate)) {
    const newAvailability: Availability = {
      interviewerUID: calendarAvailability.interviewerUID,
      startTime: formatISO(newStart),
      isBooked: calendarAvailability.isBooked,
      bookedByEmail: calendarAvailability.bookedByEmail,
      durationMins: availabilityBlockLength,
    };

    availabilities.push(newAvailability);
    newStart = add(newStart, { minutes: availabilityBlockLength });
    newEnd = add(newStart, { minutes: availabilityBlockLength });
  }

  return availabilities;
}

function doesExistConflict(
  availabilitiesFromRequest: Availability[],
  availabilitiesFromDB: Availability[]
) {
  for (let i = 0; i < availabilitiesFromDB.length; i++) {
    const databaseAvailability = availabilitiesFromDB[i];

    if (databaseAvailability.isBooked) {
      const found = availabilitiesFromRequest.find((requestAvailability) =>
        equalAvailabilities(requestAvailability, databaseAvailability)
      );

      if (!found) {
        // booked availability from DB is not present in the availabilities from the request
        return true;
      }
    }
  }

  return false;
}

function equalAvailabilities(a: Availability, b: Availability) {
  return (
    a.bookedByEmail === b.bookedByEmail &&
    a.durationMins === b.durationMins &&
    a.interviewerUID === b.interviewerUID &&
    a.isBooked === b.isBooked &&
    a.startTime === b.startTime
  );
}
