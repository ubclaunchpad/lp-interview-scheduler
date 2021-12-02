import express from "express";
import {
  addInterviewer,
  getAllInterviewers,
  getInterviewer,
  GetInterviewerParams,
} from "../controllers/interviewerController";
import { Interviewer } from "../data/models";

export const interviewerRouter = express.Router();

interviewerRouter.post("/", async (req, res) => {
  const { organization, interviewerUID, email, name } = req.body;
  const body: Interviewer = { organization, interviewerUID, email, name };

  try {
    if (!Object.values(body).every((field) => field != null))
      throw new Error(`Incomplete Request Body: ${JSON.stringify(body)}`);

    await addInterviewer(organization, interviewerUID, email, name);
    res.send(`${interviewerUID} has been added to ${organization}`);
  } catch (err) {
    res.status(500).send(`Internal Server Error: ${err}`);
  }
});

interviewerRouter.get("/", async (req, res) => {
  if (!req.query.interviewerUID) {
    try {
      const organization: string = req.query.organization as string;
      res.json(await getAllInterviewers(organization));
    } catch (err) {
      res.status(500).send(`Internal Server Error: ${err}`);
    }
    return;
  }

  try {
    const body: GetInterviewerParams = {
      organization: req.query.organization as string,
      interviewerUID: req.query.interviewerUID as string,
    };
    if (!Object.values(body).every((field) => field != null))
      throw new Error(`Incomplete Request Body: ${JSON.stringify(body)}`);

    const interviewerData = await getInterviewer(
      body.organization,
      body.interviewerUID
    );
    res.json(interviewerData);
  } catch (err) {
    res.status(500).send(`Internal Server Error: ${err}`);
  }
});
