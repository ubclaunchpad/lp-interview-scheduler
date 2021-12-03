import express from "express";
import {
  addEvent,
  AddEventBody,
  getEvent,
  GetEventBody,
  bookEvent,
  BookEventBody,
  getBookingCount
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
    res.json(ret);
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
    res.json(eventData);
  } catch (err) {
    res.status(500).send(`error processing request: ${err}`);
  }
});

eventRouter.get("/bookingCount/", async (req, res) => {
  try {
    const organization: string = req.query.organization as string;
    if (organization == null) throw new Error(`No organization provided`);
    const bookingCount = await getBookingCount(organization);
    res.json(bookingCount);
  } catch (err) {
    res.status(500).send(`error processing request: ${err}`);
  }
});

eventRouter.patch("/", async (req, res) => {
  try {
    const body: BookEventBody = {
      organization: req.body.organization as string,
      eventUID: req.body.eventUID as string,
      leadUIDs: req.body.leadUIDs as string[],
      times: req.body.times as string[],
    };
    if (!Object.values(body).every((field) => field != null))
      throw new Error(`Incomplete Request Body:  ${JSON.stringify(body)}`);
    const booked = await bookEvent(
      body.organization,
      body.eventUID,
      body.leadUIDs,
      body.times
    );
    res.send(booked);
  } catch (err) {
    res.status(500).send(`error processing request: ${err}`);
  }
});
