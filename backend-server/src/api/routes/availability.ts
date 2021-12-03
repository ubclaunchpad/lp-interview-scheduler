import express from "express";
import {
  addAvailability,
  AddAvailabilityBody,
  GetAvailabilityParams,
  getInterviewerAvailabilities,
  ReplaceAvailabilitiesBody,
  getInterviewerCalendarAvailabilities,
  replaceAllAvailabilities,
  GetMergedRoutesParams,
  makeMultipleCalendarAvailabilities,
} from "../controllers/availabilityController";
import { findOverlapping } from "../controllers/mergeController";
import { Availability, CalendarAvailability } from "../data/models";

export const availabilityRouter = express.Router();

availabilityRouter.post("/", async (req, res) => {
  const body: AddAvailabilityBody = {
    organization: req.body.organization,
    interviewerUID: req.body.interviewerUID,
    startTime: req.body.startTime,
    isBooked: req.body.isBooked,
    bookedByEmail: req.body.bookedByEmail,
    durationMins: req.body.durationMins,
  };

  try {
    if (!Object.values(body).every((field) => field != null))
      throw new Error(`Incomplete Request Body: ${JSON.stringify(body)}`);

    await addAvailability(body);
    res.send(
      `"A timeslot at ${body.startTime} has been added to interviewer ${body.interviewerUID}'s availability"`
    );
  } catch (err) {
    res.status(500).send(`error processing request: ${err}`);
  }
});

availabilityRouter.put("/", async (req, res) => {
  const body: ReplaceAvailabilitiesBody = {
    eventsAPI: req.body.eventsAPI,
    interviewerUID: req.body.interviewerUID,
    organization: req.body.organization,
  };

  try {
    if (!Object.values(body).every((field) => field != null))
      throw new Error(`Incomplete Request Body: ${JSON.stringify(body)}`);

    const createdAvailabilities = await replaceAllAvailabilities(body);
    res.send(
      `${createdAvailabilities.length} timeslots have been added to ${body.interviewerUID}'s availabilities`
    );
  } catch (err) {
    res.status(500).send(`error processing request: ${err}`);
  }
});

availabilityRouter.get("/", async (req, res) => {
  const organization = req.query.organization as string;
  const interviewerUID = req.query.interviewerUID as string;
  const body: GetAvailabilityParams = { organization, interviewerUID };

  try {
    if (!Object.values(body).every((field) => field != null))
      throw new Error(`Incomplete Request Body: ${JSON.stringify(body)}`);

    const availabilityData = await getInterviewerAvailabilities(
      organization,
      interviewerUID
    );
    res.json(availabilityData);
  } catch (err) {
    res.send(`error processing request: ${err}`);
  }
});

availabilityRouter.get("/calendarAvailabilities", async (req, res) => {
  const organization = req.query.organization as string;
  const interviewerUID = req.query.interviewerUID as string;
  const body: GetAvailabilityParams = { organization, interviewerUID };

  try {
    if (!Object.values(body).every((field) => field != null))
      throw new Error(`Incomplete Request Body: ${JSON.stringify(body)}`);

    const calendarAvailabilitiesData =
      await getInterviewerCalendarAvailabilities(organization, interviewerUID);
    res.json(calendarAvailabilitiesData);
  } catch (err) {
    res.send(`error processing request: ${err}`);
  }
});

availabilityRouter.get("/mergedTimes", async (req, res) => {
  const body: GetMergedRoutesParams = {
    organization: req.query.organization as string,
    interviewerUID1: req.query.interviewerUID1 as string,
    interviewerUID2: req.query.interviewerUID2 as string,
  };

  try {
    if (!Object.values(body).every((field) => field != null))
      throw new Error(`Incomplete Request Body: ${JSON.stringify(body)}`);

    const allAvailabilities1 = (await getInterviewerAvailabilities(
      body.organization,
      body.interviewerUID1
    )) as Availability[];

    const allAvailabilities2 = (await getInterviewerAvailabilities(
      body.organization,
      body.interviewerUID2
    )) as Availability[];

    const merged = findOverlapping(allAvailabilities1, allAvailabilities2);

    if (!req.query.inCalendarAvailability || req.query.inCalendarAvailability as string === "false") {
      res.json(merged);
    } else if (req.query.inCalendarAvailability as string === "true") {
      const mergedCalendar: CalendarAvailability[] = await makeMultipleCalendarAvailabilities(merged, body.organization);
      res.json(mergedCalendar);
    } else {
      throw new Error(`Incompatible Query Key: inCalendarAvailability=${req.query.inCalendarAvailability}`);
    }
  } catch (err) {
    res.send(`error processing request: ${err}`);
  }
});
