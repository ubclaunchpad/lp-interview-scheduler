import AdminApp from "./components/AdminApp";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import "./App.css";
import LandingPage from "./components/LandingPage";
import BookingPage from "./components/BookingPage";
import Navbar from "./components/Navbar";
import React from "react";

function App() {
  const [isLoading, setIsLoading] = React.useState(false);
  
  const onLoadingStart = () => {
    setIsLoading(true);
  };

  const onLoadingEnd = () => {
    setIsLoading(false);
  };

  return (
    <div className="App">
      <BrowserRouter>
          
        <Switch>
          <Route exact path="/" render={() => 
            <>
              <Navbar isLoading={isLoading}/>
              <LandingPage/>
            </>
          }/>
          <Route path="/app" render={() => 
            <>
              <Navbar isLoading={isLoading}/>
              <AdminApp isLoading={isLoading} onLoadingStart={onLoadingStart} onLoadingEnd={onLoadingEnd} />
            </>
          }/>
          <Route path="/test" component={BookingPage} />
        </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
