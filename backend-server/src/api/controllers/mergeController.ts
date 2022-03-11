import { Availability, CalendarAvailability } from "../data/models";
import { dataAccess } from "../data/dataAccess";

// find overlapping availabilities of interviewer pair
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

// find overlapping availabilities of arbitrary number of interviewers
export async function findAllOverlapping(
  availabilities: Availability[][],
  organization: string
): Promise<Availability[]> {
  const output: Availability[] = [];
  if (availabilities.length == 1) {
    return availabilities[0];
  } 

  const hoursBuffer: number = await getHoursBuffer(organization);

  availabilities[0].forEach((timeSlot) => {
    let i = 1;
    let commonTime = timeSlot;

    const today: Date = new Date()
    const datestr: Date = new Date(timeSlot.startTime);
    let diff: number = today.getTime() - datestr.getTime();
    diff = Math.ceil(diff/ ( 1000 * 3600));
    
    // verify timeslot has not been booked and is not within hoursBuffer 
    if (!timeSlot.isBooked && diff > hoursBuffer) {
      while (i < availabilities.length) {
        commonTime = availabilities[i].find(
          (element) => element.startTime == timeSlot.startTime
        );

        //check if commonTime was found and verify it is not booked
        if (!commonTime && !commonTime.isBooked) {
          commonTime = null;
          break;
        } else {
          i++       
        }
      } 
      if (commonTime) {
        output.push(commonTime);
      }
    }
  })

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
          // fixme: this function isn't being used, adding this so that it compiles
          isBooked: false,
          bookedByEmail: "",
        };
        output.push(newAvailability);

        if (currAvailability.start < prevAvailability.end) {
          prevAvailability = {
            interviewerUID: "",
            start: currAvailability.end,
            end: prevAvailability.end,
            // fixme: this function isn't being used, adding this so that it compiles
            isBooked: false,
            bookedByEmail: "",
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
async function getHoursBuffer(organization: string): Promise<number> {
  const eventDoc = await dataAccess.getOrganizationFields(organization);
  console.log(eventDoc);
  return Promise.resolve(24);
}

