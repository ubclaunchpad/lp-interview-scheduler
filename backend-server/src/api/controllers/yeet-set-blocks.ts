import {Availability} from "../data/models"
function findOverlapping(availabilities1: Availability[], availabilities2: Availability[]) {

    const output: Availability[] = [];

    availabilities1.forEach(timeSlot => {
        let commonTime: Availability = availabilities2.find(element => element.startTime == timeSlot.startTime);
        if (commonTime) {
            output.push(commonTime);
        } 
    });
    
    return output;
}

if (require.main === module) {
    console.log("...running");
    const availability1: Availability[] = [
        {
            interviewerUID: "", 
            startTime: "2021-11-20T10:00:00-08:00", 
            isBooked: false,
            bookedByEmail: "",
            durationMins: 30
        },
        {
            interviewerUID: "", 
            startTime: "2021-11-20T13:00:00-08:00", 
            isBooked: false,
            bookedByEmail: "",
            durationMins: 30
        }
    ]
    const availability2: Availability[] = [
        {
            interviewerUID: "", 
            startTime: "2021-11-20T10:00:00-08:00", 
            isBooked: false,
            bookedByEmail: "",
            durationMins: 30
        },
        {
            interviewerUID: "", 
            startTime: "2021-11-20T10:30:00-08:00", 
            isBooked: false,
            bookedByEmail: "",
            durationMins: 30
        },
        {
            interviewerUID: "", 
            startTime: "2021-11-20T11:00:00-08:00", 
            isBooked: false,
            bookedByEmail: "",
            durationMins: 30
        },
        {
            interviewerUID: "", 
            startTime: "2021-11-20T13:00:00-08:00", 
            isBooked: false,
            bookedByEmail: "",
            durationMins: 30
        }
    ]

    console.log(findOverlapping(availability1, availability2));
}