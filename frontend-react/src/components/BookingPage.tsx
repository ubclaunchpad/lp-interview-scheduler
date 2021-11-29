import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "../App.css";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

interface CalendarEvent {
  interviewerUID: string | undefined;
  start: Date;
  end: Date;
}

export default function BookingPage() {
  const [events, setEvents] = React.useState([] as CalendarEvent[]);
  const [lead, setLead] = React.useState("" as string);

  const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    // submit selected lead
    event.preventDefault();
  };

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    // set lead state and set the chosen lead's availabilities to events
    setLead(event.target.value);
  };

  const handleSelect = ({
    start,
    end,
  }: {
    // component passes in Dates
    start: string | Date;
    end: string | Date;
  }): any => {
    console.log("start: " + start);
    console.log("end: " + end);
  };

  return (
    <>
      <h1>booking page</h1>
      <div className="dropdown-lead">
        <label>
          Choose your partner:
          <select value={lead} onChange={handleChange}>
            <option value="lead1">Lead 1</option>
            <option value="lead2">Lead 2</option>
            <option value="lead3">Lead 3</option>
            <option value="lead4">Lead 4</option>
          </select>
        </label>
      </div>
      <Calendar
        selectable
        localizer={localizer}
        events={events}
        defaultView="week"
        defaultDate={moment().toDate()}
        onSelectEvent={(event) => handleSelect(event)}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
        min={new Date(2021, 11, 11, 7, 0)}
        max={new Date(2021, 11, 11, 21, 0)}
        // uncomment this for custom rendering of events
        // components={{
        //   event: existingEvents,
        // }}
      />
      <div>
        <button onClick={(e) => handleSubmit(e)}>Create Booking Link</button>
        <input type="text" id="unique-link" name="unique-link"></input>
      </div>
    </>
  );
}
