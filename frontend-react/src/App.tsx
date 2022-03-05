import AdminApp from "./components/AdminApp";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.css";
import LandingPage from "./components/LandingPage";
import BookingPage from "./components/BookingPage";
import React from "react";

function App() {
  return (
    <div className="App">
      <h1 style={{ color: "white" }}>our main app</h1>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route path="/test" component={BookingPage} />
          <Route path="/app" component={AdminApp} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
