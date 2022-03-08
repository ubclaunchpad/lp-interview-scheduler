import "../App.css";
import LaunchpadLogo from "../logo.svg";
import { useAuth } from "../contexts/AuthContext";
import { Link } from "react-router-dom";
import Logout from "./Logout";

export default function Navbar() {
  const { logout, user } = useAuth();

  const onLogoutClick = async () => {
    await logout();
    window.location.reload();
  };
  return (
    <div className="top-navbar">
      <div className="logo">
        <img src={LaunchpadLogo} alt="Launchpad Logo" />
      </div>
      <div className="navbar-items">
        {user && (
          <div className="navbar-tabs">
            <Link to="/app/authorized">
              <p className="navbar-links">Availabilities</p>
            </Link>
            <Link to="/app/authorized/createlink">
              <p className="navbar-links">Schedule</p>
            </Link>
          </div>
        )}
        <div className="account-dropdown">
          <button className="dropbtn">Account</button>
          <div className="dropdown-content">
            <button onClick={onLogoutClick}>Logout</button>
          </div>
        </div>
      </div>
    </div>
  );
}
