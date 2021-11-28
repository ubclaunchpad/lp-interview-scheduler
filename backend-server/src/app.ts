import express from "express";
import * as dotenv from "dotenv";
import { v1Router } from "./api/versions/v1";
import cors from "cors";

dotenv.config();
export const app = express();
app.use(express.json());
app.use(cors());

const port = process.env.PORTNUM || 8080;
app.listen(port, () => {
  console.log(`Running on PORT ${port}!`);
});

app.get("/", (req, res) => res.status(200).send("hello world!"));
app.get("/ping", (req, res) => res.status(200).send("pong"));

app.use("/v1", v1Router);
