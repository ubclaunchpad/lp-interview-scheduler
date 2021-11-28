import {
  add,
  closestTo,
  formatISO,
  isBefore,
  isSameMinute,
  startOfDay,
} from "date-fns";
import { dataAccess } from "../data/dataAccess";
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

export async function replaceAllAvailabilities(
  body: ReplaceAvailabilitiesBody
): Promise<Availability[]> {
  const availabilities: Availability[] = await makeMultipleAvailabilities(
    body.eventsAPI,
    body.organization
  );

  // // I think we want to allow zero length availabilities 
  // // (if the interviewer wiped their availability)
  // if (!availabilities.length) {
  //   throw new Error("Can not construct availabilities from given input");
  // }

  await dataAccess.deleteAvailabilityCollection(
    body.organization,
    body.interviewerUID
  );

  for (const availability of availabilities) {
    await dataAccess.setAvailability(availability, body.organization);
  }

  return availabilities;
}

export async function getAvailability(
  organization: string,
  interviewerUID: string,
  startTime: string
): Promise<Availability> {
  return (await dataAccess.getAvailability(
    organization,
    interviewerUID,
    startTime
  )) as Availability;
}

export async function getInterviewerAvailabilities(
  organization: string,
  interviewerUID: string
): Promise<Availability[]> {
  return (await dataAccess.getAllAvailabilities(
    organization,
    interviewerUID
  )) as Availability[];
}

export async function getInterviewerCalendarAvailabilities(
  organization: string,
  interviewerUID: string
): Promise<CalendarAvailability[]> {
  const availabilities = (await dataAccess.getAllAvailabilities(
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
    (await dataAccess.getOrganizationFields(organization)) as any
  ).availabilityBlockLength as number;
  const calendarAvailabilities: CalendarAvailability[] = [];

  for (let i = 0; i < availabilities.length; i++) {
    const currStartDate = new Date(availabilities[i].startTime);
    let currEndDate = add(currStartDate, { minutes: availabilityBlockLength });

    for (let j = i + 1; j < availabilities.length; j++) {
      const nextStartDate = new Date(availabilities[j].startTime);

      if (!isSameMinute(currEndDate, nextStartDate)) {
        break;
      }

      currEndDate = add(nextStartDate, { minutes: availabilityBlockLength });
      i = j;
    }

    const newCalendarAvailability: CalendarAvailability = {
      interviewerUID: availabilities[i].interviewerUID,
      start: formatISO(currStartDate),
      end: formatISO(currEndDate),
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
    (await dataAccess.getOrganizationFields(organization)) as any
  ).availabilityBlockLength as number;

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
  while (isBefore(newEnd, endDate) || isSameMinute(newEnd, endDate)) {
    const newAvailability: Availability = {
      interviewerUID: calendarAvailability.interviewerUID,
      startTime: formatISO(newStart),
      isBooked: false,
      bookedByEmail: "",
      durationMins: availabilityBlockLength,
    };

    availabilities.push(newAvailability);
    newStart = add(newStart, { minutes: availabilityBlockLength });
    newEnd = add(newStart, { minutes: availabilityBlockLength });
  }

  return availabilities;
}
