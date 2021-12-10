import AuthenticatedApp from "./AuthenticatedApp";
import UnauthenticatedApp from "./UnauthenticatedApp";
import { useAuth } from "../contexts/AuthContext";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import CreateLinkPage from "./CreateLinkPage";

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
        <Route
          exact
          path="/app/authorized/createlink"
          component={CreateLinkPage}
        />
        <Redirect from="/app" to="/app/unauthorized" />
      </Switch>
    </BrowserRouter>
  );
}
