import AdminApp from "./components/AdminApp";
import { BrowserRouter, Route, Switch, Link } from "react-router-dom";
import "./App.css";
import LandingPage from "./components/LandingPage";
import BookingPage from "./components/BookingPage";
import CreateLinkPage from "./components/CreateLinkPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <div className="top-navbar">
          <Link to="/">
            <p>logo</p>
          </Link>
          <ul className="navbar-tabs">
            <Link to="/app/authorized">
              <li className="navbar-links">Availabilities</li>
            </Link>
            <Link to="/app/authorized/createlink">
              <li className="navbar-links">Schedule</li>
            </Link>
            {/* <li>
              <Link to="/booking">
                <p className="navbar-links">Bookings</p>
              </Link>
            </li> */}
            <li>
              <button className="account-dropdown">Account</button>
            </li>
          </ul>
        </div>
        <div className="body">
          <Switch>
            <Route exact path="/" component={LandingPage} />
            <Route path="/test" component={BookingPage} />
            <Route path="/app" component={AdminApp} />
          </Switch>
        </div>
      </BrowserRouter>
    </div>
  );
}

export default App;
