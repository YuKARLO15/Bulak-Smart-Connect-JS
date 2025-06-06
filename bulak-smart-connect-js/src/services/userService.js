import api from './api';

const userService = {
  // Get all users with pagination and filters
  getAllUsers: async (params = {}) => {
    const queryParams = new URLSearchParams({
      page: params.page || 1,
      limit: params.limit || 50,
      ...(params.search && { search: params.search }),
      ...(params.role && { role: params.role }),
    });
    
    const response = await api.get(`/users?${queryParams}`);
    return response.data;
  },

  // Get user by ID
  getUserById: async (userId) => {
    const response = await api.get(`/users/${userId}`);
    return response.data;
  },

  // Admin update user
  updateUser: async (userId, userData) => {
    const response = await api.patch(`/users/${userId}`, userData);
    return response.data;
  },

  // Update user status (activate/deactivate)
  updateUserStatus: async (userId, isActive) => {
    const response = await api.patch(`/users/${userId}/status`, { isActive });
    return response.data;
  },

  // Delete user
  deleteUser: async (userId) => {
    const response = await api.delete(`/users/${userId}`);
    return response.data;
  },

  // Get user statistics
  getUserStats: async () => {
    const response = await api.get('/users/stats');
    return response.data;
  },

  // Register new user (admin creates user)
  createUser: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },

  // Admin update any user
  adminUpdateUser: async (userId, userData) => {
    const response = await api.post(`/auth/admin/update-user/${userId}`, userData);
    return response.data;
  },

  // Search users
  searchUsers: async (query) => {
    const response = await api.get(`/users?search=${encodeURIComponent(query)}`);
    return response.data;
  }
};

export default userService;