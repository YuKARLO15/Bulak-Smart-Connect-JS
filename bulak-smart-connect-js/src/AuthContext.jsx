import React, { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Check if token exists in localStorage on initial load
    return localStorage.getItem("token") !== null;
  });

  const login = () => {
    setIsAuthenticated(true);
  };

  const logout = () => {
    localStorage.removeItem("token"); // Remove the token
    setIsAuthenticated(false);
  };

  // Auto-logout timer (optional)
  const startLogoutTimer = () => {
    const logoutTime = 60 * 60 * 1000; // 1 hour
    setTimeout(() => {
      logout();
    }, logoutTime);
  };

  useEffect(() => {
    if (isAuthenticated) {
      startLogoutTimer();
    }
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);