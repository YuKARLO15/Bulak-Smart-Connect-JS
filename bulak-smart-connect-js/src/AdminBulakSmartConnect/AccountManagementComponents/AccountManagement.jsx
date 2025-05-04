import React, { useState, useEffect } from 'react';
import './AccountManagement.css';
import SearchAddUser from './SearchAdd';
import UserTable from './UserTable';
import { getUsers, updateUserImage } from './NewUserInfo'; // Import functions from newuser.js

const AdminAccountManagement = () => {
  const [users, setUsers] = useState([]);
  
  // Load users on component mount and when users change
  useEffect(() => {
    setUsers(getUsers());
  }, []);
  
  // Update the UI when localStorage changes (for when coming back from Add User page)
  useEffect(() => {
    const handleStorageChange = () => {
      setUsers(getUsers());
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const handleUpload = (index, file) => {
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      // Update image in localStorage
      const success = updateUserImage(index, imageUrl);
      
      if (success) {
        // Update local state to reflect the change immediately
        const updatedUsers = [...users];
        updatedUsers[index].image = imageUrl;
        setUsers(updatedUsers);
      }
    }
  };

  const handleRemoveUser = (index) => {
    const updatedUsers = [...users];
    updatedUsers.splice(index, 1);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
  };

  // const handleRemoveUser = (index) => {
  //   const success = deleteUser(index);
  //   if (success) {
  //     setUsers(getUsers()); // Refresh state after deletion
  //   }
  // };
  

  return (
    <div className="admin-account-management">
      <h1>User Management</h1>
      
      <SearchAddUser />
      <UserTable 
      users={users} 
      handleUpload={handleUpload}
      removeUser={handleRemoveUser}
      />
    </div>
  );
};

export default AdminAccountManagement;