import { Timestamp } from "@firebase/firestore";
import express from "express";
import {
  addEvent,
} from "../controllers/eventController";

export const eventRouter = express.Router();

interface addEventBody {
    organization: string,
    lead1: string,
    lead2: string,
    intervieweeEmail: string,
    length: number,
    expires: string
}

eventRouter.post("/add", async (req, res) => {
  const { organization, lead1, lead2, intervieweeEmail, length, expires}: addEventBody = req.body;
  try {
    await addEvent(organization, lead1, lead2, intervieweeEmail, length, expires);
    res.send(`${intervieweeEmail}'s interview with ${lead1} and ${lead2} has been added to ${organization}`);
  } catch (err) {
    res.send(`Error adding event: ${err}`);
  }
});
