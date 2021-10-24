import express from "express";
import {
    addAvailability,
    getAvailability
} from "../controllers/availabilityController";
import { Availability } from "../data/models";


export const availabilityRouter = express.Router();

interface addAvailabilityBody {
    organization: string;
    interviewerUID: string;
    startTimeString: string;
    startTime: Date;
    isBooked: boolean;
    durationMins: number;
}
interface getAvailabilityBody {
    organization: string;
    interviewerUID: string;
    startTimeString: string;
}

availabilityRouter.post("/", async (req, res) => {
    const { organization, interviewerUID, startTimeString, startTime, isBooked, durationMins }: Availability = req.body;
    try {
        await addAvailability(organization, interviewerUID, startTimeString, startTime, isBooked, durationMins);
        res.send(`A timeslot at ${startTime} has been added to interviewer ${interviewerUID}'s availability`);
    } catch (err) {
        res.send(`error processing request: ${err}`);
    }
});

availabilityRouter.get("/", async (req, res) => {
    const organization = req.query.organization as string;
    const interviewerUID = req.query.interviewerUID as string;
    const startTimeString = req.query.startTimeString as string;
    try {
        const availabilityData = await getAvailability(organization, interviewerUID,startTimeString);
        res.send(availabilityData);
    } catch (err) {
        res.send(`error processing request: ${err}`);
    }
});