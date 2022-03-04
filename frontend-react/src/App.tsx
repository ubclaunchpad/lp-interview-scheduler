import AdminApp from "./components/AdminApp";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.css";
import LandingPage from "./components/LandingPage";
import BookingPage from "./components/BookingPage";

function App() {
  return (
    <div className="App">
      <div className="top-navbar">
        <div>logo</div>
        <ul className="navbar-tabs">
          <li>
            <a className="navbar-links" href="/">
              Availabilities
            </a>
          </li>
          <li>
            <a className="navbar-links" href="/">
              Bookings
            </a>
          </li>
        </ul>
        <div>account</div>
      </div>
      <div className="body">
        <BrowserRouter>
          <Switch>
            <Route exact path="/" component={LandingPage} />
            <Route path="/test" component={BookingPage} />
            <Route path="/app" component={AdminApp} />
          </Switch>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
