import React from "react";
import { Link } from "react-router-dom";
import "../App.css";
import { useSetBackgroundImage } from "../hooks/useSetBackground";
import styles from "./styles/LandingPage.module.css";
import FacebookIcon from "../images/facebook.svg";
import YoutubeIcon from "../images/youtube.svg";
import InstagramIcon from "../images/instagram.svg";

export default function LandingPage() {
  const [contactInfo, setContactInfo] = React.useState({
    name: "" as string,
    email: "" as string,
    message: "" as string,
  });
  const socialMediaLinks = {
    facebook: "https://www.facebook.com/ubclaunchpad/",
    instagram: "https://www.instagram.com/ubclaunchpad/?hl=en",
    youtube: "https://www.youtube.com/channel/UCS0ghlwqTOc1RH_nYENNT5A",
  };

  useSetBackgroundImage("url('/landing-page.svg'");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    let contactInfoData = { ...contactInfo, [event.target.name]: value };
    setContactInfo(contactInfoData);
  };

  const handleSubmit = (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log(contactInfo);
    event.preventDefault();
  };

  // const renderTeamInfo = () => {
  //   const value = event.target.value;
  //   let contactInfoData = { ...contactInfo, [event.target.name]: value };
  //   setContactInfo(contactInfoData);
  // };

  return (
    <>
      <div className="body">
        <div className={styles.landingBody}>
          <section className={styles.hero}>
            <h1>
              Launch Pad <br />
              Scheduler
            </h1>
            <h3>schedule your team interviews with ease</h3>
            <div className={styles.landingButtons}>
              <Link to="/app">
                <button className="cta-button">Log In</button>
              </Link>
            </div>
          </section>
          <section className={styles.valueProposition}>
            <h2>
              Schedule Your Virtual Interview <br /> In Just 3 Steps
            </h2>
            <div className={styles.valuePropSteps}>
              <p>1. add your availabilities to your profile's calendar</p>
              <p>2. choose an interview partner or go solo</p>
              <p>3. create and send a booking link to your candidate</p>
            </div>
            <div className={styles.demoVideo}>
              <iframe
                width="853"
                height="480"
                // src={`https://www.youtube.com/embed/${embedId}`}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title="Embedded youtube"
              />
            </div>
          </section>
          <section className={styles.builtBy}>
            <h1>Built By</h1>
            {/* replace with function */}
            <div className={styles.partnerInfo}>
              <div className={styles.teamMembers}>
                <div className={styles.member}>
                  <span className={styles.memberIcon}></span>
                  <p>
                    Wren Liang <br /> Team Lead
                  </p>
                </div>
                <div className={styles.member}>
                  <span className={styles.memberIcon}></span>
                  <p>
                    Sarah Bornais <br /> Team Lead
                  </p>
                </div>
                <div className={styles.member}>
                  <span className={styles.memberIcon}></span>
                  <p>
                    Aymen Dirar <br /> Software Dev
                  </p>
                </div>
                <div className={styles.member}>
                  <span className={styles.memberIcon}></span>
                  <p>
                    Emily Chen <br /> Software Dev
                  </p>
                </div>
                <div className={styles.member}>
                  <span className={styles.memberIcon}></span>
                  <p>
                    Jin Kim <br /> Software Dev
                  </p>
                </div>
              </div>
              <div className={styles.teamMembers}>
                <div className={styles.member}>
                  <span className={styles.memberIcon}></span>
                  <p>
                    Ryan Moon <br /> Software Dev
                  </p>
                </div>
                <div className={styles.member}>
                  <span className={styles.memberIcon}></span>
                  <p>
                    Ray Han <br /> Software Dev
                  </p>
                </div>
                <div className={styles.member}>
                  <span className={styles.memberIcon}></span>
                  <p>
                    Tricia Cu <br /> Software Dev
                  </p>
                </div>
                <div className={styles.member}>
                  <span className={styles.memberIcon}></span>
                  <p>
                    Aryan Gandhi <br /> Software Dev
                  </p>
                </div>
                <div className={styles.member}>
                  <span className={styles.memberIcon}></span>
                  <p>
                    Rissa Chua <br /> Designer
                  </p>
                </div>
              </div>
            </div>
          </section>
          <section className={styles.contactUs}>
            <h1>Contact Us</h1>
            <form>
              <div className={styles.contactDetailsContainer}>
                <label className={styles.labelText}>NAME</label>
                <input
                  type="text"
                  className={styles.contactDetailsInput}
                  name="name"
                  value={contactInfo.name}
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
                <label className={styles.labelText}>MESSAGE</label>
                <input
                  type="text"
                  className={styles.contactDetailsInput}
                  name="message"
                  value={contactInfo.message}
                  onChange={handleChange}
                />
              </div>
              <button onClick={handleSubmit}>Send</button>
            </form>
          </section>
          <section className={styles.footer}>
            <hr />
            <div className={styles.socialIcons}>
              <a href={socialMediaLinks.facebook}>
                <img src={FacebookIcon} alt="Facebook" />
              </a>
              <a href={socialMediaLinks.instagram}>
                <img src={InstagramIcon} alt="Instagram" />
              </a>
              <a href={socialMediaLinks.youtube}>
                <img src={YoutubeIcon} alt="Youtube" />
              </a>
            </div>
            <p>Copyright © 2020 UBC Launch Pad</p>
          </section>
        </div>
      </div>
    </>
  );
}
