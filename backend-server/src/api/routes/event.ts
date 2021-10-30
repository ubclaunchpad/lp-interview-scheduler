import { Timestamp } from "@firebase/firestore";
import express from "express";
import { report } from "process";
import {
  addEvent, bookEvent, getEvent,
} from "../controllers/eventController";
import { EventRequest } from "../data/models";

export const eventRouter = express.Router();

const get_uri: string = "localhost:8080/v1/event/";

eventRouter.post("/", async (req, res) => {
  const { organization, lead1, lead2, intervieweeEmail, length, expires}: EventRequest = req.body;
  try {
    const event = await addEvent(organization, lead1, lead2, intervieweeEmail, length, expires);
    const ret: any = {
      link: `${get_uri}?organization=${event.organization}&eventUID=${event.eventUID}`,
      event: event
    }
    res.send(JSON.stringify(ret));
  } catch (err) {
    res.send(`error processing request: ${err}`);
  }
});

eventRouter.get('/', async (req, res) => {
  // const { organization, eventUID } = req.body;
  let organization:any= req.query.organization;
  let eventUID:any = req.query.eventUID;

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