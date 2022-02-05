import { render } from "@testing-library/react";
import React from "react";
import moment from 'moment';
import Calendar from "./calendar/Calendar";

const listStyle = {
  listStyleType: "none"
}

export default function BookingPage() {
  const onDayClick = function(i: number) {
    setDisplayAvailabilities(availabilities.get(i) as string[]);
  }

  const availabilities: Map<number, String[]> = new Map<number, string[]>([
    [1, ["12:00pm - 1:00pm", "2:00pm - 3:00pm", "7:00pm - 8:00pm"]],
    [12, ["2:00pm - 3:00pm", "7:00pm - 8:00pm"]]
  ]);

  const [displayAvailabilities, setDisplayAvailabilities] = React.useState(["Select a date to see availabilities."] as string[]);

  const listItems = displayAvailabilities === undefined ? ["No availability"] : displayAvailabilities.map((avail) =>
    <li key={avail}>{avail}</li>
  );

  const highlightDays: number[] = Array.from(availabilities.keys());

  return (
    <div>
      <Calendar onDayClick={onDayClick} highlightDays={highlightDays} />
      <ul style={listStyle}>
        {listItems}
      </ul>
    </div>
  );

}
