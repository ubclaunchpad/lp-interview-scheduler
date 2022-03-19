import "../App.css";
import Login from "./Login";

export default function UnauthenticatedApp() {
  return (
    <>
      <div className="top-navbar"></div>
      <div className="body">
        <h2>hey, it seems that you're not logged in right now</h2>
        <Login />
      </div>
    </>
  );
}
