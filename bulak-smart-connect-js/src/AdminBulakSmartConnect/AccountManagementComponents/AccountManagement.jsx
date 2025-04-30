import React, { useState } from 'react';
import SearchAddUser from './SearchAdd';
import UserTable from './UserTable';
import AdminAddUser from './AdminAddAccount';
// import { useNavigate } from 'react-router-dom';
// import AdminAddUser from './AdminAddAccount';

const AdminAccountManagement = () => {
  const [users, setUsers] = useState([
    {
      name: 'Jhazmine Reigne Cruz',
      status: 'Logged In',
      roles: ['Admin', 'Manager'],
      image: '',
    },
    {
      name: 'Manager',
      status: 'Logged In',
      roles: ['Manager'],
      image: '',
    },
    {
      name: 'Staff 1',
      status: 'Not Logged In',
      roles: ['Staff'],
      image: '',
    },
    {
      name: 'Staff 2',
      status: 'Logged In',
      roles: ['Staff'],
      image: '',
    },
  ]);


  const handleUpload = (index, file) => {
    if (file) {
      const updatedUsers = [...users];
      updatedUsers[index].image = URL.createObjectURL(file);
      setUsers(updatedUsers);
    }
  };


  const addUser = (userData) => {

    const newUser = {
      name: `${userData.firstName} ${userData.lastName}`,
      status: 'Not Logged In', 
      roles: [userData.role], 
      image: userData.photo ? URL.createObjectURL(userData.photo) : '',
      // You could add additional fields here if needed
      username: userData.username,
      email: userData.email,
      contact: `+63${userData.contact}`
    };

    // Add the new user to the users array
    setUsers([...users, newUser]);
  };

  // Track whether the add user modal/form is visible
  const [showAddUserForm, setShowAddUserForm] = useState(false);

  return (
    <div className="admin-container">
      <div className="header">User Management</div>
      
      {/* Pass setShowAddUserForm to SearchAddUser so it can open the form */}
      <SearchAddUser onAddClick={() => setShowAddUserForm(true)} />
      
      {/* Render the UserTable with the users */}
      <UserTable users={users} handleUpload={handleUpload} />
      
      {/* Render the AdminAddUser form as a modal when showAddUserForm is true */}
      {showAddUserForm && (
        <div className="modal-overlay">
          <div className="modal-content">
            <button 
              className="close-modal"
              onClick={() => setShowAddUserForm(false)}
            >
              ×
            </button>
            <AdminAddUser 
              onAddUser={(userData) => {
                addUser(userData);
                setShowAddUserForm(false); // Close the form after adding
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAccountManagement;