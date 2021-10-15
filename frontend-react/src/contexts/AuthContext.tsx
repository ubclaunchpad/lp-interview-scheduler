import { onAuthStateChanged, signInWithRedirect, signOut, User } from '@firebase/auth';
import React, { useContext, useEffect, useState } from 'react'
import { auth, googleAuthProvider } from '../firebase';

interface AuthProviderProps {
    children: React.ReactElement;
}

interface AuthContextValue {
    login: () => Promise<any>,
    logout: () => Promise<any>,
    user: User | undefined,
    loading: boolean
}

const AuthContext = React.createContext({} as AuthContextValue);

export function AuthProvider(props: AuthProviderProps) {
    const {children} = props;

    const [user, setUser] = useState<User>();
    const [loading, setLoading] = useState(true);

    const login = () => {
       return signInWithRedirect(auth, googleAuthProvider);
    };
    const logout = () => {
        return signOut(auth);
    };

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, user => {
            if (user) {
                setUser(user);
                console.log(`user signed in: ${user.email}`)
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value: AuthContextValue = {
        login, 
        logout,
        user,
        loading
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);