import React from "react";
import { Link } from "react-router-dom";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "../App.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useAuth } from "../contexts/AuthContext";

const localizer = momentLocalizer(moment);

interface CalendarEvent {
  interviewerUID: string | undefined;
  start: Date;
  end: Date;
}

export default function CreateLinkPage() {
  const { user } = useAuth();
  const [eventData, setEventData] = React.useState({
    organization: "launchpad",
    intervieweeEmail: "",
    userUID: user?.uid,
    partnerUID: "",
    length: 0,
  });
  const [calendarEvent, setCalendarEvent] = React.useState(
    [] as CalendarEvent[]
  );

  const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    // submit form data
    event.preventDefault();
  };

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    // set lead state and set the chosen lead's availabilities to events
    const value = event.target.value;
    setEventData({
      ...eventData,
      [event.target.name]: value,
    });
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

  // React.useEffect(() => {
  //   // getMergedAvailabilities(
  //   //   eventData.organization,
  //   //   eventData.userUID,
  //   //   eventData.partnerUID
  //   // );
  //   console.log(eventData.userUID);
  //   console.log("my partner is:" + eventData.partnerUID);
  // }, [eventData.partnerUID]);

  return (
    <div className="Create-Link">
      <Link to="/app">
        <button>goto interviewer availabilities</button>
      </Link>
      <form>
        <div className="event-info-form">
          <div className="left-side">
            <div>
              <label>
                Choose your partner:
                <select
                  name="partnerUID"
                  value={eventData.partnerUID}
                  onChange={handleChange}
                >
                  <option value="lead1">Lead 1</option>
                  <option value="lead2">Lead 2</option>
                  <option value="lead3">Lead 3</option>
                  <option value="lead4">Lead 4</option>
                </select>
              </label>
            </div>
            <div>
              <label>
                Interviewee Email:
                <textarea
                  name="intervieweeEmail"
                  value={eventData.intervieweeEmail}
                  onChange={handleChange}
                />
              </label>
            </div>
            <div>
              <label>
                Select Interview Length:
                <div>
                  <input
                    type="radio"
                    value={30}
                    name="length"
                    onChange={handleChange}
                  />{" "}
                  30 mins
                  <input
                    type="radio"
                    value={60}
                    name="length"
                    onChange={handleChange}
                  />{" "}
                  60 mins
                  <input
                    type="radio"
                    value={90}
                    name="length"
                    onChange={handleChange}
                  />{" "}
                  90 mins
                </div>
              </label>
            </div>
          </div>
          <div className="right-side">
            <Calendar
              selectable
              localizer={localizer}
              events={calendarEvent}
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
          </div>
        </div>
        <div>
          <button onClick={(e) => handleSubmit(e)}>Create Booking Link</button>
          <input type="text" id="unique-link" name="unique-link"></input>
        </div>
      </form>
    </div>
  );
}

// async function getAllLeads(
//   organization: string
// ): Promise<{ interviewerUID: string; interviewerName: string }[]> {
//   return Promise.reject("not there yet");
// }

// async function addEvent(
//   organization: string,
//   leads: { leadUID: string; name: string }[],
//   intervieweeEmail: string,
//   length: number,
//   expires: string
// ): Promise<any> {
//   return Promise.reject("not there yet");
// }

// async function getMergedAvailabilities(
//   organization: string,
//   leadUID1: string,
//   leadUID2: string
// ): Promise<CalendarEvent[]> {
//   return Promise.reject("not there yet");
// }
