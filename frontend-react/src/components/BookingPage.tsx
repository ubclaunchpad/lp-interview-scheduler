import { render } from "@testing-library/react";
import React from "react";
import moment, { Moment } from 'moment';
import Calendar from "./calendar/Calendar";

const titleStyle = {
  display: "flex",
  flexDirection: "row" as "row",
  justifyContent: "center"
}

const buttonStyle = {
  margin: "10px 10px"
}

const listStyle = {
  listStyleType: "none"
}

export default function BookingPage() {
  // TODO: remove hard-coded availabilities
  const availabilities: Map<string, String[]> = new Map<string, string[]>([
    [moment(new Date(2022, 1, 1)).format("yyyy-MM-DD"), ["12:00pm - 1:00pm", "2:00pm - 3:00pm", "7:00pm - 8:00pm"]],
    [moment(new Date(2022, 1, 12)).format("yyyy-MM-DD"), ["2:00pm - 3:00pm", "7:00pm - 8:00pm"]],
    [moment(new Date(2022, 2, 15)).format("yyyy-MM-DD"), ["1:00pm - 2:00pm", "5:00pm - 6:00pm"]],
  ]);

  const [month, setMonth] = React.useState(1);
  const [year, setYear] = React.useState(2022);

  const flip = (direction: number) => {
    // + 12 because TS doesn't do well with negative moduluo
    setMonth((month + direction + 12) % 12);
    if (month + direction < 0) {
        setYear(year - 1);
    } else if (month + direction >= 12) {
        setYear(year + 1);
    } 
  }

  const onDayClick = function(year: number, month: number, day: number) {
    setDisplayAvailabilities(availabilities.get(moment(new Date(year, month, day)).format("yyyy-MM-DD")) as string[]);
  }
  
  const [displayAvailabilities, setDisplayAvailabilities] = React.useState(["Select a date to see availabilities."] as string[]);

  const availList = displayAvailabilities === undefined ? ["No availability"] : displayAvailabilities.map((avail) =>
    <li key={avail}>{avail}</li>
  );

  const highlightDays: number[] = Array.from(availabilities.keys())
    .filter((dateStr) => moment(dateStr).year() === year && moment(dateStr).month() === month)
    .map((dateStr) => moment(dateStr).date());

  return (
    <div>
      <div style={titleStyle}>
          <button style={buttonStyle} onClick={() => flip(-1)}>&lt;</button>
          <p>{moment().month(month).format('MMMM')} {year}</p>
          <button style={buttonStyle} onClick={() => flip(1)}>&gt;</button>
      </div>
      <Calendar onDayClick={onDayClick} highlightDays={highlightDays} year={year} month={month} />
      <ul style={listStyle}>
        {availList}
      </ul>
    </div>
  );

}
