import "../App.css";
import { momentLocalizer } from "react-big-calendar";
import moment from "moment";
import InterviewerCalendar from "./InterviewerCalendar";
import { useAuth } from "../contexts/AuthContext";

export default function AuthenticatedApp() {
  const { user } = useAuth();

  return (
    <div className="body">
      <div className="availabilities-heading">
        {user?.photoURL && (
          <img className="user-profile-pic" src={user.photoURL} alt="" />
        )}
        <h2>My Availabilities</h2>
      </div>
      <InterviewerCalendar localizer={momentLocalizer(moment)} />
    </div>
  );
}
