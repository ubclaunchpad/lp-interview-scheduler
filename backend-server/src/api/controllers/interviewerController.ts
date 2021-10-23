import {
  addInterviewerToOrganization,
  getInterviewerFromOrganizationByID,
} from "../data/addEntity";

export async function addInterviewer(
  organization: string,
  userUID: string,
  email: string,
  name: string
) {
  await addInterviewerToOrganization(organization, userUID, email, name);
}

export async function getInterviewer(organization: string, userUID: string) {
  return await getInterviewerFromOrganizationByID(organization, userUID);
}
