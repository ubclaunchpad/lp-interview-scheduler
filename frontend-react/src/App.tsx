import AdminApp from "./components/AdminApp";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.css";
import LandingPage from "./components/LandingPage";

function App() {
  return (
    <div className="App">
      <BrowserRouter>
        <Switch>
          <Route exact path="/" component={LandingPage} />
          <Route path="/app" component={AdminApp} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
