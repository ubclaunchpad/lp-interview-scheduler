import "../App.css";
import styles from "./styles/AuthenticatedApp.module.css";
import { momentLocalizer } from "react-big-calendar";
import moment from "moment";
import InterviewerCalendar from "./InterviewerCalendar";
import { useAuth } from "../contexts/AuthContext";

export default function AuthenticatedApp() {
  const { user } = useAuth();

  return (
    <div className="body">
      <div className={styles.heading}>
        {user?.photoURL && (
          <img className={styles.userProfilePic} src={user.photoURL} alt="" />
        )}
        <h2 className={styles.headingText}>My Availabilities</h2>
      </div>
      <InterviewerCalendar localizer={momentLocalizer(moment)} />
    </div>
  );
}
