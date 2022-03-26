import React from "react";
import { Link } from "react-router-dom";
import "../App.css";
import { useSetBackgroundImage } from "../hooks/useSetBackground";
import styles from "./styles/LandingPage.module.css";
import Navbar from "./Navbar";
import SocialIcons from "../social-icons.svg";

export default function LandingPage() {
  const [contactInfo, setContactInfo] = React.useState({
    firstName: "" as string,
    lastName: "" as string,
    email: "" as string,
  });

  useSetBackgroundImage("url('/landing-page.svg'");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    let contactInfoData = { ...contactInfo, [event.target.name]: value };
    setContactInfo(contactInfoData);
  };

  const handleSubscribe = (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log("user wants to subscribe");
  };

  return (
    <>
      <Navbar />
      <div className="body">
        <div className={styles.landingBody}>
          <section className={styles.hero}>
            <h1>
              Launch Pad <br />
              Scheduler
            </h1>
          </section>
          <section className={styles.subHero}>
            <h2>subheading</h2>
          </section>
          <section className={styles.landingButtons}>
            <Link to="/app">
              <button id={styles.firstLandingButton} className="cta-button">
                Sign In
              </button>
            </Link>
            <Link to="/app">
              <button className="cta-button">Log In</button>
            </Link>
          </section>
          <section className={styles.whatWeDo}>
            <h1>What We Do</h1>
          </section>
          <section className={styles.ourPartners}>
            <h1>Our Partners</h1>
            {/* replace with function */}
            <div className={styles.partnerInfo}>
              <div>
                <span className={styles.partnerIcon}></span>
                <p>partner name</p>
              </div>
              <div>
                <span className={styles.partnerIcon}></span>
                <p>partner name</p>
              </div>
              <div>
                <span className={styles.partnerIcon}></span>
                <p>partner name</p>
              </div>
              <div>
                <span className={styles.partnerIcon}></span>
                <p>partner name</p>
              </div>
            </div>
          </section>
          <section className={styles.contactUs}>
            <h1>Contact Us</h1>
            <form>
              <div className={styles.contactDetailsContainer}>
                <label className={styles.labelText}>FIRST NAME</label>
                <input
                  type="text"
                  className={styles.contactDetailsInput}
                  name="firstName"
                  value={contactInfo.firstName}
                  onChange={handleChange}
                />
                <label className={styles.labelText}>LAST NAME</label>
                <input
                  type="text"
                  className={styles.contactDetailsInput}
                  name="lastName"
                  value={contactInfo.lastName}
                  onChange={handleChange}
                />
                <label className={styles.labelText}>EMAIL</label>
                <input
                  type="text"
                  className={styles.contactDetailsInput}
                  name="email"
                  value={contactInfo.email}
                  onChange={handleChange}
                />
              </div>
            </form>
          </section>
          <section className={styles.newsletterSubscription}>
            <div className={styles.subscriptionCard}>
              <h2>Subscribe to Our Newsletter</h2>
              <p>dummy text</p>
              <button
                className={styles.subscribeButton}
                onClick={(e) => handleSubscribe(e)}
              >
                Subscribe
              </button>
            </div>
          </section>
          <section className={styles.footer}>
            <hr />
            <img src={SocialIcons} alt="Social Media Icons" />
            <p>Copyright © 2020 UBC Launch Pad</p>
          </section>
        </div>
      </div>
    </>
  );
}
