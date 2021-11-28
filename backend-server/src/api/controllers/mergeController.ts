import { Availability, CalendarAvailability } from "../data/models";

export function findOverlapping(
  availabilities1: Availability[],
  availabilities2: Availability[]
): Availability[] {
  const output: Availability[] = [];

  availabilities1.forEach((timeSlot) => {
    let commonTime: Availability = availabilities2.find(
      (element) => element.startTime == timeSlot.startTime
    );
    if (commonTime) {
      output.push(commonTime);
    }
  });

  return output;
}

// unused, but keeping this around in case we end up needing it at some point
function findOverlappingGeneric(
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
