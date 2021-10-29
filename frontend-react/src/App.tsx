import React from "react";
import "./App.css";
import { momentLocalizer } from "react-big-calendar";
import moment from "moment";
import InterviewerCalendar from "./InterviewerCalendar";

function App() {
  return (
    <div className="App">
      <h1>frontend start</h1>
      <InterviewerCalendar localizer={momentLocalizer(moment)} />
    </div>
  );
}

export default App;
