import express from "express";
import {addAvailability, getAvailability} from "../controllers/availabilityController";

export const interviewerRouter = express.Router();

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

interviewerRouter.post("/addAvailability", async (req, res) => {
    const { organization, interviewerUID, startTimeString, startTime, isBooked, durationMins }: addAvailabilityBody = req.body;
    try {
        await addAvailability(organization, interviewerUID, startTimeString, startTime, isBooked, durationMins);
        res.send(`A timeslot at ${startTime} has been added to interviewer ${interviewerUID}'s availability`);
    } catch (err) {
        res.send(`error processing request: ${err}`);
    }
});

interviewerRouter.get("/getAvailability", async (req, res) => {
    const { organization, interviewerUID, startTimeString }: getAvailabilityBody = req.body;
    try {
        const interviewerData = await getAvailability(organization, interviewerUID,startTimeString);
        res.send(interviewerData);
    } catch (err) {
        res.send(`error processing request: ${err}`);
    }
});
