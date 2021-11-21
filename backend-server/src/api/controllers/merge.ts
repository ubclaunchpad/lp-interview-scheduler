import { Availability } from "../data/models";

export function findOverlapping(availabilities1: Availability[], availabilities2: Availability[]) {

    const output: Availability[] = [];

    availabilities1.forEach(timeSlot => {
        let commonTime: Availability = availabilities2.find(element => element.startTime == timeSlot.startTime);
        if (commonTime) {
            output.push(commonTime);
        }
    });
    
    return output;
}