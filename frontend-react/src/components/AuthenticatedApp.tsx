import "../App.css";
import Logout from "./Logout";

export default function AuthenticatedApp() {
  return (
    <div className="App">
      woo hoo, you're authenticated now !
      <Logout />
    </div>
  );
}
