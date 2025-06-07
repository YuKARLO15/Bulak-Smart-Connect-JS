import axios from 'axios';

// Create an axios instance with common configurations (same as documentApplicationService)
const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '/api',
  withCredentials: true, // Include cookies in requests if needed
  timeout: 15000, // 15 second timeout
  headers: {
    'Accept': 'application/json'
  }
});

// Add request interceptor to include auth token in all requests
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to check if the response is actually JSON
apiClient.interceptors.response.use(
  (response) => {
    // Check if response is HTML instead of JSON
    const contentType = response.headers['content-type'];
    if (contentType && contentType.includes('text/html')) {
      return Promise.reject(new Error('Received HTML instead of JSON. You might need to log in again.'));
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const userService = {
  // Get all users with pagination and filters
  getAllUsers: async (params = {}) => {
    try {
      console.log('Trying to fetch all users for admin...');
      
      const queryParams = new URLSearchParams({
        page: params.page || 1,
        limit: params.limit || 50,
        ...(params.search && { search: params.search }),
        ...(params.role && { role: params.role }),
      });
      
      // First, try to get data from backend
      try {
        const response = await apiClient.get(`/users?${queryParams}`);
        
        // Verify the response has users array
        if (response.data && Array.isArray(response.data.users)) {
          console.log(`Fetched ${response.data.users.length} users from API`);
          return response.data;
        } else {
          console.warn('API response format unexpected:', response.data);
          throw new Error('Invalid API response format');
        }
      } catch (apiError) {
        console.warn('Users API call failed:', apiError.message);
        
        // Fallback to localStorage
        console.log('Falling back to localStorage for users...');
        const localUsers = JSON.parse(localStorage.getItem('users') || '[]');
        
        if (Array.isArray(localUsers) && localUsers.length > 0) {
          console.log(`Found ${localUsers.length} users in localStorage`);
          // Transform to match API response format
          return {
            users: localUsers,
            total: localUsers.length,
            page: 1,
            limit: localUsers.length,
            totalPages: 1
          };
        } else {
          console.warn('No users found in localStorage');
          return {
            users: [],
            total: 0,
            page: 1,
            limit: 50,
            totalPages: 0
          };
        }
      }
    } catch (error) {
      console.error('Error in getAllUsers:', error);
      return {
        users: [],
        total: 0,
        page: 1,
        limit: 50,
        totalPages: 0
      };
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
      const response = await apiClient.post('/auth/register', userData);
      
      // Also add to localStorage
      try {
        const localUsers = JSON.parse(localStorage.getItem('users') || '[]');
        const newUser = {
          id: Date.now(), // Temporary ID for localStorage
          name: `${userData.firstName} ${userData.lastName}`,
          username: userData.username || 'N/A',
          email: userData.email,
          contact: userData.contactNumber || 'N/A',
          status: 'Not Logged In',
          roles: userData.roleIds ? ['citizen'] : userData.roles || ['citizen'], // Default role
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
    } catch (error) {
      console.error('Error creating user:', error);
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