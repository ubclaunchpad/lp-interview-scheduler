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
  const [error, setError] = React.useState(false);
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
    const shouldDelete = window.confirm("Would you like to remove this event?");
    if (shouldDelete === true) {
      setEvents(events.filter((event) => event.start !== start));
      setEventsAPI(
        eventsAPI.filter((event) => event.start !== formatISO(new Date(start)))
      );
    }
  };

  const handleCreate = ({
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
      mode: "cors" as RequestMode,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventsAPI,
        interviewerUID,
        organization: "launchpad",
      }),
    };

    const response = await fetch(
      "http://localhost:8080/v1/availability/multiple",
      submitCalendarEvents
    );
    const data = await response.json();
    console.log(data);

    alert("events saved yay!");
  };

  const convertToCalendar = (event: EventAPI): CalendarEvent => {
    let storedEvent = {} as CalendarEvent;
    storedEvent.interviewerUID = event.interviewerUID;
    storedEvent.start = new Date(event.start);
    storedEvent.end = new Date(event.end);

    return storedEvent;
  };

  React.useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch("http://localhost:8080/v1/availability/");
        const data = await response.json();
        // console.log(data);

        // convert Data into CalendarEvent before set state
        const storedEvents = data.map((event: EventAPI) =>
          convertToCalendar(event)
        );
        setEvents(storedEvents);
        setEventsAPI(data);
      } catch (e) {
        setError(true);
      }
    }
    fetchData();
  }, []);

  return (
    <>
      {/* {error ? (
        <div>Error occured.</div>
      ) : ( */}
      <>
        <Calendar
          selectable
          localizer={localizer}
          events={events}
          defaultView="week"
          defaultDate={moment().toDate()}
          onSelectEvent={(event) => handleSelect(event)}
          onSelectSlot={(slotInfo) => handleCreate(slotInfo)}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 700 }}
          min={new Date(2021, 11, 11, 7, 0)}
          max={new Date(2021, 11, 11, 21, 0)}
          // uncomment this for custom rendering of events
          // components={{
          //   event: existingEvents,
          // }}
        />
        <div>
          <button onClick={(e) => handleClick(e, events)}>Save Changes</button>
        </div>
      </>
      {/* )} */}
    </>
  );
}
