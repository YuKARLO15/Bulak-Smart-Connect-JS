import React from "react";
import { useNavigate } from "react-router-dom";
import "./AdminWalkInDetails.css";

const AdminWalkInDetails = () => {
  const navigate = useNavigate();

  // Placeholder data (replace with real data as needed)
  const queueNumber = "";
  const applicantName = "";
  const date = "";
  const status = "";
  const email = "";
  const contact = "";

  return (
    <div className="admin-walkin-details-container">
      <div className="admin-walkin-details-header">
        <button
          className="admin-walkin-details-back-btn"
          onClick={() => navigate(-1)}
        >
          ← Back
        </button>
        <h1>Walk-In Queue Details</h1>
      </div>
      <div className="admin-walkin-details-card">
        <div className="admin-walkin-details-row">
          <span className="admin-walkin-details-label">Queue Number:</span>
          <span className="admin-walkin-details-value">{queueNumber}</span>
        </div>
        <div className="admin-walkin-details-row">
          <span className="admin-walkin-details-label">Applicant Name:</span>
          <span className="admin-walkin-details-value">{applicantName}</span>
        </div>
        <div className="admin-walkin-details-row">
          <span className="admin-walkin-details-label">Date:</span>
          <span className="admin-walkin-details-value">{date}</span>
        </div>
        <div className="admin-walkin-details-row">
          <span className="admin-walkin-details-label">Status:</span>
          <span className="admin-walkin-details-value">{status}</span>
        </div>
        <div className="admin-walkin-details-row">
          <span className="admin-walkin-details-label">Email:</span>
          <span className="admin-walkin-details-value">{email}</span>
        </div>
        <div className="admin-walkin-details-row">
          <span className="admin-walkin-details-label">Contact:</span>
          <span className="admin-walkin-details-value">{contact}</span>
        </div>
      </div>
    </div>
  );
};

export default AdminWalkInDetails;