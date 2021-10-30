import { Link } from "react-router-dom";

export default function LandingPage() {
  return (
    <div>
      <h1>issa landing page innit</h1>
      <Link to="/booking">
        <button>goto booking</button>
      </Link>
      <Link to="/app">
        <button>goto admin app</button>
      </Link>
    </div>
  );
}
