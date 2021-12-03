import { dataAccess } from "../data/dataAccess";
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

  await dataAccess.setInterviewer(interviewer);
}

export async function getInterviewer(
  organization: string,
  interviewerUID: string
) {
  return await dataAccess.getInterviewer(organization, interviewerUID);
}
