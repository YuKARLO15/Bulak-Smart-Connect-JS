import React, { useState } from 'react';
import '../AccountManagementComponents/UserTable.css';
// import UploadProfile from './ProfileUpload';
import { useNavigate } from 'react-router-dom';

const UserTable = ({ users, handleUpload, removeUser }) => {
  const navigate = useNavigate();
  const [showDetails, setShowDetails] = useState(false);

  const handleModifyClick = (user, index) => {
    navigate('/add-user', {
      state: {
        isModifying: true,
        userData: user,
        userIndex: index
      }
    });
  };

  const handleRemoveClick = (index) => {
    if (window.confirm('Are you sure you want to remove this user?')) {
      removeUser(index);
    }
  };

  const toggleViewDetails = () => {
    setShowDetails(prev => !prev);
  };

  return (
    <div className="user-table-container compact">
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
          {users.map((user, index) => (
            <tr key={index}>
              <td>
                <div className="user-info">
                  {/* <UploadProfile label="" onUpload={(file) => handleUpload(index, file)} /> */}
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
                {user.status}
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
                <button className="view" onClick={toggleViewDetails}>
                  {showDetails ? 'Hide' : 'View'}
                </button>
                <button className="modify" onClick={() => handleModifyClick(user, index)}>Modify</button>
                <button className="remove" onClick={() => handleRemoveClick(index)}>Remove</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;