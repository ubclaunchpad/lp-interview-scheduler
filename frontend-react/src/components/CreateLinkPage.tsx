import React from "react";
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import styles from "./styles/CreateLinkPage.module.css";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { useAuth } from "../contexts/AuthContext";
import { endOfWeek, format, startOfWeek } from "date-fns";
import { useSetBackgroundImage } from "../hooks/useSetBackground";
import ModalContainer from "./modal/ModalContainer";

const localizer = momentLocalizer(moment);

const linkPrefix = "http://localhost:8080/v1/";

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

interface AddEmailBody {
  recipientEmail: string;
  message: string;
  subject: string;
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
    expires: "2022-04-23T18:25:43.511Z" as string, // TODO: change this
  });
  const [bookingLink, setBookingLink] = React.useState("");
  const [leadsList, setLeadsList] = React.useState([] as Lead[]);
  const [selectedLeads, setSelectedLeads] = React.useState([] as Lead[]);
  const [calendarEvent, setCalendarEvent] = React.useState(
    [] as CalendarEvent[]
  );

  const [startDate, setStartDate] = React.useState<Date>();
  const [endDate, setEndDate] = React.useState<Date>();

  useSetBackgroundImage("url('/page-2.svg'");

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
      } catch (err) {
        console.log(JSON.stringify(err));
      }
    };
    event.preventDefault();
    submitEvent();
  };

  const handleModalSubmit = (childModalData: {
    subject: string;
    message: string;
  }) => {
    const submitEmail = async () => {
      try {
        // submit modal form data
        const emailResponse = await sendEmail(
          eventData.intervieweeEmail,
          childModalData.message,
          childModalData.subject
        );
        console.log(emailResponse);
      } catch (err) {
        console.log(JSON.stringify(err));
      }
    };
    submitEmail();
  };

  const handleChange = (
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    // set lead state and set the chosen lead's availabilities to events
    const value = event.target.value;
    let newEventData = { ...eventData, [event.target.name]: value };
    if (event.target.name === "partnerUID" && value !== "no_partner") {
      newEventData["partnerUID"] = JSON.parse(value).leadUID;
    }
    setEventData(newEventData);
  };

  const handleDropdownSelect = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedInterviewer: string = event.target.value;
    let newSelectedLeads: Lead[] = [selectedLeads[0]];
    if (selectedInterviewer !== "no_partner") {
      const partnerJSON: Lead = JSON.parse(selectedInterviewer);
      newSelectedLeads[1] = {
        leadUID: partnerJSON.leadUID,
        leadName: partnerJSON.leadName,
        bookingCount: partnerJSON.bookingCount,
        confirmed: partnerJSON.confirmed,
        pending: partnerJSON.pending,
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
              confirmed: lead.confirmed,
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
    const loadSingleInterviewerTimes = async () => {
      try {
        const response = await getSingleAvailability(
          eventData.organization,
          eventData.userUID
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
  }, [
    eventData.organization,
    eventData.userUID,
    selectedLeads,
    eventData.partnerUID,
  ]);

  return (
    <div className="body">
      <div className={styles.createLinkPage}>
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
                  {leadsList.map((lead) => createRow(lead))}
                  <option value={"no_partner"}>No Partner</option>
                </select>
              </div>
              <div className={styles.labelText}>
                {showEventCount(selectedLeads)}
              </div>
            </div>
            <div className={styles.mergedCalendar}>
              <Calendar
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
            <div className={styles.validFromContainer}>
              <div>
                Valid from
                <div className={styles.timeDuration}>
                  {`${getFormattedDate(startDate)} to ${getFormattedDate(
                    endDate
                  )}`}
                </div>
                <div className={styles.selectDateSection}>
                  <label className={styles.selectDateLabelGroup}>
                    start date:
                    <input
                      className={styles.selectDateInput}
                      type="date"
                      onChange={(newDate) => {
                        if (newDate.target.value) {
                          console.log(newDate.target.value);
                          setStartDate(new Date(newDate.target.value));
                        }
                      }}
                    />
                  </label>
                  <label className={styles.selectDateLabelGroup}>
                    end date:
                    <input
                      className={styles.selectDateInput}
                      type="date"
                      onChange={(newDate) => {
                        if (newDate.target.value) {
                          setEndDate(new Date(newDate.target.value));
                        }
                      }}
                    />
                  </label>
                </div>
              </div>
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
                  <p>unique url: {bookingLink}</p>
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
                <ModalContainer
                  triggerText={"Send to Interviewee"}
                  onSubmit={handleModalSubmit}
                />
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

function createRow(interviewer: Lead): JSX.Element {
  return (
    <option value={JSON.stringify(interviewer)} key={interviewer.leadUID}>
      {`  ${interviewer.leadName} : ${interviewer.bookingCount}`}
    </option>
  );
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
          confirmed: 0,
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

async function sendEmail(
  recipientEmail: string,
  message: string,
  subject: string
): Promise<any> {
  const addEmailBody: AddEmailBody = {
    recipientEmail: recipientEmail,
    message: message,
    subject: subject,
  };
  try {
    const eventRes: Response = await fetch("http://localhost:8080/v1/email/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(addEmailBody),
    });
    if (!eventRes.ok) {
      console.log(eventRes);
      throw new Error(
        `error adding event ${JSON.stringify(addEmailBody, null, "\t")}`
      );
    }
    return Promise.resolve(await eventRes);
  } catch (err) {
    return Promise.reject(err);
  }
}

function mergedAPIString(organization: string, leads: string[]): string {
  // return `http://localhost:8080/v1/availabilities/mergedTimes?organization=${organization}&interviewerUID1=${leadUID1}&interviewerUID2=${leadUID2}&inCalendarAvailability=true`;
  let queryString =
    linkPrefix + `availabilities/mergeMultiple/?organization=${organization}`;
  leads.forEach((interviewerUID) => {
    queryString += `&interviewerUID=${interviewerUID}`;
  });
  queryString += "&inCalendarAvailability=true";
  return queryString;
}

async function getMergedAvailabilities(
  organization: string,
  leadUID1: string,
  leadUID2: string
): Promise<CalendarEvent[]> {
  try {
    const mergedRes: Response = await fetch(
      mergedAPIString(organization, [leadUID1, leadUID2])
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
  leadUID: string | undefined
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
  console.log(APICalEvents);
  const convertedEvents: CalendarEvent[] = [];
  APICalEvents.forEach(function (event) {
    const storedEvent: CalendarEvent = {
      interviewerUID: event.interviewerUID,
      start: new Date(event.start),
      end: new Date(event.end),
    };
    convertedEvents.push(storedEvent);
  });
  console.log(convertedEvents);
  return convertedEvents;
}

function showEventCount(selectedLeads: Lead[]): React.ReactNode {
  if (selectedLeads.length === 1) {
    return `Confirmed: ${selectedLeads[0].confirmed}, Pending: ${selectedLeads[0].pending}`;
  } else if (selectedLeads.length === 2) {
    return `Confirmed: ${selectedLeads[1].confirmed}, Pending: ${selectedLeads[1].pending}`;
  }
}

function getFormattedDate(date: Date | undefined) {
  return date === undefined ? "no date selected" : format(date, "MMMM dd yyyy");
}
