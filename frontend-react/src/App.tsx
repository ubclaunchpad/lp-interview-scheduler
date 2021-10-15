import "./App.css";
import Login from "./components/Login";
import Logout from "./components/Logout";
import { AuthProvider } from "./contexts/AuthContext";

function App() {
  return (
    <AuthProvider>
      <div className="App">
        <h1>frontend start</h1>
        <Login />
        <Logout />
      </div>
    </AuthProvider>
  );
}

export default App;
