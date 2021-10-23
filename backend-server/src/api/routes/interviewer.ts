import express from "express";
import {
  addInterviewer,
  getInterviewer,
} from "../controllers/interviewerController";
import {addAvailability, getAvailability} from "../controllers/availabilityController";

export const interviewerRouter = express.Router();

interface addInterviewerBody {
  organization: string;
  userUID: string;
  email: string;
  name: string;
}
interface getInterviewerBody {
  organization: string;
  userUID: string;
}

interface addAvailabilityBody {
  organization: string;
  interviewerUID: string;
  startTimeString: string;
  startTime: Date; // TODO: no two availabilities can have the same start time
  isBooked: boolean;
  durationMins: number;
}
interface getAvailabilityBody {
  organization: string;
  interviewerUID: string;
  startTimeString: string;
}

interviewerRouter.post("/add", async (req, res) => {
  const { organization, userUID, email, name }: addInterviewerBody = req.body;
  try {
    await addInterviewer(organization, userUID, email, name);
    res.send(`${userUID} has been added to ${organization}`);
  } catch (err) {
    res.send(`error processing request: ${err}`);
  }
});

interviewerRouter.get("/get", async (req, res) => {
  const { organization, userUID }: getInterviewerBody = req.body;
  try {
    const interviewerData = await getInterviewer(organization, userUID);
    res.send(interviewerData);
  } catch (err) {
    res.send(`error processing request: ${err}`);
  }
});

interviewerRouter.post("/addAvailability", async (req, res) => {
  const { organization, interviewerUID, startTimeString, startTime, isBooked, durationMins }: addAvailabilityBody = req.body;
  try {
    await addAvailability(organization, interviewerUID, startTimeString, startTime, isBooked, durationMins);
    res.send(`A timeslot at ${startTime} has been added to interviewer ${interviewerUID}'s availability`);
  } catch (err) {
    res.send(`error processing request: ${err}`);
  }
});

interviewerRouter.get("/getAvailability", async (req, res) => {
  const { organization, interviewerUID, startTimeString }: getAvailabilityBody = req.body;
  try {
    const interviewerData = await getAvailability(organization, interviewerUID,startTimeString);
    res.send(interviewerData);
  } catch (err) {
    res.send(`error processing request: ${err}`);
  }
});