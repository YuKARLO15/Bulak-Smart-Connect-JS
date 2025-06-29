import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';
import config from '../config/env.js';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateSuccess, setUpdateSuccess] = useState(false); // For profile updates

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
        const response = await axios.get(`${config.API_BASE_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        
        console.log("Profile response:", response.data);
        
        // Process the user data to ensure it has an id
        const userData = response.data;
        const processedUser = {
          ...userData,
          id: userData.id || userData._id || userData.userId || null
        };
        
        setUser(processedUser);
        setIsAuthenticated(true);

        // Store user in localStorage during auth check too
        localStorage.setItem('currentUser', JSON.stringify(processedUser));
      } catch (err) {
        console.error('Auth check failed:', err);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (emailOrUsername, password, loginType = 'email') => {
    try {
      // Create payload based on login type
      const payload = { 
        password,
        emailOrUsername: emailOrUsername // Backend expects a single field
      };

      console.log(`Attempting login with ${loginType}:`, emailOrUsername);
      
      const response = await axios.post(`${config.API_BASE_URL}/auth/login`, payload);

      // New logging for backend response
      console.log("Backend auth response:", response.data); //Debugging line
      console.log("User object from backend:", response.data.user); //Debugging line

      const { access_token, user: userData } = response.data;
      
      // Process user data
      const processedUser = {
        ...userData,
        id: userData.id || userData._id || userData.userId || null
      };

      // Store token AND user data in localStorage
      localStorage.setItem('token', access_token);
      localStorage.setItem('currentUser', JSON.stringify(processedUser)); // Add this line

      // Process roles - ensure we extract role names correctly
      //if (user.roles) {
        //user.roleNames = user.roles.map(role => role.name);
      //} else {
        //user.roleNames = user.defaultRole ? [user.defaultRole.name] : [];
      //} Tempoarily commented out to avoid errors


      setUser(processedUser);
      setIsAuthenticated(true);
      return { success: true, user: processedUser };
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
  // Get current user ID
  // This function returns the user ID from the user object
  const getCurrentUserId = () => {
    return user?.id || user?._id || null;
  };

  // Update user profile (for citizens)
  const updateProfile = async (profileData) => {
    setError(null);
    setUpdateSuccess(false);
    
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication required');
      return { success: false, error: 'Authentication required' };
    }
    
    try {
      const response = await axios.post(
        `${config.API_BASE_URL}/auth/update-profile`,
        profileData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      // Update user state and localStorage
      const updatedUserData = response.data;
      setUser(updatedUserData);
      localStorage.setItem('currentUser', JSON.stringify(updatedUserData));
      setUpdateSuccess(true);
      
      return { success: true, user: updatedUserData };
    } catch (err) {
      console.error('Profile update error:', err);
      const errorMsg = err.response?.data?.message || 'Profile update failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };
  
  // Admin update user (for admins)
  const adminUpdateUser = async (targetUserId, userData) => {
    setError(null);
    setUpdateSuccess(false);
    
    // Verify the current user is an admin
    if (!hasRole('admin') && !hasRole('super_admin')) {
      const errorMsg = 'Insufficient permissions';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
    
    const token = localStorage.getItem('token');
    if (!token) {
      setError('Authentication required');
      return { success: false, error: 'Authentication required' };
    }
    
    try {
      const response = await axios.post(
        `${config.API_BASE_URL}/auth/admin/update-user/${targetUserId}`,
        userData,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      setUpdateSuccess(true);
      return { success: true, user: response.data };
    } catch (err) {
      console.error('Admin user update error:', err);
      const errorMsg = err.response?.data?.message || 'User update failed';
      setError(errorMsg);
      return { success: false, error: errorMsg };
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        loading,
        error,
        updateSuccess,
        login,
        logout,
        updateProfile,
        adminUpdateUser,
        hasRole,
        hasAnyRole,
        getCurrentUserId,
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
