import express from "express";
import { availabilityRouter } from "../routes/availability";
import { interviewerRouter } from "../routes/interviewer";

export const v1Router = express.Router();

v1Router.use("/interviewers", interviewerRouter);
v1Router.use("/availabilities", availabilityRouter);
