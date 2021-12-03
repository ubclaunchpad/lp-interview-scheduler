import React from "react";
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

export default function BookingPage() {
  const { user } = useAuth();
  const [eventData, setEventData] = React.useState({
    organization: "launchpad",
    intervieweeEmail: "",
    userUID: user?.uid,
    partnerUID: "",
    length: 0
  });
  const [calendarEvent, setCalendarEvent] = React.useState([] as CalendarEvent[]);


  const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    // submit selected lead
    event.preventDefault();
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    // set lead state and set the chosen lead's availabilities to events
    const value = event.target.value; 
    setEventData({
      ...eventData, 
      [event.target.name]: value
    })}; 

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
      <form>
        <div className="dropdown-lead">
          <label>
            Choose your partner:
            <select name = "partnerUID" value={eventData.partnerUID} onChange={handleChange}>
              <option value="lead1">Lead 1</option>
              <option value="lead2">Lead 2</option>
              <option value="lead3">Lead 3</option>
              <option value="lead4">Lead 4</option>
            </select>
          </label>
          <label>
            Interviewee Email:
            <textarea name = "intervieweeEmail" value={eventData.intervieweeEmail} onChange={handleChange}/>            
          </label>
          <label>
            Select Interview Length:
            <div>
              <input type="radio" value={30} name="length" onChange = {handleChange}/> Male
              <input type="radio" value={60} name="length" onChange = {handleChange}/> Female
              <input type="radio" value={90} name="length" onChange = {handleChange}/> Other
            </div>
          </label>
        </div>
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
        <div>
          <button onClick={(e) => handleSubmit(e)}>Create Booking Link</button>
          <input type="text" id="unique-link" name="unique-link"></input>
        </div>
      </form>
      </>
  );
}



async function getAllLeads(organization: string): Promise<{ interviewerUID: string; interviewerName: string; }[]> {
  try {
    
  } catch(err) {
    Promise.reject(err);
  }
  return Promise.reject("not there yet");

}

async function addEvent(
  organization: string,
  leads: { leadUID: string; name: string }[],
  intervieweeEmail: string,
  length: number,
  expires: string
): Promise<any> {
  return Promise.reject("not there yet");
}

async function getMergedAvailabilities(
  organization: string,
  leadUID1: string,
  leadUID2: string
): Promise<CalendarEvent[]> {
  return Promise.reject("not there yet");
}
