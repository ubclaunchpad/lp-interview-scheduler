export interface Interviewer {
  organization: string;
  userUID: string;
  email: string;
  name: string;
}

export interface Availability {
<<<<<<< HEAD
  interviewerUID: string,
  startTime: string,
  isBooked: boolean,
  bookedByEmail: string,
=======
  organization: string,
  interviewerUID: string,
  startTimeString: string,
  startTime: Date,
  isBooked: boolean,
>>>>>>> 4a04111396fa8877055dda5fbcbf3c25d1963f77
  durationMins: number,
}
