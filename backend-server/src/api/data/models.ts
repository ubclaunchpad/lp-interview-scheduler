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

export interface EventAPI {
  interviewerUID: string | undefined;
  start: string;
  end: string;
}
