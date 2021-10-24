export interface Interviewer {
  organization: string;
  userUID: string;
  email: string;
  name: string;
}

export interface Availability {
  organization: string,
  interviewerUID: string,
  startTimeString: string,
  startTime: Date,
  isBooked: boolean,
  durationMins: number,
}
