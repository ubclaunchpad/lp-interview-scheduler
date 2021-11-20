import express from "express";
import {
  addEvent,
  AddEventBody,
  getEvent,
  GetEventBody,
} from "../controllers/eventController";

export const eventRouter = express.Router();

eventRouter.post("/", async (req, res) => {
  try {
    const body: AddEventBody = {
      organization: req.body.organization,
      leads: req.body.leads,
      intervieweeEmail: req.body.intervieweeEmail,
      length: req.body.length,
      expires: req.body.expires,
    };
    if (!Object.values(body).every((field) => field != null))
      throw new Error(`Incomplete Request Body:  ${JSON.stringify(body)}`);
    const ret = await addEvent(body);
    res.send(ret);
  } catch (err) {
    res.status(500).send(`error processing request: ${err}`);
  }
});

eventRouter.get("/", async (req, res) => {
  try {
    const body: GetEventBody = {
      organization: req.query.organization as string,
      eventUID: req.query.eventUID as string,
    };
    if (!Object.values(body).every((field) => field != null))
      throw new Error(`Incomplete Request Body:  ${JSON.stringify(body)}`);
    const eventData = await getEvent(body.organization, body.eventUID);
    res.send(eventData);
  } catch (err) {
    res.status(500).send(`error processing request: ${err}`);
  }
});
