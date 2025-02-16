import React, { useState } from "react";
import NavBar from "../UserDashboard/NavBar";
import "../QRCodeComponents/QR.css";
import qrpic from "./QRCodeAssets/qrpic.png";

const QRCodePage = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
    
  return (
    <div className={`qr-code-container ${isSidebarOpen ? "sidebar-open" : ""}`}>
          <NavBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
        <div className="queue-info">
          <h2>
            Welcome to <span className="highlight">NAME</span>! You Are
            Currently in Queue.
          </h2>
          <p>Your number is:</p>
          <h1 className="queue-number">0002</h1>
          <div className="qr-section">
            <img
              src={qrpic}
              alt="QR Code"
              className="qr-code"
            />
            <p>Scan me</p>
            <a href="#requirements" className="requirements-link">
              Link for Requirements
            </a>
          </div>
          <div className="appointment-details-section"> 
            <div className="appointment-details">
              <p>
                <strong>Appointment Type:</strong> Birth Certificate
              </p>
              <p>
                <strong>Appointment Date:</strong> January 20, 2025
              </p>
              <p>
                <strong>Appointment Time:</strong> 10:30 am
              </p>
            </div>
          </div>
          <p className="note">
            <strong>Note:</strong> All clients are required to arrive at least
            15 minutes before their scheduled appointment time. Late arrivals
            will need to reschedule their appointment to ensure the smooth flow
            of services and to accommodate other clients efficiently.
          </p>
        </div>
      </div>
  );
};

export default QRCodePage;
