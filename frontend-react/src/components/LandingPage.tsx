import { Link } from "react-router-dom";
import LaunchpadLogo from "../logo.svg";

export default function LandingPage() {
  return (
    <>
      <div className="top-navbar">
        <div className="logo">
          <img src={LaunchpadLogo} alt="Launchpad Logo" />
        </div>
      </div>
      <div className="body">
        <h1>Welcome to Launchpad's very own Interview Scheduler 🚀</h1>
        <div className="landing-buttons">
          <Link to="/app">
            <button className="cta-button">Admin App</button>
          </Link>
        </div>
      </div>
    </>
  );
}
