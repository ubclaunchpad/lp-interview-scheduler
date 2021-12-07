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

interface AddEventBody {
  organization: string;
  leads: { leadUID: string; leadName: string }[];
  intervieweeEmail: string;
  length: number;
  expires: string;
}

interface APICalendarEvent {
  interviewerUID: string | undefined;
  start: string;
  end: string;
}

export default function CreateLinkPage() {
  const { user } = useAuth();
  const [eventData, setEventData] = React.useState({
    organization: "launchpad" as string,
    intervieweeEmail: "" as string,
    userUID: user?.uid as string,
    partnerUID: "" as string,
    length: 0,
    expires: "2012-04-23T18:25:43.511Z" as string,
  });
  const [bookingLink, setBookingLink] = React.useState("");
  const [leadsList, setLeadsList] = React.useState([] as {leadUID:string, leadName: string}[]);
  const [selectedLeads, setSelectedLeads] = React.useState([] as {leadUID:string, leadName: string}[])
  const [calendarEvent, setCalendarEvent] = React.useState(
    [] as CalendarEvent[]
  );
  const [event, setEvent] = React.useState({"event": "not created yet"});

  const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    const submitEvent = async () => {
      try {
        // submit form data
        const eventResponse = await addEvent(
          eventData.organization,
          selectedLeads,
          eventData.intervieweeEmail,
          eventData.length,
          eventData.expires
        );

        // create unique url
        const path: string = `localhost:3000/test?eventUID=${eventResponse.eventUID}&organization=${eventData.organization}`;
        setBookingLink(path);
        setEvent(eventResponse);
      } catch (err) {
        console.log(err);
      }
    };
    event.preventDefault();
    submitEvent();
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

  const handleDropdownSelect = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSelectedLeads = [selectedLeads[0], {leadUID: event.target.value, leadName: event.target.options[event.target.selectedIndex].text as string}];
    setSelectedLeads(newSelectedLeads);
    handleChange(event);
  }

  // useEffect for populating dropdown menu of leads excluding user
  React.useEffect(() => {
    getAllLeads(eventData.organization).then(leads => {
      let index = 0;
      for (const lead of leads) {  
        if (lead.leadUID === eventData.userUID) {
          setSelectedLeads([{
            leadUID: lead.leadUID,
            leadName: lead.leadName
          }])
          break;
        }
        index++;
      }
      leads.splice(index, 1);
      setLeadsList(leads);
      // remove this part when Aymen's user info branch is merged
      if (selectedLeads.length === 0) 
        setSelectedLeads([{
          leadUID: user?.uid as string,
          leadName: user?.displayName as string
        }]);
      //-----------------------------------------------------------
    });
  }, [eventData.organization, eventData.userUID]);

  // useEffect for populating Calendar with mergedTimes, might need another useEffect for populating leads
  React.useEffect(() => {
    // first run of useEffect results in an error bec default partner lead is null atm
    const loadMergedLeadTimes = async () => {
      try {
        const response = await getMergedAvailabilities(
          eventData.organization,
          eventData.userUID,
          eventData.partnerUID
        );
        setCalendarEvent(response);
        console.log(JSON.stringify(response));
      } catch (e) {
        console.log(JSON.stringify(e));
      }
    };
    loadMergedLeadTimes();
  }, [eventData.organization, eventData.userUID, eventData.partnerUID]);

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
                  // value={eventData.partnerUID}
                  onChange={handleDropdownSelect}
                >
                  {/* {populateDropdown()} */}
                  {leadsList.map(lead => 
                      (<option value={lead.leadUID} key={lead.leadUID}> {lead.leadName} </option>)
                  )}
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
            <button onClick={(e) => handleSubmit(e)}>
              Create Booking Link
            </button>
            {/* <p>[dummy unique url]</p> */}
            <p className="unique-url">unique url: {bookingLink}</p>
            <pre className="event-info">event info: {JSON.stringify(event, null, '\t')}</pre>
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
      </form>
    </div>
  );
}

async function getAllLeads(
  organization: string
): Promise<{ leadUID: string; leadName: string }[]> {

  try {
    const interviewersRes: Response = await fetch(
      `http://localhost:8080/v1/interviewers/?organization=${organization}`
    );
    if (!interviewersRes.ok)
      throw new Error(
        `Error calling getAllLeads api with organization ${organization}`
      );
    const interviewers: { leadUID: string; leadName: string }[] = [];
    const interviewersJSON: { name: string; interviewerUID: string }[] = await interviewersRes.json();
    interviewersJSON.forEach((element: { name: string; interviewerUID: string }) => {
        interviewers.push({
          leadName: element.name,
          leadUID: element.interviewerUID,
        });
      });
    return Promise.resolve(interviewers);
  } catch (err) {
    return Promise.reject(err);
  }
}

async function addEvent(
  organization: string,
  leads: { leadUID: string; leadName: string }[],
  intervieweeEmail: string,
  length: number,
  expires: string
): Promise<any> {
  const addEventBody: AddEventBody = {
    organization: organization,
    leads: leads,
    intervieweeEmail: intervieweeEmail,
    length: length,
    expires: expires,
  };
  try {
    const eventRes: Response = await fetch("http://localhost:8080/v1/events/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(addEventBody),
    });
    if (!eventRes.ok)
      throw new Error(
        `error adding event ${JSON.stringify(addEventBody, null, "\t")}`
      );
    return Promise.resolve(await eventRes.json());
  } catch (err) {
    return Promise.reject(err);
  }
}

async function getMergedAvailabilities(
  organization: string,
  leadUID1: string | undefined,
  leadUID2: string
): Promise<CalendarEvent[]> {
  try {
    const mergedRes: Response = await fetch(
      `http://localhost:8080/v1/availabilities/mergedTimes?organization=${organization}&interviewerUID1=${leadUID1}&interviewerUID2=${leadUID2}&inCalendarAvailability=true`
    );
    if (!mergedRes.ok)
      throw new Error(
        `error calling api merged times with organization=${organization}&interviewerUID1=${leadUID1}&interviewerUID2=${leadUID2}`
      );
    const calendarEvents: CalendarEvent[] = ConvertAPICalEventsToCalEvents(
      (await mergedRes.json()) as APICalendarEvent[]
    );
    return Promise.resolve(calendarEvents);
  } catch (err) {
    return Promise.reject(err);
  }
}

// converts eventsAPI received from GET request to renderable CalendarEvents
function ConvertAPICalEventsToCalEvents(
  APICalEvents: APICalendarEvent[]
): CalendarEvent[] {
  const convertedEvents: CalendarEvent[] = [];
  APICalEvents.forEach(function (event) {
    const storedEvent: CalendarEvent = {
      interviewerUID: event.interviewerUID,
      start: new Date(event.start),
      end: new Date(event.end),
    };
    convertedEvents.push(storedEvent);
  });
  return convertedEvents;
}
