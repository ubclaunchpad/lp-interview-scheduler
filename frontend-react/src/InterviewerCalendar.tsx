import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.
const localizer = momentLocalizer(moment); // or globalizeLocalizer

const myEventsList = [
  {
    id: 0,
    title: "Meeting",
    start: new Date(2020, 10, 29, 20, 0, 0, 0),
    end: new Date(2020, 10, 21, 0, 0, 0),
  },
];

export default function InterviewerCalendar() {
  return (
    <div style={{ height: 700 }}>
      <Calendar
        selectable
        localizer={localizer}
        events={myEventsList}
        defaultView="week"
        defaultDate={moment().toDate()}
        // components={{ timeSlotWrapper: ColoredDateCellWrapper }}
      />
    </div>
  );
}
