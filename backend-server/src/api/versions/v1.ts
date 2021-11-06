import express from "express";

import { availabilityRouter } from "../routes/availability";
import { eventRouter } from "../routes/event";
import { interviewerRouter } from "../routes/interviewer";

export const v1Router = express.Router();

v1Router.use("/interviewer", interviewerRouter);
v1Router.use("/availability", availabilityRouter);
v1Router.use("/event", eventRouter);

