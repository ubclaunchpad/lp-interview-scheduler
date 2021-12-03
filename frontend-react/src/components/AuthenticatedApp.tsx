import "../App.css";
import { Link } from "react-router-dom";
import Logout from "./Logout";
import { momentLocalizer } from "react-big-calendar";
import moment from "moment";
import InterviewerCalendar from "./InterviewerCalendar";

export default function AuthenticatedApp() {
  return (
    <div className="App">
      woo hoo, you're authenticated now !
      <Logout />
      <Link to="/app/authorized/createlink">
        <button>goto create interview link</button>
      </Link>
      <InterviewerCalendar localizer={momentLocalizer(moment)} />
    </div>
  );
}
