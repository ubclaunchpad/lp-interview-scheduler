import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const { login } = useAuth();

  const onLoginClick = async () => {
    await login();
  };

  return (
    <div>
      <button onClick={onLoginClick}>login</button>
    </div>
  );
}
