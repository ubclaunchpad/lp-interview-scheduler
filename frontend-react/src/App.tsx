import AdminApp from "./components/AdminApp";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.css";
import LandingPage from "./components/LandingPage";
import BookingPage from "./components/BookingPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route path="/app" component={AdminApp} />
          <Route path="/test" component={BookingPage} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
