import { useLocation } from "react-router-dom";
import React, { useState } from "react";

const linkPrefix = "http://localhost:8080/v1/";
export default function PageThree() {
  const [eventBody, setEventBody] = useState({
    leads: [],
  });
  const [mergedAvailabilities, setAvailabilities] = useState({});
  const [showAvailabilitiesButton, showAvailabilities] = useState(false);

  const { search } = useLocation();
  const params = new URLSearchParams(search);

  if (!params.has("eventUID") || !params.has("organization")) {
    return <h1>Error - Missing requisite query parameters!!</h1>;
  }

  const organization = params.get("organization");
  const eventUID = params.get("eventUID");

  // Call get request with event ID and return event body
  async function handleGetEvent() {
    try {
      const response = await fetch(
        linkPrefix + `events/?organization=${organization}&eventUID=${eventUID}`
      );
      if (!response.ok) {
        alert("Get Event request failed");
      }
      const data = await response.json();
      setEventBody(data);
      showAvailabilities(true);
    } catch (e) {
      alert("Something went wrong with get Event request");
    }
  }

  // Call get request with lead IDs from event body and return merged availabilities
  async function handleMergeAvailabilities() {
    // TOOD : Request to get merged availabilities
    // TODO : Set state so that we have the availability?
    try {
      let lead2_UID, response;

      const lead1_UID = eventBody["leads"][0]["leadUID"];
      if (eventBody["leads"].length === 1) {
        response = await fetch(
          linkPrefix + `availabilities/calendarAvailabilities?organization=${organization}&interviewerUID=${(lead1_UID)}`
        )
      } else {
        lead2_UID = eventBody["leads"][1]["leadUID"];
        response = await fetch(
          linkPrefix +
            `availabilities/mergedTimes/?organization=${organization}&interviewerUID1=${lead1_UID}&interviewerUID2=${lead2_UID}`
        );
      }

      if (!response.ok) {
        alert("Get Event request failed");
      }
      const data = await response.json();
      setAvailabilities(data);
      console.log(data);
    } catch (e) {
      alert("Something went wrong with get Event request");
    }
  }

  console.log(showAvailabilitiesButton);

  if (showAvailabilitiesButton) {
    return (
      <div>
        <button onClick={handleGetEvent}>Display Event Body</button>
        <pre id="json">{JSON.stringify(eventBody, null, "\t")}</pre>
        <button onClick={handleMergeAvailabilities}>
          Display Merged Availabilities
        </button>
        <pre id="json">{JSON.stringify(mergedAvailabilities, null, "\t")}</pre>
      </div>
    );
  } else {
    return (
      <div>
        <button onClick={handleGetEvent}>Display Event Body</button>
        <pre id="json">{JSON.stringify(eventBody, null, "\t")}</pre>
      </div>
    );
  }
}
