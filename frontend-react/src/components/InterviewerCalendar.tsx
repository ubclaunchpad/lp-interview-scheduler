import React from "react";
import { Calendar, DateLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../App.css";
import { useAuth } from "../contexts/AuthContext";
import { endOfWeek, formatISO, startOfWeek } from "date-fns";
import { useSetBackgroundImage } from "../hooks/useSetBackground";
import ConfirmationMessage from "./ConfirmationMessage";

interface Props {
  localizer: DateLocalizer;
}

interface CalendarEvent {
  interviewerUID: string | undefined;
  start: Date;
  end: Date;
  resource: { isBooked: boolean; bookedByEmail: string };
}

interface EventAPI {
  interviewerUID: string | undefined;
  start: string;
  end: string;
  isBooked: boolean;
  bookedByEmail: string;
}

export default function InterviewerCalendar({ localizer }: Props) {
  const [events, setEvents] = React.useState([] as CalendarEvent[]);
  const [eventsAPI, setEventsAPI] = React.useState([] as EventAPI[]);
  const [error, setError] = React.useState(false);
  const [showConfirmation, setShowConfirmation] = React.useState("" as string);
  const { user } = useAuth();
  const interviewerUID = user?.uid;
  const organization = "launchpad";
  let confirmationMessage = React.useRef("");

  useSetBackgroundImage("url('/page-1.svg'");

  const handleSelect = (event: CalendarEvent): any => {
    // option to delete when event timeslot is clicked / selected
    if (!event.resource.isBooked) {
      const shouldDelete = window.confirm(
        "Would you like to remove this event?"
      );
      if (shouldDelete === true) {
        setEvents(
          events.filter((currEvent) => currEvent.start !== event.start)
        );
        setEventsAPI(
          eventsAPI.filter(
            (currEvent) => currEvent.start !== formatISO(new Date(event.start))
          )
        );
      }
    } else {
      window.alert(
        `Can not delete a currently booked slot\nThis slot is currently booked by: ${event.resource.bookedByEmail}`
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
    const newEvent: CalendarEvent = {
      interviewerUID: interviewerUID,
      start: new Date(start),
      end: new Date(end),
      resource: { isBooked: false, bookedByEmail: "" },
    };

    setEvents([...events, newEvent]);

    // create new EventAPI and add to eventsAPI state
    const newEventAPI: EventAPI = {
      interviewerUID: interviewerUID,
      start: formatISO(newEvent.start),
      end: formatISO(newEvent.end),
      isBooked: false,
      bookedByEmail: "Error Saving Events",
    };

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

    if (!response.ok) {
      const errorText = await response.text();
      // alert(errorText);
      setShowConfirmation("error");
      confirmationMessage.current = errorText;
      return;
    }

    try {
      const data = await response.json();
      console.log("data");
      console.log(data);
    } catch (err) {
      console.log(err);
      console.log("response causing error");
      console.log(response);
    }

    // alert(JSON.stringify(eventsAPI));
    confirmationMessage.current =
      "Successfully saved availabilities between the following dates: " +
      formatISO(eventsToSave[0].start, { representation: "date" }) +
      " to " +
      formatISO(eventsToSave[eventsToSave.length - 1].end, {
        representation: "date",
      });
    setShowConfirmation("success");

    console.log(confirmationMessage.current);
    console.log(showConfirmation);
  };

  // converts eventsAPI received from GET request to renderable CalendarEvents
  const convertToCalendar = (eventsFromAPI: EventAPI[]) => {
    const convertedEvents: CalendarEvent[] = [];
    eventsFromAPI.forEach(function (event) {
      const storedEvent: CalendarEvent = {
        interviewerUID: event.interviewerUID,
        start: new Date(event.start),
        end: new Date(event.end),
        resource: {
          isBooked: event.isBooked,
          bookedByEmail: event.bookedByEmail,
        },
      };

      convertedEvents.push(storedEvent);
    });

    setEvents(convertedEvents);
  };

  React.useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch(
          `http://localhost:8080/v1/availabilities/calendarAvailabilities?organization=${organization}&interviewerUID=${interviewerUID}`
        );
        const data = await response.json();
        console.log({ data });

        // convert data (EventAPI[]) into CalendarEvent[]
        convertToCalendar(data);

        setEventsAPI(data);
      } catch (e) {
        console.error(e);
        setError(true);
      }
    }
    console.log("FETCHING");
    fetchData();
  }, [interviewerUID]);

  console.log({ events });
  const eventPropGetterHandler = (event: CalendarEvent) => {
    const backgroundColor = event?.resource?.isBooked ? "#f25c5c" : "#5cf2a2";
    const color = "black";
    return { style: { backgroundColor, color } };
  };

  return (
    <>
      {error ? (
        <div>Error occured.</div>
      ) : (
        <>
          {showConfirmation !== "" && (
            <ConfirmationMessage type={showConfirmation}>
              <p style={{ fontSize: "20px" }}>{confirmationMessage.current}</p>
            </ConfirmationMessage>
          )}
          <div className="lead-calendar">
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
              style={{ height: 500, width: "100%" }}
              min={startOfWeek(new Date())}
              max={endOfWeek(new Date())}
              eventPropGetter={eventPropGetterHandler}
            />
          </div>
          <div>
            <button
              className="cta-button"
              onClick={(e) => handleClick(e, events)}
            >
              Save Changes
            </button>
          </div>
        </>
      )}
    </>
  );
}
