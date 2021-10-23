import {
    addAvailabilityToInterviewer,
    getAvailabilityFromInterviewer,
} from "../data/addAvailability";
import Timeslot from "../../models/Timeslot"

export async function addAvailability(
    organization: string,
    interviewerUID: string,
    startTimeString: string,
    startTime: Date,
    isBooked: boolean,
    durationMins: number,
) {
    await addAvailabilityToInterviewer(organization, interviewerUID, startTimeString, startTime, isBooked, durationMins);
}

export async function getAvailability(organization: string, interviewerUID: string, startTimeString: string) {
    return await getAvailabilityFromInterviewer(organization, interviewerUID, startTimeString);
}
