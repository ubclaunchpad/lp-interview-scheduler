import { Timestamp } from "@firebase/firestore";

export interface Interviewer {
  organization: string;
  userUID: string;
  email: string;
  name: string;
}

export interface Event {
  leads: Array<{ leadUID: string; name: string }>;
  intervieweeEmail: string;
  confirmedTime: string;
  length: number;
  expires: string;
  eventUID: string;
}
