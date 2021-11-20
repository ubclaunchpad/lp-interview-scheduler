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
  leads: Array<{ leadUID: string; name: string }>;
  intervieweeEmail: string;
  confirmedStartTime: string;
  eventLengthInMinutes: number;
  expires: string;
  eventUID: string;
}
