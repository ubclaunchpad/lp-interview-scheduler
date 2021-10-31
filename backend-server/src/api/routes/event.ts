import { Timestamp } from "@firebase/firestore";
import express from "express";
import { report } from "process";
import {
  addEvent, bookEvent, getEvent,
} from "../controllers/eventController";

export const eventRouter = express.Router();

eventRouter.post("/", async (req, res) => {
  const { organization, lead1, lead2, intervieweeEmail, length, expires} = req.body;
  try {
    const ret = await addEvent(organization, lead1, lead2, intervieweeEmail, length, expires);
    res.send(ret);
  } catch (err) {
    res.send(`error processing request: ${err}`);
  }
});

eventRouter.get('/', async (req, res) => {
  // const { organization, eventUID } = req.body;
  let organization:string = String(req.query.organization);
  let eventUID:string = String(req.query.eventUID);

  try {
    const eventData = await getEvent(organization, eventUID);
    res.send(eventData);
  } catch (err) {
    res.send(`error processing request: ${err}`);
  }
});

eventRouter.patch("/", async (req, res) => {
  const { organization, eventUID, requestedTime } = req.body;
  try {
    await bookEvent(organization, eventUID, requestedTime);
    res.send(`successfully booked for interview at ${requestedTime}`);
  } catch (err) {
    res.send(`error processing request: ${err}`);
  }
})