import React from "react";
import { useNavigate } from "react-router-dom"; // import navigation hook
import '../AccountManagementComponents/SearchAdd.css';

const SearchAddUser = () => {
  const navigate = useNavigate(); // initialize navigate

  const handleAddUserClick = () => {
    navigate("/add-user"); // navigate to the Add User page
  };

  return (
    <div className="search-user">
      <input type="text" placeholder="Search User..." />
      <button className="add-user" onClick={handleAddUserClick}>
        Add User
      </button>
    </div>
  );
};

export default SearchAddUser;
