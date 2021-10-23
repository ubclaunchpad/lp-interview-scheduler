import express from "express";
import {
  addInterviewer,
  getInterviewer,
} from "../controllers/interviewerController";
import { Interviewer } from "../data/models";

export const interviewerRouter = express.Router();

interviewerRouter.post("/", async (req, res) => {
  const { organization, userUID, email, name }: Interviewer = req.body;
  try {
    await addInterviewer(organization, userUID, email, name);
    res.send(`${userUID} has been added to ${organization}`);
  } catch (err) {
    res.send(`error processing request: ${err}`);
  }
});

interviewerRouter.get("/", async (req, res) => {
  const organization = req.query.organization as string;
  const userUID = req.query.userUID as string;
  try {
    const interviewerData = await getInterviewer(organization, userUID);
    res.send(interviewerData);
  } catch (err) {
    res.send(`error processing request: ${err}`);
  }
});
