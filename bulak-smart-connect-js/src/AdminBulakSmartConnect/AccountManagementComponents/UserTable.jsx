import React, { useState } from 'react';
import logger from '../../utils/logger';
import '../AccountManagementComponents/UserTable.css';
import { useNavigate } from 'react-router-dom';
import userService from '../../services/userService';
import { FaEllipsisV } from 'react-icons/fa';
import { useAuth } from '../../context/AuthContext';

const UserTable = ({ users, handleUpload, removeUser, loading, onRefresh }) => {
  const navigate = useNavigate();
  const { hasRole } = useAuth();
  const [statusUpdating, setStatusUpdating] = useState({});
  const [dropdownOpenIndex, setDropdownOpenIndex] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [userToDeactivate, setUserToDeactivate] = useState(null);
  const [showActivateDialog, setShowActivateDialog] = useState(false);
  const [userToActivate, setUserToActivate] = useState(null);

  const isSuperAdmin = hasRole('super_admin');

  const handleModifyClick = (user, index) => {
    if (!isSuperAdmin) {
      // alert('Only super administrators can modify users');
      return;
    }

    navigate('/add-user', {
      state: {
        isModifying: true,
        userData: user,
        userIndex: index,
        userId: user.id,
      },
    });
  };

  const handleRemoveClick = index => {
    if (!isSuperAdmin) {
      // alert('Only super administrators can remove users');
      return;
    }
    removeUser(index);
  };

  const handleFileUpload = (event, index) => {
    const file = event.target.files[0];
    if (file) {
      handleUpload(index, file);
    }
  };

  const handleStatusToggle = async (user, index) => {
    if (!isSuperAdmin) {
      // alert('Only super administrators can change user status');
      return;
    }

    if (!user.id) {
      // alert('Cannot update status for local-only users');
      return;
    }

    const newStatus = !user.isActive;

    // Show confirmation dialog when deactivating a user
    if (user.isActive && !newStatus) {
      setUserToDeactivate({ user, index, newStatus });
      setShowConfirmDialog(true);
      return;
    }

    // Show confirmation dialog when activating a user
    if (!user.isActive && newStatus) {
      setUserToActivate({ user, index, newStatus });
      setShowActivateDialog(true);
      return;
    }

    // This shouldn't happen, but just in case
    await updateUserStatus(user.id, newStatus, index);
  };

  const updateUserStatus = async (userId, newStatus, index) => {
    try {
      setStatusUpdating(prev => ({ ...prev, [index]: true }));
      await userService.updateUserStatus(userId, newStatus);

      // Refresh the user data from the server
      if (onRefresh) onRefresh();

      // alert(`User ${newStatus ? 'activated' : 'deactivated'} successfully!`);
    } catch (err) {
      logger.error('Error updating user status:', err);
      // alert('Failed to update user status. Please try again.');
    } finally {
      setStatusUpdating(prev => ({ ...prev, [index]: false }));
    }
  };

  const handleConfirmDeactivate = async () => {
    if (userToDeactivate) {
      await updateUserStatus(
        userToDeactivate.user.id,
        userToDeactivate.newStatus,
        userToDeactivate.index
      );
    }
    setShowConfirmDialog(false);
    setUserToDeactivate(null);
  };

  const handleCancelDeactivate = () => {
    setShowConfirmDialog(false);
    setUserToDeactivate(null);
  };

  const handleConfirmActivate = async () => {
    if (userToActivate) {
      await updateUserStatus(
        userToActivate.user.id,
        userToActivate.newStatus,
        userToActivate.index
      );
    }
    setShowActivateDialog(false);
    setUserToActivate(null);
  };

  const handleCancelActivate = () => {
    setShowActivateDialog(false);
    setUserToActivate(null);
  };

  const toggleDropdown = index => {
    setDropdownOpenIndex(prev => (prev === index ? null : index));
  };

  if (loading) {
    return (
      <div className="user-table-container compact">
        <div className="loading-message">Loading users...</div>
      </div>
    );
  }

  return (
    <div className="user-table-container compact">
      {onRefresh && (
        <div className="refresh-button-container">
          <button onClick={onRefresh} className="refresh-button">
            🔄 Refresh
          </button>
        </div>
      )}

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Status</th>
            <th>User Role</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan={4} className="no-users">
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
                <td className={user.status === 'Logged In' ? 'status-logged' : 'status-not-logged'}>
                  <div className="status-toggle-container">
                    {user.status}
                    {user.id && (
                      <button
                        onClick={() => handleStatusToggle(user, index)}
                        disabled={statusUpdating[index]}
                        className={`status-btn ${user.isActive ? 'deactivate' : 'activate'}`}
                      >
                        {statusUpdating[index] ? '...' : user.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    )}
                  </div>
                </td>
                <td>
                  <div className="roles">
                    {(user.roles || []).map((role, idx) => {
                      // Map role names to display labels
                      const roleLabels = {
                        super_admin: 'Admin',
                        admin: 'Manager',
                        staff: 'Staff',
                        citizen: 'Citizen',
                      };

                      const displayRole = roleLabels[role] || role;

                      return (
                        <span key={idx} className={`role ${role.toLowerCase()}`}>
                          {displayRole}
                        </span>
                      );
                    })}
                  </div>
                </td>
                <td className="actions">
                  <div className="dropdown-container">
                    <button className="dropdown-toggle" onClick={() => toggleDropdown(index)}>
                      <FaEllipsisV />
                    </button>
                    {dropdownOpenIndex === index && (
                      <div className="dropdown-menu">
                        <button onClick={() => setSelectedUser(user)}>View</button>
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

      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">User Details</h2>

            <div className="user-detail-row">
              <span>Name:</span>
              <span>{selectedUser.name}</span>
            </div>
            <div className="user-detail-row">
              <span>Username:</span>
              <span>{selectedUser.username}</span>
            </div>
            <div className="user-detail-row">
              <span>Email:</span>
              <span>{selectedUser.email}</span>
            </div>
            <div className="user-detail-row">
              <span>Phone Number:</span>
              <span>{selectedUser.contact}</span>
            </div>
            <div className="user-detail-row">
              <span>Status:</span>
              <span>{selectedUser.status}</span>
            </div>
            <div className="user-detail-row">
              <span>Roles:</span>
              <span>
                {(selectedUser.roles || [])
                  .map(role => {
                    const roleLabels = {
                      super_admin: 'Admin',
                      admin: 'Manager',
                      staff: 'Staff',
                      citizen: 'Citizen',
                    };
                    return roleLabels[role] || role;
                  })
                  .join(', ')}
              </span>
            </div>

            <button className="close-modal-btn" onClick={() => setSelectedUser(null)}>
              Close
            </button>
            <button
              className="modify-modal-btn"
              onClick={() => {
                handleModifyClick(
                  selectedUser,
                  users.findIndex(u => u.id === selectedUser.id)
                );
                setSelectedUser(null);
              }}
            >
              Modify
            </button>
          </div>
        </div>
      )}

      {showConfirmDialog && userToDeactivate && (
        <div className="modal-overlay" onClick={handleCancelDeactivate}>
          <div className="modal-content confirm-dialog" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">Confirm Deactivation</h2>
            <p className="confirm-message">
              Are you sure you want to deactivate user "{userToDeactivate.user.name}"?
            </p>
            <p className="confirm-warning">This will prevent them from accessing the system.</p>
            <div className="confirm-buttons">
              <button className="cancel-btn" onClick={handleCancelDeactivate}>
                Cancel
              </button>
              <button className="confirm-btn" onClick={handleConfirmDeactivate}>
                Deactivate
              </button>
            </div>
          </div>
        </div>
      )}

      {showActivateDialog && userToActivate && (
        <div className="modal-overlay" onClick={handleCancelActivate}>
          <div className="modal-content confirm-dialog" onClick={e => e.stopPropagation()}>
            <h2 className="modal-title">Confirm Activation</h2>
            <p className="confirm-message">
              Are you sure you want to activate user "{userToActivate.user.name}"?
            </p>
            <p className="confirm-warning">This will allow them to access the system.</p>
            <div className="confirm-buttons">
              <button className="cancel-btn" onClick={handleCancelActivate}>
                Cancel
              </button>
              <button className="confirm-btn activate-btn" onClick={handleConfirmActivate}>
                Activate
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;
