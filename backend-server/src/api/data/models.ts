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

export interface CalendarAvailability {
  interviewerUID: string | undefined;
  start: string;
  end: string;
  isBooked: boolean;
  bookedByEmail: string;
}

export interface Event {
  leads: Array<{ leadUID: string; name: string }>;
  intervieweeEmail: string;
  confirmedTime: string;
  eventLengthInMinutes: number;
  expires: string;
  eventUID: string;
}
