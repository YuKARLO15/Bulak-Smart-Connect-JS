import React from "react";
import "./NavBar.css";

const NavBar = () => {
  return (
    <nav className="sidebar">
      <div className="NavigationBar">
        <div className="Profile">
          <typography className="Username" >username</typography>
          <typography className="UserEmail" >User@gmail.com</typography>
        </div>
        <div className="NavigationButtons">
        <a href="/dashboard">Dashboard</a>
        <a href="/appointments">Appointments</a>
        <a href="/document_application">Document Application</a>
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
