export default class Timeslot {
    public readonly startTime: Date;
    public readonly duration: number;
    public readonly isBooked: boolean;
    public readonly interviewee: string;

    constructor(startTime: Date, duration: number, isBooked: boolean, interviewee: string) {
        this.startTime = startTime;
        this.duration = duration;
        this.isBooked = isBooked;
        this.interviewee = interviewee;
    }
}