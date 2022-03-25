import { useLocation } from "react-router-dom";
import React, { useState } from "react";
import InterviewTimePicker from "./booking/InterviewTimePicker";
import moment, { Moment } from "moment";

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
  const [confirmedTime, setConfirmedTime] = useState("");
  const [blockLength, setBlockLength] = useState(0);
  const [eventDuration, setEventDuration] = useState(0 as number);

  const { search } = useLocation();
  const params = new URLSearchParams(search);

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
      return data;
    } catch (e) {
      alert("Something went wrong with get Event request");
    }
  }

  // Call get request with lead IDs from event body and return merged availabilities
  async function handleEventData(eventBody: any) {
    try {
      const leads: string[] = eventBody.leads.map((interviewer: any) => {
        return interviewer.leadUID;
      });
      
      setEventDuration(parseInt(eventBody.eventLengthInMinutes));
      setLeadUIDs(leads);

      let queryString = linkPrefix + `availabilities/mergeMultiple/?organization=${organization}`;
      leads.forEach((interviewerUID) => {
        queryString += `&interviewerUID=${interviewerUID}`
      });

      const response = await fetch(queryString);

      if (!response.ok) {
        alert("Merged availability request failed");
      }
      const data = await response.json();
      setAvailabilities(data);
      setBlockLength(data[0].durationMins);

    } catch (e) {
      console.log(e);
      alert("Something went wrong with merged availability request");
    }
  }

  const apiAvailsToMoments = (avails: APIAvailability[]) => {
    return avails.map((a) => moment(a.startTime));
  };

  const filterAvails = (avails: APIAvailability[]) => {
    let allMoments: Moment[] = avails.map((a) => moment(a.startTime));
    const blocks = eventDuration / blockLength;

    // sort moments, exclude end, then filter for start times that have enough subsequent slots to fill duration 
    return allMoments.sort((first,second) => {
      return first.diff(second);
    }).slice(0, allMoments.length - blocks + 1).filter((moment, index) => {
      for (let i = 1; i < blocks; i++) {
        if (allMoments[index + i].diff(moment, 'minutes') > eventDuration) {
          return false;
        }
      }
      return true;
    });
  }

  React.useEffect(() => {
    if (params.has("eventUID") && params.has("organization")) {
      handleGetEvent().then((data) => handleEventData(data));
    }
  }, []);

  const bookSlot = (slots: Moment[]) => {
    fetch(linkPrefix + "events", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        organization: organization,
        eventUID: eventUID,
        leadUIDs: leadUIDs,
        times: slots.map(slot => slot.format("YYYY-MM-DDTHH:mm:ssZ"))
      }),
    }).then((res) => {
      if (res.status == 200) {
        setConfirmedTime(slots[0].toString());
        window.alert(
          "You have successfully booked an interview for " + slots[0].format("LLLL")
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
      </div>
    );
  } else {
    return (
      <div>
        <InterviewTimePicker
          allAvailabilities={apiAvailsToMoments(mergedAvailabilities)}
          validAvailabilities={filterAvails(mergedAvailabilities)}
          onBook={bookSlot}
          eventDuration = {eventDuration}
          blockLength = {blockLength}
        ></InterviewTimePicker>
      </div>
    );
  }
}
