import express from "express";
import { interviewerRouter } from "../routes/interviewer";

export const v1Router = express.Router();

v1Router.use("/interviewer", interviewerRouter);
