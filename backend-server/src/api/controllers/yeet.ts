import {CalendarAvailability} from "../data/models"
function findOverlapping(availabilities1: CalendarAvailability[], availabilities2: CalendarAvailability[]) {
    // where availabilities1 and availabilities2 are the sorted, continuous time interval arrays representing the interviewers availabilities
    // e.g. availabilities1 = [[10, 11], [11:30, 12:30], [1:00, 4:00]] where each subarray is an object

    let idx1 = 0;
    let idx2 = 0;

    let currAvailability: CalendarAvailability | null  = null;
    let prevAvailability: CalendarAvailability | null = null;

    const output: CalendarAvailability[] = [];

    while (idx1 < availabilities1.length && idx2 < availabilities2.length) {
        if (availabilities1[idx1].start < availabilities2[idx2].start) {
            currAvailability = availabilities1[idx1];
            idx1++;
        } else {
            currAvailability = availabilities2[idx2];
            idx2++;
        }

        if (prevAvailability != null) {
            if (currAvailability.start < prevAvailability.end) {
                let startTime = currAvailability.start;
                let endTime = currAvailability.end < prevAvailability.end ? currAvailability.end : prevAvailability.end;
                let newAvailability: CalendarAvailability = {interviewerUID: "", start: startTime, end: endTime}
                // console.log(newAvailability);
                output.push(newAvailability);


                if (currAvailability.start < prevAvailability.end) {
                    prevAvailability = {interviewerUID: "", start: currAvailability.end, end: prevAvailability.end}
                } else {
                    prevAvailability = currAvailability;
                }
            }
        } else {
            prevAvailability = currAvailability;
        }
    }
    return output;
}

if (require.main === module) {
    console.log("...running");
    const availability1: CalendarAvailability[] = [
        {interviewerUID: "", start: "2021-11-20T10:00:00-08:00", end: "2021-11-20T12:00:00-08:00"},
        {interviewerUID: "", start: "2021-11-20T13:00:00-08:00", end: "2021-11-20T14:00:00-08:00"},
    ]
    const availability2: CalendarAvailability[] = [
        {interviewerUID: "", start: "2021-11-20T10:15:00-08:00", end: "2021-11-20T10:45:00-08:00"},
        {interviewerUID: "", start: "2021-11-20T11:00:00-08:00", end: "2021-11-20T11:30:00-08:00"},
    ]

    console.log(findOverlapping(availability1, availability2));
}