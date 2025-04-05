import React, { useState } from "react";
import "./AdminManageAccount.css";
import ProfileUpload from "./AdminManagementPage/UploadProfilePicture/ProfileUpload"; 

const AccountManagement = () => {
    const [users, setUsers] = useState([
        {
          name: "Jhazmine Reigne Cruz",
          status: "Logged In",
          roles: ["Admin", "Manager"],
          image: "", 
        },
        {
          name: "Manager",
          status: "Logged In",
          roles: ["Manager"],
          image: "", 
        },
        {
          name: "Staff 1",
          status: "Not Logged In",
          roles: ["Staff"],
          image: "", 
        },
        {
          name: "Staff 2",
          status: "Logged In",
          roles: ["Staff"],
          image: "", 
        },
    ]);

    const handleUpload = (index, file) => {
        if (file) {
            const updatedUsers = [...users];
            updatedUsers[index].image = URL.createObjectURL(file); 
            setUsers(updatedUsers);
        }
    };

    return (
        <div className="admin-container">
          <div className="header">User  Management</div>
          <div className="search-user">
            <input type="text" placeholder="Search User..." />
            <button className="add-user">Add User</button>
          </div>
    
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
                      <ProfileUpload
                        label=""
                        onUpload={(file) => handleUpload(index, file)}
                      />
                      <span className="user-name">{user.name}</span>
                    </div>
                  </td>
                  <td className={user.status === "Logged In" ? "status-logged" : "status-not-logged"}>
                    {user.status}
                  </td>
                  <td>
                    <div className="roles">
                      {user.roles.map((role, idx) => (
                        <span key={idx} className={`role ${role.toLowerCase()}`}>{role}</span>
                      ))}
                    </div>
                  </td>
                  <td className="actions">
                    <button className="modify">Modify User</button>
                    <button className="remove">Remove User</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
    );
};

export default AccountManagement;