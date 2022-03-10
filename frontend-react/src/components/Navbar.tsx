import React from "react";
import "../App.css";
import styles from "./styles/Navbar.module.css";
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
    <div className={styles.topNavbar}>
      <div className="logo">
        <img src={LaunchpadLogo} alt="Launchpad Logo" />
      </div>
      <nav className={styles.navbarItems}>
        {user && (
          <div className={styles.navbarTabs}>
            <NavLink
              to="/app/authorized"
              className={(isActive) =>
                !isActive ? styles.navbarLinks : styles.navbarLinksActive
              }
            >
              Availabilities
            </NavLink>
            <NavLink
              to="/app/createlink"
              className={(isActive) =>
                !isActive ? styles.navbarLinks : styles.navbarLinksActive
              }
            >
              Schedule
            </NavLink>
          </div>
        )}
        <div>
          <button
            className={styles.accountButton}
            onClick={() => setOpen(!open)}
          >
            Account
          </button>
          {open && (
            <ul className={styles.dropdownContent}>
              <li className={styles.dropdownItem} onClick={onLogoutClick}>
                Logout
              </li>
            </ul>
          )}
        </div>
      </nav>
    </div>
  );
}
