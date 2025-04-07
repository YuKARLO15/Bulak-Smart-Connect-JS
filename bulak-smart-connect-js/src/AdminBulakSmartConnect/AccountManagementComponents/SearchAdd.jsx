import React from "react";
import '../AccountManagementComponents/SearchAdd.css';


const SearchAddUser = () => {
  return (
    <div className="search-user">
      <input type="text" placeholder="Search User..." />
      <button className="add-user">Add User</button>
    </div>
  );
};

export default SearchAddUser;