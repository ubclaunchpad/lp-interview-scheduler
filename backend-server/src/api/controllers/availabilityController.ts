import { dataAccess } from "../data/dataAccess";
import { Availability } from "../data/models";

export async function addAvailability(
    organization: string,
    interviewerUID: string,
    startTimeString: string,
    startTime: Date,
    isBooked: boolean,
    durationMins: number,
) {
    const availability: Availability = {
        organization,
        interviewerUID,
        startTimeString,
        startTime,
        isBooked,
        durationMins,
    };

    await dataAccess.setAvailability(availability);
}

export async function getAvailability(organization: string, interviewerUID: string, startTimeString: string) {
    return await dataAccess.getAvailability(organization, interviewerUID, startTimeString);
}