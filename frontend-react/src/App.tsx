import AdminApp from "./components/AdminApp";
import BookingPage from "./components/BookingPage";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.css";
import LandingPage from "./components/LandingPage";
import PageThree from "./components/demo/PageThree";

function App() {
  return (
    <div className="App">
      <h1>our main app</h1>
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route path="/booking" component={BookingPage} />
          <Route path="/app" component={AdminApp} />
          <Route path="/test" component={PageThree} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
