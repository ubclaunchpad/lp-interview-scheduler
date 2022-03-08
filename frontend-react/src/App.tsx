import React from "react";
import AdminApp from "./components/AdminApp";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.css";
import LandingPage from "./components/LandingPage";
// import BookingPage from "./components/BookingPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={LandingPage} />
          {/* <Route path="/test" component={BookingPage} /> */}
          <Route path="/app" component={AdminApp} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
