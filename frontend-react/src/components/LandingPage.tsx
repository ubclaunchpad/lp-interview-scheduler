import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div>
      <h1>Welcome to Launchpad's very own Interview Scheduler 🚀</h1>
      <div className="landing-buttons">
        <Link to="/booking">
          <button>Bookings</button>
        </Link>
        <Link to="/app">
          <button>Admin App</button>
        </Link>
      </div>
    </div>
  );
}
