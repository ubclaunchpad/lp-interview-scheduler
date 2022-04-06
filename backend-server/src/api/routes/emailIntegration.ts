import express from "express";
import {
  sendEmail,
  sendEmailBody,
} from "./../controllers/emailIntegrationController";

export const emailRouter = express.Router();

emailRouter.post("/", async (req, res) => {
  const body: sendEmailBody = {
    recipientEmail: req.body.recipientEmail,
    message: req.body.message,
    subject: req.body.subject,
  };

  try {
    if (!Object.values(body).every((field) => field != null))
      throw new Error(`Incomplete Request Body: ${JSON.stringify(body)}`);

    await sendEmail(body);
    res.send("Email successfully sent.");
  } catch (err) {
    res.status(500).send(`error processing request: ${err}`);
  }
});
