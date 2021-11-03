import AuthenticatedApp from "./AuthenticatedApp";
import UnauthenticatedApp from "./UnauthenticatedApp";
import { useAuth } from "../contexts/AuthContext";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";

export default function AdminApp() {
  const { user } = useAuth();
  return (
    <BrowserRouter>
      <Switch>
        <Route exact path="/app/unauthorized">
          {user ? <Redirect to="/app/authorized" /> : <UnauthenticatedApp />}
        </Route>
        <Route exact path="/app/authorized">
          {user ? <AuthenticatedApp /> : <Redirect to="/app/unauthorized" />}
        </Route>
        <Redirect from="/app" to="/app/unauthorized" />
      </Switch>
    </BrowserRouter>
  );
}
