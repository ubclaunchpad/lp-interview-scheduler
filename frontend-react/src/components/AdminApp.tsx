import AuthenticatedApp from "./AuthenticatedApp";
import UnauthenticatedApp from "./UnauthenticatedApp";
import { useAuth } from "../contexts/AuthContext";
import { Redirect, Route, Switch } from "react-router-dom";
import CreateLinkPage from "./CreateLinkPage";
import Navbar from "./Navbar";

export default function AdminApp() {
  const { user } = useAuth();

  console.log({ user: !!user });
  return (
    <div>
      <Navbar />
      <Switch>
        <Route exact path="/app/unauthorized">
          {!!user ? <Redirect to="/app/authorized" /> : <UnauthenticatedApp />}
        </Route>
        <Route exact path="/app/authorized">
          {user ? <AuthenticatedApp /> : <Redirect to="/app/unauthorized" />}
        </Route>
        <Route exact path="/app/createlink">
          {user ? <CreateLinkPage /> : <Redirect to="/app/unauthorized" />}
        </Route>
        <Redirect from="/app" to="/app/unauthorized" />
      </Switch>
    </div>
  );
}
