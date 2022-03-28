import * as Database from "../data/database";
import { Interviewer } from "../data/models";

export interface GetInterviewerParams {
  interviewerUID: string;
  organization: string;
}

export async function addInterviewer(
  organization: string,
  interviewerUID: string,
  email: string,
  name: string
) {
  const interviewer: Interviewer = {
    organization,
    interviewerUID,
    email,
    name,
  };

  await Database.setInterviewer(interviewer);
}

export async function getInterviewer(
  organization: string,
  interviewerUID: string
) {
  return Database.getInterviewer(interviewerUID);
}

export async function getAllInterviewers(
  organization: string
): Promise<Interviewer[]> {
  return Database.listInterviewers(organization);
}
