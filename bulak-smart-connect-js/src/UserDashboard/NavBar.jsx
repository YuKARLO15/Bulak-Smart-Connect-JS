import React from "react";
import "./NavBar.css";

const NavBar = () => {
  return (
    <nav className="sidebar">
      <div className="NavigationBar">
        <a href="/">username</a>
        <a href="/dashboard">Dashboard</a>
        <a href="/appointments">Appointments</a>
        <a href="/document_application">Document Application</a>
        <a href="/qrcode">QR Code</a>
        <a href="/account">Account</a>
        <a href="/settings">Settings</a>
        <a href="/logout">Log Out</a>
      </div>

    </nav>
  );
};

export default NavBar;
