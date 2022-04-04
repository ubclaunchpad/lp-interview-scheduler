import express from "express";

import { availabilityRouter } from "../routes/availability";
import { eventRouter } from "../routes/event";
import { interviewerRouter } from "../routes/interviewer";
import { emailRouter } from "../routes/emailIntegration";

export const v1Router = express.Router();

v1Router.use("/interviewers", interviewerRouter);
v1Router.use("/availabilities", availabilityRouter);
v1Router.use("/events", eventRouter);
v1Router.use("/email", emailRouter);
