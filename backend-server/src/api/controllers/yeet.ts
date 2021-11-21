import {
  add,
  closestTo,
  differenceInMinutes,
  formatISO,
  isBefore,
  isSameMinute,
  startOfDay,
} from "date-fns";
import { format } from "path/posix";
import { dataAccess } from "../data/dataAccess";
import { Availability, CalendarAvailability } from "../data/models";
function findOverlapping(
  availabilities1: CalendarAvailability[],
  availabilities2: CalendarAvailability[]
) {
  // where availabilities1 and availabilities2 are the sorted, continuous time interval arrays representing the interviewers availabilities
  // e.g. availabilities1 = [[10, 11], [11:30, 12:30], [1:00, 4:00]] where each subarray is an object

  let idx1 = 0;
  let idx2 = 0;

  let currAvailability: CalendarAvailability | null = null;
  let prevAvailability: CalendarAvailability | null = null;

  const output: CalendarAvailability[] = [];

  while (idx1 < availabilities1.length && idx2 < availabilities2.length) {
    if (availabilities1[idx1].start < availabilities2[idx2].start) {
      currAvailability = availabilities1[idx1];
      idx1++;
    } else {
      currAvailability = availabilities2[idx2];
      idx2++;
    }

    if (prevAvailability != null) {
      if (currAvailability.start < prevAvailability.end) {
        let startTime = currAvailability.start;
        let endTime =
          currAvailability.end < prevAvailability.end
            ? currAvailability.end
            : prevAvailability.end;
        let newAvailability: CalendarAvailability = {
          interviewerUID: "",
          start: startTime,
          end: endTime,
        };
        // console.log(newAvailability);
        output.push(newAvailability);

        if (currAvailability.start < prevAvailability.end) {
          prevAvailability = {
            interviewerUID: "",
            start: currAvailability.end,
            end: prevAvailability.end,
          };
        } else {
          prevAvailability = currAvailability;
        }
      }
    } else {
      prevAvailability = currAvailability;
    }
  }
  return output;
}

async function makeAvailabilitiesFromCalendarAvailability(
  calendarAvailability: CalendarAvailability,
  organization: string
): Promise<Availability[]> {
  const startDate: Date = new Date(calendarAvailability.start);
  const endDate: Date = new Date(calendarAvailability.end);
  const interviewDuration = (
    (await dataAccess.getOrganizationFields(organization)) as any
  ).interviewDuration as number;
  const durationMins = differenceInMinutes(endDate, startDate);
  const minsIn24Hours = 24 * 60;
  const numIntervalsIn24Hours = minsIn24Hours / interviewDuration;

  const intervalsOfDates: Date[] = [];

  let currentDate = startOfDay(startDate);
  // populate array of date objects with all possible intervals in 24 hours
  for (let i = 0; i < numIntervalsIn24Hours; i++) {
    const newDate = add(currentDate, {
      minutes: interviewDuration * i,
    });
    intervalsOfDates.push(newDate);
  }

  // newStart is the earliest interval start time after the given startDate
  let newStart = closestTo(startDate, intervalsOfDates);
  if (isBefore(newStart, startDate)) {
    newStart = closestTo(
      add(startDate, { minutes: interviewDuration }),
      intervalsOfDates
    );
  }

  // newEnd is the potential end time for this slot relative to newStart
  let newEnd = add(newStart, { minutes: interviewDuration });

  // populate the availabilities array
  const availabilities: Availability[] = [];
  while (isBefore(newEnd, endDate) || isSameMinute(newEnd, endDate)) {
    const newAvailability: Availability = {
      interviewerUID: calendarAvailability.interviewerUID,
      startTime: formatISO(newStart),
      isBooked: false,
      bookedByEmail: "",
      durationMins: interviewDuration,
    };
    availabilities.push(newAvailability);
    newStart = add(newStart, { minutes: interviewDuration });
    newEnd = add(newStart, { minutes: interviewDuration });
  }

  return availabilities;
}

export async function makeMultipleCalendarAvailabilities(
  availabilities: Availability[],
  organization: string
): Promise<CalendarAvailability[]> {
  const interviewDuration = (
    (await dataAccess.getOrganizationFields(organization)) as any
  ).interviewDuration as number;
  const calendarAvailabilities: CalendarAvailability[] = [];
  for (let i = 0; i < availabilities.length; i++) {
    const currStartDate = new Date(availabilities[i].startTime);
    let currEndDate = add(currStartDate, { minutes: interviewDuration });
    for (let j = i + 1; j < availabilities.length; j++) {
      const nextStartDate = new Date(availabilities[j].startTime);
      if (!isSameMinute(currEndDate, nextStartDate)) {
        break;
      }
      currEndDate = add(nextStartDate, { minutes: interviewDuration });
      i = j;
    }
    const newCalendarAvailability: CalendarAvailability = {
      interviewerUID: availabilities[i].interviewerUID,
      start: formatISO(currStartDate),
      end: formatISO(currEndDate),
    };
    calendarAvailabilities.push(newCalendarAvailability);
  }
  console.log(calendarAvailabilities);

  return calendarAvailabilities;
}

if (require.main === module) {
  const calavail: CalendarAvailability = {
    interviewerUID: "",
    start: "2021-11-20T10:00:00-08:00",
    end: "2021-11-20T12:00:00-08:00",
  };
  const availarr = [
    {
      interviewerUID: "",
      startTime: "2021-11-20T10:00:00-08:00",
      isBooked: false,
      bookedByEmail: "",
      durationMins: 30,
    },
    {
      interviewerUID: "",
      startTime: "2021-11-20T10:30:00-08:00",
      isBooked: false,
      bookedByEmail: "",
      durationMins: 30,
    },
    {
      interviewerUID: "",
      startTime: "2021-11-20T11:00:00-08:00",
      isBooked: false,
      bookedByEmail: "",
      durationMins: 30,
    },
    {
      interviewerUID: "",
      startTime: "2021-11-20T11:30:00-08:00",
      isBooked: false,
      bookedByEmail: "",
      durationMins: 30,
    },
    {
      interviewerUID: "",
      startTime: "2021-11-20T12:30:00-08:00",
      isBooked: false,
      bookedByEmail: "",
      durationMins: 30,
    },
  ];

  makeMultipleCalendarAvailabilities(availarr, "launchpad");

  //   makeAvailabilitiesFromCalendarAvailability(calavail, "launchpad");
}
