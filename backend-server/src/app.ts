import express, { Request, Response, NextFunction } from 'express';
import * as dotenv from "dotenv";

dotenv.config();
const app = express();
const port = process.env.PORTNUM;

app.listen(port, () => {
  console.log(`Running on PORT ${port}!`);
});

const handler = (request: Request, response: Response, next: NextFunction) => {
  response.status(200).send('Hello World!');
}

app.get('/', handler);