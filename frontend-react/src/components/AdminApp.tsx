import AuthenticatedApp from "./AuthenticatedApp";
import UnauthenticatedApp from "./UnauthenticatedApp";
import { useAuth } from "../contexts/AuthContext";
import { Redirect, Route, Switch } from "react-router-dom";
import CreateLinkPage from "./CreateLinkPage";
import Navbar from "./Navbar";

interface Props {
  isLoading: boolean;
  onLoadingStart: ()=>void;
  onLoadingEnd: ()=>void;
}
export default function AdminApp(props: Props) {
  const { user } = useAuth();

  return (
    <div>
      {/* <Navbar isLoading={props.isLoading}/> */}
      <Switch>
      <Route exact path="/app/unauthorized">
        {user ? <Redirect to="/app/authorized" /> : <UnauthenticatedApp />}
      </Route>
      <Route exact path="/app/authorized">
        {user ? <AuthenticatedApp 
                  isLoading={props.isLoading} 
                  onLoadingStart={props.onLoadingStart} 
                  onLoadingEnd={props.onLoadingEnd}
                /> : 
                <Redirect to="/app/unauthorized" />}
      </Route>
      <Route exact path="/app/createlink">
        {user ? <CreateLinkPage /> : <Redirect to="/app/unauthorized" />}
      </Route>
      <Redirect from="/app" to="/app/unauthorized" />
      </Switch>
    </div>
  );
}
