import React from "react";
import "../App.css";
import styles from "./styles/Navbar.module.css";
import LaunchpadLogo from "../logo.svg";
import { useAuth } from "../contexts/AuthContext";
import { NavLink } from "react-router-dom";

interface Props {
  isLoading: boolean;
}

export default function Navbar(props: Props) {
  const { logout, user } = useAuth();
  const [open, setOpen] = React.useState(false);
  const [hamburgerOpen, setHamburgerOpen] = React.useState(false);

  const onLogoutClick = async () => {
    if(props.isLoading) {
      const shouldLogOut: boolean = window.confirm(
        "your schedule is being saved. Do you still want to log out?"
        );
      if (!shouldLogOut) return;
    }
    await logout();
    window.location.reload();
  };

  const toggleHamburger = () => {
    setHamburgerOpen(!hamburgerOpen);
  };

  return (
    <div className={styles.topNavbar}>
      <div className="logo">
        <NavLink to="/" exact>
          <img src={LaunchpadLogo} alt="Launchpad Logo" />
        </NavLink>
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
            {!props.isLoading &&
            (<NavLink
              to="/app/createlink"
              className={(isActive) =>
                !isActive ? styles.navbarLinks : styles.navbarLinksActive
              }
            >
              Schedule 
            </NavLink>)
          }
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
      <div className={styles.hamburger} onClick={toggleHamburger}>
        <div className={styles.burger} />
        <div className={styles.burger} />
        <div className={styles.burger} />
        {hamburgerOpen && (
          <nav className={styles.navbarItemsMobile}>
            {user && (
              <div className={styles.navbarTabsMobile}>
                <NavLink
                  to="/app/authorized"
                  className={(isActive) =>
                    !isActive ? styles.navbarLinks : styles.navbarLinksActive
                  }
                >
                  Availabilities
                </NavLink>
                {!props.isLoading && (
                  <NavLink
                    to="/app/createlink"
                    className={(isActive) =>
                      !isActive ? styles.navbarLinks : styles.navbarLinksActive
                    }
                  >
                    Schedule 
                  </NavLink>
                )}
              </div>
            )}
            {/* <ul className={styles.dropƒdownContent}>
              <li className={styles.dropdownItem} onClick={onLogoutClick}>
                Logout
              </li>
            </ul> */}
            <ul>
              <li className={styles.dropdownItem} onClick={onLogoutClick}>
                Logout
              </li>
            </ul>
          </nav>
        )}
      </div>
    </div>
  );
}
