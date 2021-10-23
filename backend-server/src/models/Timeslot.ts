export default class Timeslot {
    public readonly startTime: Date;
    public readonly duration: number;
    public readonly isBooked: boolean;
    public readonly email: string;

    constructor(startTime: Date, duration: number, isBooked: boolean, email: string) {
        this.startTime = startTime;
        this.duration = duration;
        this.isBooked = isBooked;
        this.email = email;
    }
}