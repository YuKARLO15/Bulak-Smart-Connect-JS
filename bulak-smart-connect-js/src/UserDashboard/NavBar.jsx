import React, { useState } from "react";
import "./NavBar.css";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import { useAuth } from "../AuthContext"; // Import useAuth

const NavBar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const { logout } = useAuth(); // Use the logout function from AuthContext
  
  return (
    <>
      {/* Toggle Button */}
      <button
        className="SidebarToggleBtn"
        style={{ backgroundColor: isSidebarOpen ? "#8AACB5" : "#184a5b" }}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        {isSidebarOpen ? <CloseIcon /> : <MenuIcon />}
      </button>

      {/* Sidebar Navigation */}
      <nav className={`sidebar ${isSidebarOpen ? "open" : "closed"}`}>
        <div className="NavigationBar">
          <div className="Profile">
            <p className="Username">username</p>
            <p className="UserEmail">User@gmail.com</p>
          </div>
          <div className="NavigationButtons">
            <a href="/UserDashboard">Dashboard</a>
            <a href="/AppointmentForm">Appointments</a>
            <a href="/ApplicationForm">Document Application</a>
            <a href="/QR">QR Code</a>
            <a href="/account">Account</a>
            <a href="/settings">Settings</a>
          </div>
          <div className="Logout">
          <Link to="/" onClick={logout}>Log Out</Link>
          </div>
        </div>
      </nav>
    </>
  );
};

export default NavBar;