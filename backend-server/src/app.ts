import express, { Request, Response, NextFunction } from "express";
import * as dotenv from "dotenv";
import { v1Router } from "./api/versions/v1";

dotenv.config();
export const app = express();
app.use(express.json());
const port = process.env.PORTNUM || 8080;

app.listen(port, () => {
  console.log(`Running on PORT ${port}!`);
});

const handler = (request: Request, response: Response, next: NextFunction) => {
  response.status(200).send("Hello World!");
};

app.get("/", handler);
app.use("/v1", v1Router);