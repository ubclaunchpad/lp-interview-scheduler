import express from "express";
import {
  addAvailability,
  getAvailability,
  AddAvailabilityBody,
  GetAvailabilityBody,
  getAllAvailabilities
} from "../controllers/availabilityController";
import { Availability } from "../data/models";

export const availabilityRouter = express.Router();

availabilityRouter.post("/", async (req, res) => {
  try {
    const body: AddAvailabilityBody = {
      organization: req.body.organization,
      interviewerUID: req.body.interviewerUID,
      startTime: req.body.startTime,
      isBooked: req.body.isBooked,
      bookedByEmail: req.body.bookedByEmail,
      durationMins: req.body.durationMins,
    };
    if (!Object.values(body).every((field) => field != null))
      throw new Error(`Incomplete Request Body: ${JSON.stringify(body)}`);
    await addAvailability(body);
    res.send(
      `A timeslot at ${body.startTime} has been added to interviewer ${body.interviewerUID}'s availability`
    );
  } catch (err) {
    res.status(500).send(`error processing request: ${err}`);
  }
});

availabilityRouter.get("/", async (req, res) => {
  try {
    const body: GetAvailabilityBody = {
      organization: req.query.organization as string,
      interviewerUID: req.query.interviewerUID as string,
      startTime: req.query.startTime as string,
    };
    if (!Object.values(body).every((field) => field != null))
      throw new Error(`Incomplete Request Body: ${JSON.stringify(body)}`);
    const availabilityData = await getAvailability(
      body.organization,
      body.interviewerUID,
      body.startTime
    );
    res.send(availabilityData);
  } catch (err) {
    res.status(500).send(`error processing request: ${err}`);
  }
});

availabilityRouter.get("/allAvailabilities", async (req, res) => {
    const organization = req.query.organization as string;
    const interviewerUID = req.query.interviewerUID as string;
    try {
        const availabilityData = await getAllAvailabilities(organization, interviewerUID);
        res.send(availabilityData);
    } catch (err) {
        res.send(`error processing request: ${err}`);
    }
});
