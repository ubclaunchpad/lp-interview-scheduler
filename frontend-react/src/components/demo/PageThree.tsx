import { useLocation } from "react-router-dom";
import React from "react";

const linkPrefix = "http://localhost:8080/v1/";
type MyState = {
  eventBody: string;
  mergedAvailabilities: string;
};

export default class PageThree extends React.Component<MyState> {
  state: MyState = {
    eventBody: "",
    mergedAvailabilities: "",
  };

  render() {
    const { search } = useLocation();
    const params = new URLSearchParams(search);

    if (!params.has("eventUID") || !params.has("organization")) {
      return <h1>Error - Missing requisite query parameters!!</h1>;
    }

    const organization = params.get("organization");
    const eventUID = params.get("eventUID");

    // Call get request with event ID and return event body
    async function getEvent() {
      try {
        const response = await fetch(
          linkPrefix +
            `events/?organization=${organization}&eventUID=${eventUID}`
        );
        if (!response.ok) {
          alert("Get Event request failed");
        }
        const data = await response.json();
        console.log(data);
      } catch (e) {
        alert("Something went wrong with get Event request");
      }
    }

    // Call get request with lead IDs from event body and return merged availabilities
    async function mergeAvailabilities() {}

    getEvent();
    return <h1>TEST</h1>;
  }
}
