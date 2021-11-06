import { dataAccess } from "../data/dataAccess";
import { Availability } from "../data/models";

export interface addAvailabilityBody {
    organization: string;
    interviewerUID: string;
    startTime: string;
    isBooked: boolean;
    bookedByEmail: string;
    durationMins: number;
}
export interface getAvailabilityBody {
    organization: string;
    interviewerUID: string;
    startTime: string;
}

export interface getAllAvailabilitiesBody {
    allAvailabilitiesBody: getAvailabilityBody[]; 
}

export async function addAvailability(
    body: addAvailabilityBody
) {
    const availability: Availability = {
        interviewerUID: body.interviewerUID,
        startTime: body.startTime,
        isBooked: body.isBooked,
        bookedByEmail: body.bookedByEmail,
        durationMins: body.durationMins
    }

    await dataAccess.setAvailability(availability, body.organization);
}

export async function getAvailability(organization: string, interviewerUID: string, startTime: string) {
    return await dataAccess.getAvailability(organization, interviewerUID, startTime);
}

export async function getAllAvailabilities(organization: string, interviewerUID: string) {
    return await dataAccess.getAllAvailabilities(organization, interviewerUID);
}