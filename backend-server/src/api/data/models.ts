import { Timestamp } from "@firebase/firestore";

export interface Interviewer {
  organization: string;
  userUID: string;
  email: string;
  name: string;
}


export interface Availability {
  interviewerUID: string;
  startTime: string;
  isBooked: boolean;
  bookedByEmail: string;
  durationMins: number;
}

export interface Event {
  organization: string;
  lead1: string;
  lead2: string;
  intervieweeEmail: string;
  confirmedTime: string;
  length: number;
  expires: string;
  eventUID: string; 
}
