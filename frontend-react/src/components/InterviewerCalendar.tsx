import React from "react";
import { Calendar, DateLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import "../App.css";
import { useAuth } from "../contexts/AuthContext";
import { areIntervalsOverlapping, endOfWeek, formatISO, startOfWeek } from "date-fns";
import { useSetBackgroundImage } from "../hooks/useSetBackground";
import ConfirmationMessage from "./ConfirmationMessage";
import LoadingIndicator from "./loadingIndicator/LoadingIndicator";

interface Props {
  localizer: DateLocalizer;
  isLoading: boolean;
  onLoadingStart: ()=>void;
  onLoadingEnd: ()=>void;
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

export default function InterviewerCalendar(props: Props) {
  const [events, setEvents] = React.useState([] as CalendarEvent[]);
  const [eventsAPI, setEventsAPI] = React.useState([] as EventAPI[]);
  const [error, setError] = React.useState(false);
  const [showConfirmation, setShowConfirmation] = React.useState("" as string);
  const { user } = useAuth();
  const interviewerUID = user?.uid;
  const organization = "launchpad";
  let confirmationMessage = React.useRef("");

  useSetBackgroundImage("url('/page-1.svg'");

  useSetBackgroundImage("url('/page-1.svg'");

  const handleSelect = (event: CalendarEvent): any => {
    // option to delete when event timeslot is clicked / selected
    if (props.isLoading) {
      window.alert(
        "You cannot make adjustment while your schedule is being saved."
        );
        return;
    }
    if (!event.resource.isBooked) {
      const shouldDelete = window.confirm(
        "Would you like to remove this availability?"
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
        `Cannot delete a currently booked slot.\nThis slot is currently booked by: ${event.resource.bookedByEmail}`
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
    // check if there is an overlapping calendar event already
    if (
      events.find((event) => {
        return areIntervalsOverlapping(
          { start: event.start, end: event.end },
          { start: newEvent.start, end: newEvent.end }
        );
      })
    ) {
      alert(
        "Unable to create this availability because it overlaps with an existing one."
      );
      return;
    }
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
    try {
      props.onLoadingStart();
      const response = await fetch(
        "http://localhost:8080/v1/availabilities/",
        submitCalendarEvents
      );
      if (!response.ok) {
        throw new Error(await response.text());
      }
      confirmationMessage.current =
      "Successfully saved availabilities between the following dates: " +
      formatISO(eventsToSave[0].start, { representation: "date" }) +
      " to " +
      formatISO(eventsToSave[eventsToSave.length - 1].end, {
        representation: "date",
      });
    setShowConfirmation("success");

    } catch(err){
      setShowConfirmation("error");
      confirmationMessage.current = String(err);
      console.log(err);
    } finally {
      props.onLoadingEnd();
    }
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
              selectable={!props.isLoading}
              localizer={props.localizer}
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
            {props.isLoading ? 
              <LoadingIndicator/> : 
              <button
              className="cta-button"
              onClick={(e) => handleClick(e, events)}
            >
              Save changes
            </button>}
          </div>
        </>
      )}
    </>
  );
}


