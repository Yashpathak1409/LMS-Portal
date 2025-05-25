import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Sync login state with localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("yashtoken");
    setIsLoggedIn(!!token);
  }, []);

  const login = (token) => {
    localStorage.setItem("yashtoken", token);
    setIsLoggedIn(true);
  };

  const logout = () => {
    localStorage.removeItem("yashtoken");
    setIsLoggedIn(false);
  };

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
