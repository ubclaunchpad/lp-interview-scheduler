import React from "react";
import { Calendar, DateLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../App.css";
import { useAuth } from "../contexts/AuthContext";
import { formatISO } from "date-fns";

// Setup the localizer by providing the moment (or globalize) Object
// to the correct localizer.

interface Props {
  localizer: DateLocalizer;
}

interface CalendarEvent {
  interviewerUID: string | undefined;
  start: Date; // Date.toISOString()
  end: Date;
}

interface EventAPI {
  interviewerUID: string | undefined;
  start: string;
  end: string;
}

export default function InterviewerCalendar({ localizer }: Props) {
  const [events, setEvents] = React.useState([] as CalendarEvent[]);
  const [eventsAPI, setEventsAPI] = React.useState([] as EventAPI[]);
  const { user } = useAuth();
  const interviewerUID = user?.uid;

  const handleSelect = ({
    start,
    end,
  }: {
    // component passes in Dates
    start: string | Date;
    end: string | Date;
  }): any => {
    let newEvent = {} as CalendarEvent;
    newEvent.interviewerUID = interviewerUID;
    newEvent.start = moment(start).toDate();
    newEvent.end = moment(end).toDate();

    setEvents([...events, newEvent]);

    let newEventAPI = {} as EventAPI;
    newEventAPI.interviewerUID = newEvent.interviewerUID;
    newEventAPI.start = formatISO(newEvent.start);
    newEventAPI.end = formatISO(newEvent.end);

    setEventsAPI([...eventsAPI, newEventAPI]);
  };

  const handleClick = async (
    e: React.MouseEvent<HTMLButtonElement>,
    eventsToSave: CalendarEvent[]
  ): Promise<void> => {
    e.preventDefault();

    console.log(JSON.stringify({ eventsAPI, interviewerUID }));

    const submitCalendarEvents = {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ eventsAPI, interviewerUID }),
    };

    const response = await fetch("/", submitCalendarEvents);
    const data = await response.json();
    console.log(data);

    alert("events saved yay!");
  };

  return (
    <>
      <div>
        <Calendar
          selectable={true}
          localizer={localizer}
          events={events}
          defaultView="week"
          defaultDate={moment().toDate()}
          onSelectEvent={(event) => alert(event.start)}
          onSelectSlot={(slotInfo) => handleSelect(slotInfo)}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 700 }}
          min={new Date(2020, 11, 3, 7, 0, 0, 0)}
          max={new Date(2020, 11, 3, 19, 0, 0, 0)}
        />
      </div>
      <div>
        <button onClick={(e) => handleClick(e, events)}>Save Changes</button>
      </div>
    </>
  );
}
