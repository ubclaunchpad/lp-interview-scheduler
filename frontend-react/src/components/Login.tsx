import { useAuth } from "../contexts/AuthContext";
import "../App.css";

export default function Login() {
  const { login } = useAuth();

  const onLoginClick = async () => {
    await login();
  };

  return (
    <div>
      <button className="cta-button" onClick={onLoginClick}>
        login
      </button>
    </div>
  );
}
