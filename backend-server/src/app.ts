import express from "express";
import * as dotenv from "dotenv";
import { v1Router } from "./api/versions/v1";
import cors from "cors";
import rateLimit from "express-rate-limit";
import { initModule } from "./api/controllers/googleCalendarController";

const limiter = rateLimit({
  windowMs: 60 * 1000, // 1-minute window
  max: 30, // max 30 requests per minute
  message: `Exceeded API rate limit, please check your code and try again later.`,
  onLimitReached: (req, res, options) => {
    console.log(
      `ERROR: Rate limit exceeded for request path ${req.originalUrl}`
    );
  },
});
dotenv.config();
export const app = express();
app.use(express.json());
app.use(cors());
app.use(limiter);

const port = process.env.PORTNUM || 8080;
app.listen(port, () => {
  console.log(`Running on PORT ${port}!`);
});

app.get("/", (req, res) => res.status(200).send("hello world!"));
app.get("/ping", (req, res) => res.status(200).send("pong"));

app.use("/v1", v1Router);

initModule();
