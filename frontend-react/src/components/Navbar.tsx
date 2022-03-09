import React from "react";
import "../App.css";
import LaunchpadLogo from "../logo.svg";
import { useAuth } from "../contexts/AuthContext";
import { NavLink } from "react-router-dom";
import Logout from "./Logout";

export default function Navbar() {
  const { logout, user } = useAuth();
  const [open, setOpen] = React.useState(false);

  const onLogoutClick = async () => {
    await logout();
    window.location.reload();
  };
  return (
    <div className="top-navbar">
      <div className="logo">
        <img src={LaunchpadLogo} alt="Launchpad Logo" />
      </div>
      <nav className="navbar-items">
        {user && (
          <div className="navbar-tabs">
            <NavLink
              to="/app/authorized"
              className={(isActive) =>
                "navbar-links" + (!isActive ? "" : "-active")
              }
            >
              Availabilities
            </NavLink>
            <NavLink
              to="/app/createlink"
              className={(isActive) =>
                "navbar-links" + (!isActive ? "" : "-active")
              }
            >
              Schedule
            </NavLink>
          </div>
        )}
        <div className="account-dropdown">
          <button className="account-button" onClick={() => setOpen(!open)}>
            Account
          </button>
          {open && (
            <ul className="dropdown-content">
              <li className="dropdown-item" onClick={onLogoutClick}>
                Logout
              </li>
            </ul>
          )}
        </div>
      </nav>
    </div>
  );
}
