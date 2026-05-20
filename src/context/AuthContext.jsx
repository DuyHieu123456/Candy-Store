import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

const TOKEN_KEY = "candy_store_token";
const USER_KEY  = "candy_store_user";

const loadUser = () => {
  try {
    const raw = localStorage.getItem(USER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(loadUser);

  const login = (userData, token) => {
    setUser(userData);
    localStorage.setItem(USER_KEY, JSON.stringify(userData));
    if (token) localStorage.setItem(TOKEN_KEY, token);
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(TOKEN_KEY);
  };

  const isAuthenticated = !!user;
  const isAdmin         = user?.role === "admin";
  const token           = localStorage.getItem(TOKEN_KEY);

  return (
    <AuthContext.Provider value={{ user, token, login, logout, isAuthenticated, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuthContext must be used within AuthProvider");
  return ctx;
};
