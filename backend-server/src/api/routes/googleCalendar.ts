import express from "express";
import {
  CreateCalendarEventBody,
  createGoogleCalendarEvent,
} from "../controllers/googleCalendarController";

export const calendarRouter = express.Router();

calendarRouter.post("/", async (req, res) => {
  try {
    const body: CreateCalendarEventBody = {
      organization: req.body.organization,
      startTime: req.body.startTime,
      endTime: req.body.endTime,
      intervieweeEmail: req.body.intervieweeEmail,
      interviewerUUIDs: req.body.interviewerUUIDs,
    };
    if (!Object.values(body).every((field) => field != null))
      throw new Error(`Incomplete Request Body:  ${JSON.stringify(body)}`);
    const ret = await createGoogleCalendarEvent(body);
    res.json(ret);
  } catch (err) {
    res.status(500).send(`error processing request: ${err}`);
  }
});
