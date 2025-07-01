import axios from 'axios';
import config from '../config/env.js';

// Create an axios instance with common configurations
const apiClient = axios.create({
  baseURL: config.API_BASE_URL,
  withCredentials: true,
  timeout: config.API_TIMEOUT,
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  }
});

// Add request interceptor to include auth token in all requests
apiClient.interceptors.request.use(
  (requestConfig) => {
    const token = localStorage.getItem(`${config.STORAGE_PREFIX}token`);
    if (token) {
      requestConfig.headers.Authorization = `Bearer ${token}`;
      // Debug: Log token being sent
      console.log('🎫 Sending request with token:', token.substring(0, 20) + '...');
      console.log('🎯 Request URL:', requestConfig.url);
    } else {
      console.warn('⚠️ No token found for request to:', requestConfig.url);
    }
    return requestConfig;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle errors
apiClient.interceptors.response.use(
  (response) => {
    const contentType = response.headers['content-type'];
    if (contentType && contentType.includes('text/html')) {
      return Promise.reject(new Error('Received HTML instead of JSON. You might need to log in again.'));
    }
    return response;
  },
  (error) => {
    // Log detailed error information for 403 errors
    if (error.response?.status === 403) {
      console.error('🚫 403 Forbidden Error Details:');
      console.error('URL:', error.config?.url);
      console.error('Headers:', error.config?.headers);
      console.error('Response:', error.response?.data);
      
      // Check if user data exists
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      console.error('Current User:', currentUser);
      console.error('User Roles:', currentUser.roles);
    }
    return Promise.reject(error);
  }
);

const userService = {
  // Get all users with pagination and filters
  getAllUsers: async (params = {}) => {
    try {
      console.log('🔍 Trying to fetch all users for admin...');
      
      // Verify user has proper role before making request
      const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
      const token = localStorage.getItem('token');
      
      console.log('👤 Current user roles:', currentUser.roles);
      console.log('🎫 Token exists:', !!token);
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      // Check if user has super_admin role
      const isSuperAdmin = currentUser.roles && currentUser.roles.includes('super_admin');
      
      if (!isSuperAdmin) {
        throw new Error('Access denied. Only super administrators can view user management.');
      }
      
      const queryParams = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 50,
        ...(params.search && { search: params.search }),
        // Add filter to exclude citizens
        excludeRoles: 'citizen'
      });
      
      const response = await apiClient.get(`/users?${queryParams}`);
      
      console.log('✅ Users fetched successfully:', response.data);
      return response.data;
      
    } catch (error) {
      console.error('❌ Error fetching users:', error);
      
      // Enhanced error handling for 403/401
      if (error.response?.status === 403 || error.response?.status === 401) {
        console.error('🚫 Access denied - insufficient permissions');
        throw new Error('Access denied. Only super administrators can manage users.');
      }
      
      throw error;
    }
  },

  // Add a method to test authentication
  testAuth: async () => {
    try {
      const response = await apiClient.get('/users/profile');
      console.log('✅ Authentication test successful:', response.data);
      return { success: true, user: response.data };
    } catch (error) {
      console.error('❌ Authentication test failed:', error.response?.status, error.response?.data);
      return { success: false, error: error.response?.data };
    }
  },

  // Get user by ID
  getUserById: async (userId) => {
    try {
      const response = await apiClient.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error getting user ${userId}:`, error);
      
      // Fallback to localStorage
      const localUsers = JSON.parse(localStorage.getItem('users') || '[]');
      const user = localUsers.find(u => u.id === userId);
      if (user) {
        return user;
      }
      
      throw error;
    }
  },

  // Admin update user
  updateUser: async (userId, userData) => {
    try {
      const response = await apiClient.patch(`/users/${userId}`, userData);
      
      // Also update localStorage
      try {
        const localUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const index = localUsers.findIndex(u => u.id === userId);
        if (index >= 0) {
          localUsers[index] = { ...localUsers[index], ...userData };
          localStorage.setItem('users', JSON.stringify(localUsers));
        }
      } catch (localErr) {
        console.warn('Failed to update localStorage:', localErr);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error updating user ${userId}:`, error);
      
      // Update localStorage even if API fails
      try {
        const localUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const index = localUsers.findIndex(u => u.id === userId);
        if (index >= 0) {
          localUsers[index] = { ...localUsers[index], ...userData };
          localStorage.setItem('users', JSON.stringify(localUsers));
          return localUsers[index];
        }
      } catch (localErr) {
        console.warn('Failed to update localStorage:', localErr);
      }
      
      throw error;
    }
  },

  // Update user status (activate/deactivate)
  updateUserStatus: async (userId, isActive) => {
    try {
      const response = await apiClient.patch(`/users/${userId}/status`, { isActive });
      
      // Also update localStorage
      try {
        const localUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const index = localUsers.findIndex(u => u.id === userId);
        if (index >= 0) {
          localUsers[index].isActive = isActive;
          localUsers[index].status = isActive ? 'Logged In' : 'Not Logged In';
          localStorage.setItem('users', JSON.stringify(localUsers));
        }
      } catch (localErr) {
        console.warn('Failed to update localStorage:', localErr);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error updating user status ${userId}:`, error);
      
      // Update localStorage even if API fails
      try {
        const localUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const index = localUsers.findIndex(u => u.id === userId);
        if (index >= 0) {
          localUsers[index].isActive = isActive;
          localUsers[index].status = isActive ? 'Logged In' : 'Not Logged In';
          localStorage.setItem('users', JSON.stringify(localUsers));
          return localUsers[index];
        }
      } catch (localErr) {
        console.warn('Failed to update localStorage:', localErr);
      }
      
      throw error;
    }
  },

  // Delete user
  deleteUser: async (userId) => {
    try {
      const response = await apiClient.delete(`/users/${userId}`);
      
      // Also delete from localStorage
      try {
        const localUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const filteredUsers = localUsers.filter(u => u.id !== userId);
        localStorage.setItem('users', JSON.stringify(filteredUsers));
      } catch (localErr) {
        console.warn('Failed to update localStorage:', localErr);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error deleting user ${userId}:`, error);
      throw error;
    }
  },

  // Get user statistics
  getUserStats: async () => {
    try {
      const response = await apiClient.get('/users/stats');
      return response.data;
    } catch (error) {
      console.error('Error getting user stats:', error);
      
      // Fallback to localStorage-based stats
      try {
        const localUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const stats = {
          totalUsers: localUsers.length,
          activeUsers: localUsers.filter(u => u.isActive !== false).length,
          inactiveUsers: localUsers.filter(u => u.isActive === false).length,
          usersByRole: [],
          recentUsers: localUsers.slice(-5) // Last 5 users
        };
        return stats;
      } catch (localErr) {
        console.warn('Failed to generate localStorage stats:', localErr);
        throw error;
      }
    }
  },

  // Register new user (admin creates user)
  createUser: async (userData) => {
    try {
      console.log('🔧 Creating user with userService:', userData);
      
      // Check if this is an admin-created user (has roleIds)
      if (userData.roleIds && userData.roleIds.length > 0) {
        console.log('🔑 Using admin user creation endpoint');
        
        // Use admin endpoint for user creation with role assignment
        const response = await apiClient.post('/users/admin-create', {
          email: userData.email,
          username: userData.username,
          firstName: userData.firstName,
          middleName: userData.middleName,
          lastName: userData.lastName,
          nameExtension: userData.nameExtension,
          contactNumber: userData.contactNumber,
          name: userData.name, // Include the generated full name
          password: userData.password,
          roleIds: userData.roleIds,
          defaultRoleId: userData.defaultRoleId
        });
        
        console.log('✅ Admin user creation successful:', response.data);
        
        // Update localStorage with the new user
        try {
          const localUsers = JSON.parse(localStorage.getItem('users') || '[]');
          const newUser = {
            id: response.data.id,
            name: userData.name,
            username: userData.username,
            email: userData.email,
            contact: userData.contactNumber,
            status: 'Not Logged In',
            roles: response.data.roles || [userData.role],
            isActive: true,
            firstName: userData.firstName,
            lastName: userData.lastName,
            middleName: userData.middleName,
            nameExtension: userData.nameExtension
          };
          localUsers.push(newUser);
          localStorage.setItem('users', JSON.stringify(localUsers));
        } catch (localErr) {
          console.warn('Failed to update localStorage:', localErr);
        }
        
        return response.data;
      } else {
        console.log('👥 Using regular citizen registration endpoint');
        
        // Use regular registration endpoint for citizen users
        const response = await apiClient.post('/auth/register', {
          email: userData.email,
          username: userData.username,
          firstName: userData.firstName,
          middleName: userData.middleName,
          lastName: userData.lastName,
          nameExtension: userData.nameExtension,
          contactNumber: userData.contactNumber,
          name: userData.name,
          password: userData.password
        });
        
        console.log('✅ Regular user creation successful:', response.data);
        return response.data;
      }
    } catch (error) {
      console.error('❌ Error creating user:', error);
      throw error;
    }
  },

  // Admin update any user
  adminUpdateUser: async (userId, userData) => {
    try {
      const response = await apiClient.post(`/auth/admin/update-user/${userId}`, userData);
      
      // Also update localStorage
      try {
        const localUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const index = localUsers.findIndex(u => u.id === userId);
        if (index >= 0) {
          localUsers[index] = { ...localUsers[index], ...userData };
          localStorage.setItem('users', JSON.stringify(localUsers));
        }
      } catch (localErr) {
        console.warn('Failed to update localStorage:', localErr);
      }
      
      return response.data;
    } catch (error) {
      console.error(`Error admin updating user ${userId}:`, error);
      
      // Update localStorage even if API fails
      try {
        const localUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const index = localUsers.findIndex(u => u.id === userId);
        if (index >= 0) {
          localUsers[index] = { ...localUsers[index], ...userData };
          localStorage.setItem('users', JSON.stringify(localUsers));
          return localUsers[index];
        }
      } catch (localErr) {
        console.warn('Failed to update localStorage:', localErr);
      }
      
      throw error;
    }
  },

  // Search users
  searchUsers: async (query) => {
    try {
      const response = await apiClient.get(`/users?search=${encodeURIComponent(query)}`);
      return response.data;
    } catch (error) {
      console.error('Error searching users:', error);
      
      // Fallback to localStorage search
      try {
        const localUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const filteredUsers = localUsers.filter(user => 
          user.name?.toLowerCase().includes(query.toLowerCase()) ||
          user.email?.toLowerCase().includes(query.toLowerCase()) ||
          user.username?.toLowerCase().includes(query.toLowerCase())
        );
        
        return {
          users: filteredUsers,
          total: filteredUsers.length,
          page: 1,
          limit: filteredUsers.length,
          totalPages: 1
        };
      } catch (localErr) {
        console.warn('Failed to search localStorage:', localErr);
        throw error;
      }
    }
  }
};

export default userService;