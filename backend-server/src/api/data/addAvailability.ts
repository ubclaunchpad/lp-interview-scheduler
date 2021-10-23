import { doc, getDoc } from "@firebase/firestore";
import { setDoc } from "firebase/firestore";
import { db } from "../../firebase/db";
import { DB_COLLECTION } from "./config";

const AVAILABILITY_COLLECTION = "availabilities";


export async function addAvailabilityToInterviewer(
    timeslot: string,
) {
    const availabilityRefInInterviewer = await doc(
        db,
        DB_COLLECTION,
        timeslot,
        AVAILABILITY_COLLECTION,
    );

    await setDoc(availabilityRefInInterviewer, { timeslot });
}

export async function getAvailabilityFromInterviewer(
    interviewerUID: string,
) {
    const interviewerRefInOrganization = await doc(
        db,
        DB_COLLECTION,
        interviewerUID,
        AVAILABILITY_COLLECTION
    );

    const res = await getDoc(interviewerRefInOrganization);
    return res.data();
}
