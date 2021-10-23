import express from "express";
import {
    addInterviewer,
    getInterviewer,
} from "../controllers/interviewerController";

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
