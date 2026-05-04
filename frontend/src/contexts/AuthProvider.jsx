import { useEffect, useMemo, useState } from "react";
import { AUTH_STORAGE_KEY, AuthContext } from "./AuthContext";
import authService from "../api/services/authService";

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem(AUTH_STORAGE_KEY);
      return storedUser ? JSON.parse(storedUser) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      return;
    }

    localStorage.removeItem(AUTH_STORAGE_KEY);
  }, [user]);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      signIn: async ({ username, password }) => {
        const data = await authService.login(username, password);
        const nextUser = data.user;

        setUser(nextUser);
        return nextUser;
      },
      signOut: () => setUser(null),
    }),
    [user],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
