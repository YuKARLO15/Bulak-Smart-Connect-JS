import React from 'react';
import '../AccountManagementComponents/UserTable.css';
import UploadProfile from './ProfileUpload';

const UserTable = ({ users, handleUpload }) => {
  return (
    <div className="user-table-container">
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
          {users.map((user, index) => (
            <tr key={index}>
              <td>
                <div className="user-info">
                  <UploadProfile label="" onUpload={file => handleUpload(index, file)} />
                  <span className="user-name">{user.name}</span>
                </div>
              </td>
              <td className={user.status === 'Logged In' ? 'status-logged' : 'status-not-logged'}>
                {user.status}
              </td>
              <td>
                <div className="roles">
                  {user.roles.map((role, idx) => (
                    <span key={idx} className={`role ${role.toLowerCase()}`}>
                      {role}
                    </span>
                  ))}
                </div>
              </td>
              <td className="actions">
                <button className="modify">Modify </button>
                <button className="remove">Remove </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UserTable;
