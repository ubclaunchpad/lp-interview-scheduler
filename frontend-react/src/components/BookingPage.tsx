import { useLocation } from "react-router-dom";
import LaunchpadLogo from "../logo.svg";
import React, { useState } from "react";
import InterviewTimePicker from "./booking/InterviewTimePicker";
import moment, { Moment } from "moment";
import styles from "./styles/BookingPage.module.css";
import { useSetBackgroundImage } from "../hooks/useSetBackground";

interface APIAvailability {
  durationMins: number;
  startTime: string;
  bookedByEmail: string;
  interviewerUID: string;
  isBooked: boolean;
}

const linkPrefix = "http://localhost:8080/v1/";

export default function PageThree() {
  const [mergedAvailabilities, setAvailabilities] = useState(
    [] as APIAvailability[]
  );
  const [leadUIDs, setLeadUIDs] = useState([] as string[]);
  const [leadNames, setLeadNames] = useState([] as string[]);
  const [confirmedTime, setConfirmedTime] = useState("");

  const { search } = useLocation();
  const params = React.useMemo(() => new URLSearchParams(search), [search]);

  const organization = params.get("organization");
  const eventUID = params.get("eventUID");

  useSetBackgroundImage("url('/page-3.svg'");

  // Call get request with event ID and return event body
  const handleGetEvent = React.useCallback(async () => {
    try {
      const response = await fetch(
        linkPrefix + `events/?organization=${organization}&eventUID=${eventUID}`
      );
      if (!response.ok) {
        alert("Get Event request failed");
      }
      const data = await response.json();
      return data;
    } catch (e) {
      alert("Something went wrong with get Event request");
    }
  }, [eventUID, organization]);

  // Call get request with lead IDs from event body and return merged availabilities
  const handleMergeAvailabilities = React.useCallback(
    async (eventBody: any) => {
      try {
        const leads: string[] = eventBody.leads.map((interviewer: any) => {
          return interviewer.leadUID;
        });

        const leadNames: string[] = eventBody.leads.map(
          (interviewer: any) => interviewer.leadName
        );

        setLeadUIDs(leads);
        setLeadNames(leadNames);
        setConfirmedTime(eventBody["confirmedTime"]);

        let queryString =
          linkPrefix +
          `availabilities/mergeMultiple/?organization=${organization}`;
        leads.forEach((interviewerUID) => {
          queryString += `&interviewerUID=${interviewerUID}`;
        });

        const response = await fetch(queryString);
        if (!response.ok) {
          alert("Merged availability request failed");
        }

        const data = await response.json();
        setAvailabilities(data);

        console.log(data);
      } catch (e) {
        console.log(e);
        alert("Something went wrong with merged availability request");
      }
    },
    [organization]
  );

  const apiAvailsToMoments = (avails: APIAvailability[]) => {
    return avails.map((a) => moment(a.startTime));
  };

  React.useEffect(() => {
    if (params.has("eventUID") && params.has("organization")) {
      handleGetEvent().then((data) => handleMergeAvailabilities(data));
    }
  }, [handleGetEvent, handleMergeAvailabilities, params]);

  const bookSlot = (slot: Moment) => {
    fetch(linkPrefix + "events", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        organization: organization,
        eventUID: eventUID,
        leadUIDs: leadUIDs,
        times: [slot.format("YYYY-MM-DDTHH:mm:ssZ")],
      }),
    }).then((res) => {
      if (res.status === 200) {
        setConfirmedTime(slot.toString());
        window.alert(
          "You have successfully booked an interview for " + slot.format("LLLL")
        );
      } else {
        window.alert("Error booking interview.");
      }
    });
  };

  if (confirmedTime != null && confirmedTime.length > 0) {
    return (
      <div>
        <p>
          Your interview is booked for {moment(confirmedTime).format("LLLL")}
        </p>
        <p>You can close now this tab</p>
      </div>
    );
  } else {
    return (
      <div className={styles.bookingPageWithNav}>
        <div className={styles.userNav}>
          <img
            className={styles.logo}
            src={LaunchpadLogo}
            alt="Launchpad Logo"
          />
          Launchpad Interview Scheduler
        </div>
        <div className={styles.bookingPage}>
          <div className={styles.textContainer}>
            <div className={styles.interviewerNames}>
              Your Interviewer/s : {leadNames.join(", ")}
            </div>
            <div className={styles.bookSlot}>Book your interview slot!</div>
          </div>
          <InterviewTimePicker
            availabilities={apiAvailsToMoments(mergedAvailabilities)}
            onBook={bookSlot}
          />
        </div>
      </div>
    );
  }
}
