import {
  onAuthStateChanged,
  signInWithRedirect,
  signOut,
  User,
} from "@firebase/auth";
import React, { useContext, useEffect, useState } from "react";
import { auth, googleAuthProvider } from "../firebase";

interface AuthProviderProps {
  children: React.ReactElement;
}

interface AuthContextValue {
  login: () => Promise<any>;
  logout: () => Promise<any>;
  user: User | undefined;
}

const AuthContext = React.createContext({} as AuthContextValue);

export function AuthProvider(props: AuthProviderProps) {
  const { children } = props;

  const [user, setUser] = useState<User>();
  const [loading, setLoading] = useState(true);

  const login = () => {
    return signInWithRedirect(auth, googleAuthProvider);
  };
  const logout = () => {
    return signOut(auth);
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUser(user);
        console.log("logging in");
        await fetch("http://localhost:8080/v1/interviewers", {
          method: "POST",
          mode: "cors",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            organization: "launchpad",
            interviewerUID: user.uid,
            email: user.email,
            name: user.displayName,
          }),
        });
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value: AuthContextValue = {
    login,
    logout,
    user,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
