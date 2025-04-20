import React, { useState } from "react";
import SearchAddUser from "./SearchAdd";
import UserTable from "./UserTable";


const AdminAccountManagement = () => {
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
      <div className="header">User Management</div>
      <SearchAddUser/>
      <UserTable users={users} handleUpload={handleUpload} />
    </div>
  );
};

export default AdminAccountManagement;
