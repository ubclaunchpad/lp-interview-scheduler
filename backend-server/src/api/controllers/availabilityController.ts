import { dataAccess } from "../data/dataAccess";
import { Availability } from "../data/models";

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
