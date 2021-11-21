import express from "express";
import {
  addAvailability,
  getAvailability,
  AddAvailabilityBody,
  GetAvailabilityParams,
  getAllAvailabilities,
  ReplaceAvailabilitiesBody,
  addAvailabilities,
  getAllCalendarAvailabilities,
  replaceAllAvailabilities,
  GetMergedRoutesParams,
} from "../controllers/availabilityController";
import { findOverlapping } from "../controllers/merge";
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

availabilityRouter.put("/", async (req, res) => {
  try {
    const body: ReplaceAvailabilitiesBody = {
      eventsAPI: req.body.eventsAPI,
      interviewerUID: req.body.interviewerUID,
      organization: req.body.organization,
    };
    if (!Object.values(body).every((field) => field != null))
      throw new Error(`Incomplete Request Body: ${JSON.stringify(body)}`);
    await replaceAllAvailabilities(body);
    res.send(
      `${body.eventsAPI.length} timeslots have been added to ${body.interviewerUID}'s availabilities`
    );
  } catch (err) {
    res.status(500).send(`error processing request: ${err}`);
  }
});

availabilityRouter.get("/", async (req, res) => {
  try {
    const body: GetAvailabilityParams = {
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

availabilityRouter.get("/", async (req, res) => {
  const organization = req.query.organization as string;
  const interviewerUID = req.query.interviewerUID as string;
  try {
    const availabilityData = await getAllAvailabilities(
      organization,
      interviewerUID
    );
    res.send(availabilityData);
  } catch (err) {
    res.send(`error processing request: ${err}`);
  }
});

availabilityRouter.get("/calendarAvailabilities", async (req, res) => {
  const organization = req.query.organization as string;
  const interviewerUID = req.query.interviewerUID as string;
  try {
    const calendarAvailabilitiesData = await getAllCalendarAvailabilities(
      organization,
      interviewerUID
    );
    res.send(calendarAvailabilitiesData);
  } catch (err) {
    res.send(`error processing request: ${err}`);
  }
});

availabilityRouter.get("/mergedRoutes", async (req, res) => {
  const body: GetMergedRoutesParams = {
    organization: req.query.organization as string,
    interviewerUID1: req.query.interviewerUID1 as string,
    interviewerUID2: req.query.interviewerUID2 as string,
  };
  if (!Object.values(body).every((field) => field != null))
    throw new Error(`Incomplete Request Body: ${JSON.stringify(body)}`);
    
  try {
    const allAvailabilities1 = await getAllAvailabilities(
      body.organization,
      body.interviewerUID1
    ) as Availability[];

    const allAvailabilities2 = await getAllAvailabilities(
      body.organization,
      body.interviewerUID2
    ) as Availability[];

    const merged = findOverlapping(allAvailabilities1, allAvailabilities2);

    res.send(merged);
  } catch (err) {
    res.send(`error processing request: ${err}`);
  }
});
