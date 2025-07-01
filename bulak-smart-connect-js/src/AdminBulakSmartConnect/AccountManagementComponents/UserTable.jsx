import React, { useState } from 'react';
import '../AccountManagementComponents/UserTable.css';
import { useNavigate } from 'react-router-dom';
import userService from '../../services/userService';
import { FaEllipsisV } from 'react-icons/fa';

const UserTable = ({ users, handleUpload, removeUser, loading, onRefresh }) => {
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState({});
  const [dropdownOpenIndex, setDropdownOpenIndex] = useState(null);

  const handleModifyClick = (user, index) => {
    navigate('/add-user', {
      state: {
        isModifying: true,
        userData: user,
        userIndex: index,
        userId: user.id
      }
    });
  };

  const handleRemoveClick = (index) => {
    removeUser(index);
  };

  const handleFileUpload = (event, index) => {
    const file = event.target.files[0];
    if (file) {
      handleUpload(index, file);
    }
  };

  const handleStatusToggle = async (user, index) => {
    if (!user.id) {
      alert('Cannot update status for local-only users');
      return;
    }

    try {
      setStatusUpdating(prev => ({ ...prev, [index]: true }));
      const newStatus = !user.isActive;
      await userService.updateUserStatus(user.id, newStatus);

      const updatedUsers = JSON.parse(localStorage.getItem('users') || '[]');
      if (updatedUsers[index]) {
        updatedUsers[index].isActive = newStatus;
        updatedUsers[index].status = newStatus ? 'Logged In' : 'Not Logged In';
        localStorage.setItem('users', JSON.stringify(updatedUsers));
      }

      if (onRefresh) {
        onRefresh();
      }

      alert(`User ${newStatus ? 'activated' : 'deactivated'} successfully!`);
    } catch (err) {
      console.error('Error updating user status:', err);
      alert('Failed to update user status. Please try again.');
    } finally {
      setStatusUpdating(prev => ({ ...prev, [index]: false }));
    }
  };

  const toggleViewDetails = () => {
    setShowDetails(prev => !prev);
  };

  const toggleDropdown = (index) => {
    setDropdownOpenIndex(prev => (prev === index ? null : index));
  };

  if (loading) {
    return (
      <div className="user-table-container compact">
        <div style={{ textAlign: 'center', padding: '40px', color: '#666', fontSize: '16px' }}>
          Loading users...
        </div>
      </div>
    );
  }

  return (
    <div className="user-table-container compact">
      {onRefresh && (
        <div style={{ marginBottom: '15px', textAlign: 'right', paddingRight: '20px' }}>
          <button 
            onClick={onRefresh}
            style={{
              background: '#28a745',
              color: 'white',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            🔄 Refresh
          </button>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>Name</th>
            {showDetails && (
              <>
                <th>Username</th>
                <th>Email</th>
                <th>Phone Number</th>
              </>
            )}
            <th>Status</th>
            <th>User Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={showDetails ? 7 : 4} style={{ textAlign: 'center', color: '#666', fontStyle: 'italic', padding: '40px' }}>
                No users found
              </td>
            </tr>
          ) : (
            users.map((user, index) => (
              <tr key={user.id || index}>
                <td>
                  <div className="user-info">
                    {user.image && <img src={user.image} alt="User" />}
                    <span className="user-name">{user.name}</span>
                  </div>
                </td>

                {showDetails && (
                  <>
                    <td>{user.username}</td>
                    <td>{user.email}</td>
                    <td>{user.contact}</td>
                  </>
                )}

                <td className={user.status === 'Logged In' ? 'status-logged' : 'status-not-logged'}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    {user.status}
                    {user.id && (
                      <button
                        onClick={() => handleStatusToggle(user, index)}
                        disabled={statusUpdating[index]}
                        style={{
                          background: user.isActive ? '#dc3545' : '#28a745',
                          color: 'white',
                          border: 'none',
                          padding: '4px 8px',
                          borderRadius: '4px',
                          cursor: statusUpdating[index] ? 'not-allowed' : 'pointer',
                          fontSize: '12px',
                          opacity: statusUpdating[index] ? 0.6 : 1
                        }}
                      >
                        {statusUpdating[index] 
                          ? '...' 
                          : (user.isActive ? 'Deactivate' : 'Activate')
                        }
                      </button>
                    )}
                  </div>
                </td>

                <td>
                  <div className="roles">
                    {(user.roles || []).map((role, idx) => (
                      <span key={idx} className={`role ${role.toLowerCase()}`}>
                        {role}
                      </span>
                    ))}
                  </div>
                </td>

                <td className="actions">
                  <div className="dropdown-container">
                    <button className="dropdown-toggle" onClick={() => toggleDropdown(index)}>
                      <FaEllipsisV />
                    </button>

                    {dropdownOpenIndex === index && (
                      <div className="dropdown-menu">
                        <button onClick={toggleViewDetails}>View</button>
                        <button onClick={() => handleModifyClick(user, index)}>Modify</button>
                        <button onClick={() => handleRemoveClick(index)}>Delete</button>
                      </div>
                    )}
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
