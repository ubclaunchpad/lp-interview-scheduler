import { useAuth } from "../contexts/AuthContext";

export default function Logout() {
  const { logout, user } = useAuth();

  const onLogoutClick = async () => {
    await logout();
    window.location.reload();
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
      }}
    >
      {user && <button onClick={onLogoutClick}>logout</button>}
      {user?.displayName && (
        <div>
          hello <strong>{user.displayName}</strong>
        </div>
      )}
      {user?.email && (
        <div>
          you're signed in with: <strong>{user.email}</strong>
        </div>
      )}
      {user?.photoURL && <img src={user.photoURL} alt="" />}
    </div>
  );
}
