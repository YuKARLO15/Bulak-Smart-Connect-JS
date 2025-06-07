import React, { useState, useEffect } from 'react';
import './AccountManagement.css';
import SearchAddUser from './SearchAdd';
import UserTable from './UserTable';
import { getUsers, updateUserImage } from './NewUserInfo'; // Keep for fallback
import NavBar from '../../NavigationComponents/NavSide';
import userService from '../../services/userService';
import { useAuth } from '../../context/AuthContext';

const AdminAccountManagement = () => {
  const { user: currentUser, hasRole } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Load users from backend with localStorage fallback
  const loadUsers = async (search = '') => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Loading users from API...');
      const response = await userService.getAllUsers({
        page: 1,
        limit: 100,
        search: search.trim()
      });

      // Transform backend data to match your existing component structure
      const transformedUsers = response.users.map(user => ({
        id: user.id,
        name: user.name || `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        username: user.username || 'N/A',
        email: user.email,
        contact: user.contactNumber || 'N/A',
        status: user.isActive ? 'Logged In' : 'Not Logged In',
        roles: Array.isArray(user.roles) ? user.roles : [user.roles || user.defaultRole || 'citizen'],
        image: null, // Keep for your existing image functionality
        firstName: user.firstName,
        lastName: user.lastName,
        middleName: user.middleName,
        nameExtension: user.nameExtension,
        isActive: user.isActive,
        defaultRole: user.defaultRole,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }));

      setUsers(transformedUsers);
      
      // Update localStorage for consistency
      localStorage.setItem('users', JSON.stringify(transformedUsers));
      console.log(`Loaded ${transformedUsers.length} users from API`);
      
    } catch (err) {
      console.error('Error loading users from API:', err);
      setError('Failed to load users from server, using local data');
      
      // Fallback to localStorage
      const localUsers = getUsers();
      setUsers(localUsers);
      console.log(`Fallback: Loaded ${localUsers.length} users from localStorage`);
    } finally {
      setLoading(false);
    }
  };

  // Load users on component mount
  useEffect(() => {
    loadUsers();
  }, []);

  // Handle search
  const handleSearch = (query) => {
    setSearchQuery(query);
    loadUsers(query);
  };

  // Update the UI when localStorage changes (for when coming back from Add User page)
  useEffect(() => {
    const handleStorageChange = () => {
      // Reload from API to get fresh data
      loadUsers(searchQuery);
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [searchQuery]);

  // Handle image upload (keep your existing functionality)
  const handleUpload = (index, file) => {
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      
      // Update local state
      const updatedUsers = [...users];
      updatedUsers[index].image = imageUrl;
      setUsers(updatedUsers);
      
      // Update localStorage
      updateUserImage(index, imageUrl);
    }
  };

  // Handle user removal with backend integration
  const handleRemoveUser = async (userIndex) => {
    const user = users[userIndex];
    
    if (window.confirm('Are you sure you want to remove this user?')) {
      try {
        // Try to remove from backend first
        if (user.id) {
          await userService.deleteUser(user.id);
          console.log(`User ${user.id} deleted from backend`);
        }
        
        // Remove from local state
        const updatedUsers = [...users];
        updatedUsers.splice(userIndex, 1);
        setUsers(updatedUsers);
        
        // Update localStorage
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        
        alert('User removed successfully!');
      } catch (err) {
        console.error('Error removing user:', err);
        
        // Still remove locally if backend fails
        const updatedUsers = [...users];
        updatedUsers.splice(userIndex, 1);
        setUsers(updatedUsers);
        localStorage.setItem('users', JSON.stringify(updatedUsers));
        
        alert('User removed locally (server sync may have failed)');
      }
    }
  };

  return (
    <div className="admin-account-management">
      <h2 className='label-usermanagement'>User Management</h2>
      <NavBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      
      {error && (
        <div style={{
          background: '#fff3cd', 
          color: '#856404', 
          padding: '10px', 
          margin: '10px 20px',
          borderRadius: '4px',
          textAlign: 'center',
          border: '1px solid #ffeaa7'
        }}>
          <strong>Warning:</strong> {error}
        </div>
      )}

      <SearchAddUser onSearch={handleSearch} />
      
      <UserTable 
        users={users} 
        handleUpload={handleUpload}
        removeUser={handleRemoveUser}
        loading={loading}
        onRefresh={() => loadUsers(searchQuery)}
      />
    </div>
  );
};

export default AdminAccountManagement;