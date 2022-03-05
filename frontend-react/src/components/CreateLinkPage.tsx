import React from "react";
import { Link } from "react-router-dom";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import styles from "./styles/CreateLinkPage.module.css";
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
  const [leadsList, setLeadsList] = React.useState(
    [] as { leadUID: string; leadName: string }[]
  );
  const [selectedLeads, setSelectedLeads] = React.useState(
    [] as { leadUID: string; leadName: string }[]
  );
  const [calendarEvent, setCalendarEvent] = React.useState(
    [] as CalendarEvent[]
  );
  const [event, setEvent] = React.useState({ event: "not created yet" });

  React.useEffect(() => {
    // set the background image of the entire page upon render
    document.body.style.backgroundImage = "url('/page-2.svg')";

    // remove the background image when the component unmounts
    return () => {
      document.body.style.backgroundImage = "";
    };
  }, []);

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
        console.log({ err });
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

  const handleDropdownSelect = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const newSelectedLeads = [
      selectedLeads[0],
      {
        leadUID: event.target.value,
        leadName: event.target.options[event.target.selectedIndex]
          .text as string,
      },
    ];
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
      } catch (e) {
        console.log(JSON.stringify(e));
      }
    };
    loadMergedLeadTimes();
  }, [eventData.organization, eventData.userUID, eventData.partnerUID]);
  return (
    <div className={styles.createLinkPage}>
      <Link to="/app">
        <button>goto interviewer availabilities</button>
      </Link>
      <form className={styles.form}>
        <div className={styles.left}>
          <div className={styles.calendarInfoRow}>
            <div className={styles.choosePartner}>
              <label>
                <div className={styles.labelText}>Choose your partner:</div>
              </label>
              <select
                name="partnerUID"
                onChange={handleDropdownSelect}
                className={styles.select}
              >
                {leadsList.map((lead) => (
                  <option value={lead.leadUID} key={lead.leadUID}>
                    {" "}
                    {lead.leadName}{" "}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.labelText}>dummytext</div>
            <div className={styles.labelText}>dummytext</div>
          </div>
          <div className={styles.mergedCalendar}>
            <Calendar
              // className={styles.mergedCalendar}
              localizer={localizer}
              events={calendarEvent}
              defaultView="week"
              defaultDate={moment().toDate()}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500, width: "100%" }}
              min={startOfWeek(new Date())}
              max={endOfWeek(new Date())}
            />
          </div>
        </div>
        <div className={styles.right}>
          <div className={styles.inputArea}>
            <div className={styles.intervieweeEmailContainer}>
              <label className={styles.labelText}>Interviewee Email:</label>
              <input
                type="text"
                className={styles.emailInput}
                name="intervieweeEmail"
                value={eventData.intervieweeEmail}
                onChange={handleChange}
              />
            </div>
            <div className={styles.selectLength}>
              <label className={styles.labelText}>
                Select Interview Length:
              </label>
              <div className={styles.radioRow}>
                <label className={styles.radioLabel}>
                  <input
                    className={styles.radioInput}
                    type="radio"
                    value={30}
                    name="length"
                    onChange={handleChange}
                  />
                  30 mins
                </label>
                <label className={styles.radioLabel}>
                  <input
                    className={styles.radioInput}
                    type="radio"
                    value={60}
                    name="length"
                    onChange={handleChange}
                  />{" "}
                  60 mins
                </label>
                <label className={styles.radioLabel}>
                  <input
                    className={styles.radioInput}
                    type="radio"
                    value={90}
                    name="length"
                    onChange={handleChange}
                  />{" "}
                  90 mins
                </label>
              </div>
            </div>
            <button
              className={`${styles.createBooking} ${styles.button}`}
              onClick={(e) => handleSubmit(e)}
            >
              Create Booking Link
            </button>
            <div className={styles.eventInfo}>
              <div>
                <p className="">unique url: {bookingLink}</p>
              </div>
              <button
                onClick={async (e) => {
                  e.preventDefault();
                  if (bookingLink) {
                    await navigator.clipboard.writeText(bookingLink);
                  }
                }}
                className={styles.button}
              >
                copy link!
              </button>
            </div>
            <p className={styles.eventJSON}>
              {JSON.stringify(event, null, "\t")}
            </p>
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
    const interviewersJSON: { name: string; interviewerUID: string }[] =
      await interviewersRes.json();
    interviewersJSON.forEach(
      (element: { name: string; interviewerUID: string }) => {
        interviewers.push({
          leadName: element.name,
          leadUID: element.interviewerUID,
        });
      }
    );
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
    if (!eventRes.ok) {
      console.log(eventRes);
      throw new Error(
        `error adding event ${JSON.stringify(addEventBody, null, "\t")}`
      );
    }
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
