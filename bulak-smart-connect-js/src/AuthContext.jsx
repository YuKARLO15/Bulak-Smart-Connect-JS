import React, { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    // Get the initial state from localStorage
    const storedAuthState = localStorage.getItem('isAuthenticated');
    return storedAuthState === 'true';
  });

  const [timeoutId, setTimeoutId] = useState(null);

  const login = () => {
    setIsAuthenticated(true);
    localStorage.setItem('isAuthenticated', 'true');
    startLogoutTimer();
  };

  const logout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('isAuthenticated');
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
  };

  const startLogoutTimer = () => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    const id = setTimeout(() => {
      logout();
      alert('You have been logged out due to inactivity.');
    }, 30 * 60 * 1000); // 30 minutes timeout
    setTimeoutId(id);
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