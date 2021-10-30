import express from "express";
import {
    addAvailability,
    getAvailability,
    addAvailabilityBody,
    getAvailabilityBody
} from "../controllers/availabilityController";
import { Availability } from "../data/models";


export const availabilityRouter = express.Router();

availabilityRouter.post("/", async (req, res) => {
    const addAvailabilityBody: addAvailabilityBody = req.body;
    try {
        await addAvailability(addAvailabilityBody);
        res.send(`A timeslot at ${addAvailabilityBody.startTime} has been added to interviewer ${addAvailabilityBody.interviewerUID}'s availability`);
    } catch (err) {
        res.send(`error processing request: ${err}`);
    }
});

availabilityRouter.get("/", async (req, res) => {
    const organization = req.query.organization as string;
    const interviewerUID = req.query.interviewerUID as string;
    const startTime = req.query.startTime as string;
    try {
        const availabilityData = await getAvailability(organization, interviewerUID, startTime);
        res.send(availabilityData);
    } catch (err) {
        res.send(`error processing request: ${err}`);
    }
});