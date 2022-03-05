import React from "react";
import { Link } from "react-router-dom";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "../App.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useAuth } from "../contexts/AuthContext";
import { endOfWeek, startOfWeek } from "date-fns";

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

interface Lead {
  leadUID: string;
  leadName: string;
  bookingCount: number;
  pending: Number;
  confirmed: Number;
}

export default function CreateLinkPage() {
  const { user } = useAuth();
  const [eventData, setEventData] = React.useState({
    organization: "launchpad" as string,
    intervieweeEmail: "" as string,
    userUID: user?.uid as string,
    partnerUID: "" as string,
    length: 0,
    expires: "2022-04-23T18:25:43.511Z" as string,
  });
  const [bookingLink, setBookingLink] = React.useState("");
  const [leadsList, setLeadsList] = React.useState([] as Lead[]);
  const [selectedLeads, setSelectedLeads] = React.useState([] as Lead[]);
  const [calendarEvent, setCalendarEvent] = React.useState(
    [] as CalendarEvent[]
  );
  const [event, setEvent] = React.useState({ event: "not created yet" });
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
    let newEventData = {...eventData, [event.target.name]: value};
    if (event.target.name === "partnerUID" && value !== "no_partner") {
      newEventData["partnerUID"] = JSON.parse(value).leadUID;
    }
    // console.log(newEventData);
    setEventData(newEventData);
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

  const handleDropdownSelect = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedInterviewer : string = event.target.value;
    let newSelectedLeads : Lead[] = [selectedLeads[0]];
    if (selectedInterviewer !== "no_partner") {
      const partnerJSON : Lead = JSON.parse(selectedInterviewer);
      newSelectedLeads[1] = {
          leadUID: partnerJSON.leadUID,
          leadName: partnerJSON.leadName,
          bookingCount: partnerJSON.bookingCount,
          confirmed: partnerJSON.confirmed,
          pending: partnerJSON.pending
        };
    }
    setSelectedLeads(newSelectedLeads);
    handleChange(event);
  };


  // useEffect for populating dropdown menu of leads excluding user
  React.useEffect(() => {
    getAllLeads(eventData.organization).then((leads) => {
      let index = 0;
      for (const lead of leads) {
        if (lead.leadUID === eventData.userUID) {
          setSelectedLeads([
            {
              leadUID: lead.leadUID,
              leadName: lead.leadName,
              bookingCount: lead.bookingCount,
              pending: lead.pending,
              confirmed: lead.confirmed
            },
          ]);
          break;
        }
        index++;
      }
      leads.splice(index, 1);
      setLeadsList(leads);
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
    const loadSingleInterviewerTimes = async () => {
      try {
        const response = await getSingleAvailability(
          eventData.organization,
          eventData.userUID,
        );
        console.log(response);
        setCalendarEvent(response);
        // console.log(JSON.stringify(response));
      } catch (e) {
        console.log(JSON.stringify(e));
      }
    };
    if (selectedLeads.length === 1) {
      loadSingleInterviewerTimes();
    } else {
      loadMergedLeadTimes();
    }
  }, [eventData.organization, eventData.userUID, selectedLeads, eventData.partnerUID]);

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
                  {leadsList.map((lead) => createRow(lead))}
                  <option value={"no_partner"}>No Partner</option>
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
            <pre className="event-info">
              event info: {JSON.stringify(event, null, "\t")}
            </pre>
          </div>
          <div className="right-side">
            <div className="show-event-count">
              {showEventCount(selectedLeads)}
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
              min={startOfWeek(new Date())}
              max={endOfWeek(new Date())}
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

function createRow(interviewer: Lead) : JSX.Element {
  return <option value={JSON.stringify(interviewer)} key={interviewer.leadUID}>
  {`  ${interviewer.leadName} : ${interviewer.bookingCount}`}
</option>
}

async function getAllLeads(organization: string): Promise<Lead[]> {
  try {
    const interviewersRes: Response = await fetch(
      `http://localhost:8080/v1/interviewers/?organization=${organization}`
    );
    if (!interviewersRes.ok)
      throw new Error(
        `Error calling getAllLeads api with organization ${organization}`
      );
    const interviewers: Lead[] = [];
    const interviewersJSON: { name: string; interviewerUID: string }[] =
      await interviewersRes.json();
    interviewersJSON.forEach(
      (element: { name: string; interviewerUID: string }) => {
        interviewers.push({
          leadName: element.name,
          leadUID: element.interviewerUID,
          bookingCount: 0,
          pending: 0,
          confirmed: 0
        });
      }
    );
    await updateInterviewersWithBookingCount(organization, interviewers);

    //sort
    interviewers.sort(compare);
    return Promise.resolve(interviewers);
  } catch (err) {
    return Promise.reject(err);
  }
}


function compare(leadA: Lead, leadB: Lead): number {
  if (leadA.bookingCount < leadB.bookingCount) return -1;
  if (leadA.bookingCount > leadB.bookingCount) return 1;
  return 0;
}

async function updateInterviewersWithBookingCount(
  organization: string,
  leads: Lead[]
) {
  try {
    const bookingCountRes: Response = await fetch(
      `http://localhost:8080/v1/events/bookingCount/?organization=${organization}`
    );
    if (!bookingCountRes.ok)
      throw new Error(
        `Error calling getAllLeads api with organization ${organization}`
      );
    const bookingCountJSON: {
      organization: string;
      leads: {
        [leadUID: string]: {
          name: string;
          confirmed: number;
          pending: number;
        };
      };
    } = await bookingCountRes.json();
    for (let lead of leads) {
      if (bookingCountJSON.leads[lead.leadUID]) {
        let bookingInfo: { confirmed: number; pending: number } =
          bookingCountJSON.leads[lead.leadUID];
        lead.bookingCount = bookingInfo.confirmed + bookingInfo.pending;
        lead.confirmed = bookingInfo.confirmed;
        lead.pending = bookingInfo.pending;
      }
    }
  } catch (err) {
    return Promise.reject(err);
  }
}

async function addEvent(
  organization: string,
  leads: Lead[],
  intervieweeEmail: string,
  length: number,
  expires: string
): Promise<any> {
  const addEventBody: AddEventBody = {
    organization: organization,
    leads: leads.map((lead) => {
      return { leadUID: lead.leadUID, leadName: lead.leadName };
    }),
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

async function getSingleAvailability(
  organization: string,
  leadUID: string | undefined,
): Promise<CalendarEvent[]> {
  try {
    const singleRes: Response = await fetch(
      `http://localhost:8080/v1/availabilities/calendarAvailabilities?organization=${organization}&interviewerUID=${leadUID}`
    );
    if (!singleRes.ok)
      throw new Error(
        `error calling api availabilities with organization=${organization}&interviewerUID=${leadUID}`
      );
    // console.log(await singleRes.json());
    const calendarEvents: CalendarEvent[] = ConvertAPICalEventsToCalEvents(
      (await singleRes.json()) as APICalendarEvent[]
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
function showEventCount(selectedLeads: Lead[]): React.ReactNode {
  if (selectedLeads.length === 1) {
    return `confirmed: ${selectedLeads[0].confirmed} pending: ${selectedLeads[0].pending}`;
  }
  else if (selectedLeads.length === 2) {
    return `confirmed: ${selectedLeads[1].confirmed} pending: ${selectedLeads[1].pending}`;
  }
}

