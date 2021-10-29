import { Timestamp } from "@firebase/firestore";
import express from "express";
import {
  addEvent, bookEvent, getEvent,
} from "../controllers/eventController";
import { EventRequest } from "../data/models";

export const eventRouter = express.Router();


eventRouter.post("/", async (req, res) => {
  const { organization, lead1, lead2, intervieweeEmail, length, expires}: EventRequest = req.body;
  try {
    await addEvent(organization, lead1, lead2, intervieweeEmail, length, expires);
    res.send(`${intervieweeEmail}'s interview with ${lead1} and ${lead2} has been added to ${organization}`);
  } catch (err) {
    res.send(`error processing request: ${err}`);
  }
});

eventRouter.get("/", async (req, res) => {
  const { organization, eventUID } = req.body;
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