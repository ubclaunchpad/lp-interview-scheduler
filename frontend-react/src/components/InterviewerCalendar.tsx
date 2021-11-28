import React from "react";
import { Calendar, DateLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../App.css";
import { useAuth } from "../contexts/AuthContext";
import { formatISO } from "date-fns";

interface Props {
  localizer: DateLocalizer;
}

interface CalendarEvent {
  interviewerUID: string | undefined;
  start: Date;
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
  const organization = "launchpad";

  const handleSelect = ({
    start,
    end,
  }: {
    // component passes in Dates
    start: string | Date;
    end: string | Date;
  }): any => {
    // option to delete when event timeslot is clicked / selected
    const shouldDelete = window.confirm("Would you like to remove this event?");
    if (shouldDelete === true) {
      setEvents(events.filter((event) => event.start !== start));
      setEventsAPI(
        eventsAPI.filter((event) => event.start !== formatISO(new Date(start)))
      );
    }
  };

  // called when user drags through calendar to create new timeslots
  const handleCreate = ({
    start,
    end,
  }: {
    // component passes in Dates
    start: string | Date;
    end: string | Date;
  }): any => {
    // create new CalendarEvent and add to events state
    let newEvent = {} as CalendarEvent;
    newEvent.interviewerUID = interviewerUID;
    newEvent.start = moment(start).toDate();
    newEvent.end = moment(end).toDate();

    setEvents([...events, newEvent]);

    // create new EventAPI and add to eventsAPI state
    let newEventAPI = {} as EventAPI;
    newEventAPI.interviewerUID = newEvent.interviewerUID;
    newEventAPI.start = formatISO(newEvent.start);
    newEventAPI.end = formatISO(newEvent.end);

    setEventsAPI([...eventsAPI, newEventAPI]);
  };

  // submit created events to be saved
  const handleClick = async (
    e: React.MouseEvent<HTMLButtonElement>,
    eventsToSave: CalendarEvent[]
  ): Promise<void> => {
    e.preventDefault();

    const submitCalendarEvents = {
      method: "PUT",
      mode: "cors" as RequestMode,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        eventsAPI: eventsAPI,
        interviewerUID: interviewerUID,
        organization: organization,
      }),
    };

    console.log(submitCalendarEvents);

    const response = await fetch(
      "http://localhost:8080/v1/availabilities/",
      submitCalendarEvents
    );
    console.log(response);
    try {
      const data = await response.json();
      console.log("data");
      console.log(data);
    } catch (err) {
      console.log(err);
      console.log("response causing error");
      console.log(response);
    }

    alert(JSON.stringify(eventsAPI));
  };

  // converts eventsAPI received from GET request to renderable CalendarEvents
  const convertToCalendar = (eventsFromAPI: EventAPI[]) => {
    eventsFromAPI.forEach(function (event) {
      let storedEvent = {} as CalendarEvent;
      storedEvent.interviewerUID = event.interviewerUID;
      storedEvent.start = new Date(event.start);
      storedEvent.end = new Date(event.end);

      setEvents([...events, storedEvent]);
    });
  };

  // we should refactor this, getting linter error right now about
  // exhaustive dependencies
  React.useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `http://localhost:8080/v1/availabilities/calendarAvailabilities?organization=${organization}&interviewerUID=${interviewerUID}`
        );
        const data = await response.json();
        console.log(data);

        // convert data (EventAPI[]) into CalendarEvent[]
        convertToCalendar(data);

        setEventsAPI(data);
      } catch (e) {
        setError(true);
      }
    }
    fetchData();
  }, []);

  return (
    <>
      {error ? (
        <div>Error occured.</div>
      ) : (
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
            <button onClick={(e) => handleClick(e, events)}>
              Save Changes
            </button>
          </div>
        </>
      )}
    </>
  );
}
