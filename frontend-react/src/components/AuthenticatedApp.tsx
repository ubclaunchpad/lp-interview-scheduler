import "../App.css";
import Logout from "./Logout";
import { momentLocalizer } from "react-big-calendar";
import moment from "moment";
import InterviewerCalendar from "./InterviewerCalendar";

export default function AuthenticatedApp() {
  return (
    <div className="App">
      woo hoo, you're authenticated now !
      <InterviewerCalendar localizer={momentLocalizer(moment)} />
      <Logout />
    </div>
  );
}
