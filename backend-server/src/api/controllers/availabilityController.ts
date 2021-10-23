import {
    addAvailabilityToInterviewer,
    getAvailabilityFromInterviewer,
} from "../data/addAvailability";
import Timeslot from "../../models/Timeslot"

export async function addAvailability(
    timeslot: string,
) {
    await addAvailabilityToInterviewer(timeslot);
}

export async function getAvailability(interviewerUID: string) {
    return await getAvailabilityFromInterviewer(interviewerUID);
}
