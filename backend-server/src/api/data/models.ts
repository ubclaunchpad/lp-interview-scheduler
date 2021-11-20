export interface Interviewer {
  organization: string;
  interviewerUID: string;
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

export interface CalendarAvailablity {
  interviewerUID: string | undefined;
  start: string;
  end: string;
}

export interface Event {
  leads: Array<{ leadUID: string; name: string }>;
  intervieweeEmail: string;
  confirmedTime: string;
  length: number;
  expires: string;
  eventUID: string;
}
