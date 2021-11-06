import express from "express";
import {
  addAvailability,
  getAvailability,
  AddAvailabilityBody,
  GetAvailabilityBody,
  AddMultipleAvailablitiesBody,
  addAvailabilities,
} from "../controllers/availabilityController";

export const availabilityRouter = express.Router();

availabilityRouter.post("/single", async (req, res) => {
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

availabilityRouter.post("/multiple", async (req, res) => {
  try {
    const body: AddMultipleAvailablitiesBody = {
      eventsAPI: req.body.eventsAPI,
      interviewerUID: req.body.interviewerUID,
      organization: req.body.organization,
    };
    if (!Object.values(body).every((field) => field != null))
      throw new Error(`Incomplete Request Body: ${JSON.stringify(body)}`);
    await addAvailabilities(body);
    res.send(
      `${body.eventsAPI.length} timeslots have been added to ${body.interviewerUID}'s availabilities`
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
