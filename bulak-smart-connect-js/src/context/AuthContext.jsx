import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Get user profile with roles
        const response = await axios.get('http://localhost:3000/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });

        setUser(response.data);
        setIsAuthenticated(true);
      } catch (err) {
        console.error('Auth check failed:', err);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:3000/auth/login', {
        email,
        password,
      });

      const { access_token, user } = response.data;

      // Store token in localStorage
      localStorage.setItem('token', access_token);

      // Process roles - ensure we extract role names correctly
      //if (user.roles) {
        //user.roleNames = user.roles.map(role => role.name);
      //} else {
        //user.roleNames = user.defaultRole ? [user.defaultRole.name] : [];
      //} Tempoarily commented out to avoid errors

      setUser(user);
      setIsAuthenticated(true);
      return { success: true, user }; // Return both success status and user data
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'Login failed');
      return { success: false };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setIsAuthenticated(false);

    const userId = getCurrentUserId();
  
    // Clear user specific data but leave generic data for backward compatibility
    localStorage.removeItem(`userQueue_${userId}`);
    localStorage.removeItem(`userQueues_${userId}`);

    // Then clear user data
    localStorage.removeItem('currentUser');
  };

  // Role checking utilities
  const hasRole = roleName => {
    if (!user || !user.roles) return false;
    return user.roles.includes(roleName);
  };

  const hasAnyRole = roleNames => {
    if (!roleNames || !roleNames.length) return true;
    return roleNames.some(role => hasRole(role));
  };

  // Auto-logout timer (optional)
  const startLogoutTimer = () => {
    const logoutTime = 60 * 60 * 1000; // 1 hour
    setTimeout(() => {
      logout();
    }, logoutTime);
  };

  // Start logout timer if authenticated
  // This is optional and can be adjusted based on your needs
  // For example, you might want to start the timer when the user logs in
  useEffect(() => {
    if (isAuthenticated) {
      startLogoutTimer();
    }
  }, [isAuthenticated]);

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        error,
        login,
        logout,
        hasRole,
        hasAnyRole,
        isAdmin: hasRole('admin') || hasRole('super_admin'),
        isStaff: hasRole('staff') || hasRole('admin') || hasRole('super_admin'),
        isCitizen: hasRole('citizen'),
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
