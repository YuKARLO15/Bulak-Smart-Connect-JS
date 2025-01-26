import React from "react";
import "./NavBar.css";
import { Link as RouterLink } from "react-router-dom";

const NavBar = () => {
  return (
    <nav className="sidebar">
      <div className="NavigationBar">
        <div className="Profile">
          <typography className="Username" >username</typography>
          <typography className="UserEmail" >User@gmail.com</typography>
        </div>
        <div className="NavigationButtons">
        <a href="/UserDashboard">Dashboard</a>
        <a href="/AppointmentForm">Appointments</a>
        <a href="/ApplicationForm">Document Application</a>
        <a href="/qrcode">QR Code</a>
        <a href="/account">Account</a>
        <a href="/settings">Settings</a>
        </div>
        <div className="Logout">
          <a href="/logout">Log Out</a>
          </div>
      </div>

    </nav>
  );
};

export default NavBar;
