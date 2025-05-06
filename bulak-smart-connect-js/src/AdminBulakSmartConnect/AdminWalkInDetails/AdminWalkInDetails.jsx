import React from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminWalkInDetails.css';

const AdminWalkInDetails = () => {
  const navigate = useNavigate();

  // Example data (replace with real data as needed)
  const walkinNumber = '';
  const lastName = '';
  const firstName = '';
  const middleInitial = '';
  const phoneNumber = '';
  const reasonOfVisit = '';
  const appointmentDate = '';
  const appointmentTime = '';

  return (
    <div>
      {/* Header Bar */}
      <div className="admin-walkin-details-header-bar">
        <button
          className="admin-walkin-details-menu-btn"
          onClick={() => navigate(-1)}
          aria-label="Back"
        >
          <span className="admin-walkin-details-menu-icon">
            <span className="admin-walkin-details-menu-bar"></span>
            <span className="admin-walkin-details-menu-bar"></span>
            <span className="admin-walkin-details-menu-bar"></span>
          </span>
        </button>
        <h1 className="admin-walkin-details-header-title">Walk - in Details</h1>
      </div>

      <div className="admin-walkin-details-container">
        <div className="admin-walkin-details-card">
          <div className="admin-walkin-details-row admin-walkin-details-row-header">
            <span className="admin-walkin-details-label-header">Walk-in Number:</span>
            <span className="admin-walkin-details-value-header">{walkinNumber}</span>
          </div>
          <div className="admin-walkin-details-info">
            <div className="admin-walkin-details-col">
              <div>
                <span className="admin-walkin-details-label">Last Name :</span>
                <div className="admin-walkin-details-value">{lastName}</div>
              </div>
              <div>
                <span className="admin-walkin-details-label">Phone Number:</span>
                <div className="admin-walkin-details-value">{phoneNumber}</div>
              </div>
              <div>
                <span className="admin-walkin-details-label">Appointment Time:</span>
                <div className="admin-walkin-details-value">{appointmentTime}</div>
              </div>
            </div>
            <div className="admin-walkin-details-col">
              <div>
                <span className="admin-walkin-details-label">First Name :</span>
                <div className="admin-walkin-details-value">{firstName}</div>
              </div>
              <div>
                <span className="admin-walkin-details-label">Reason of Visit:</span>
                <div className="admin-walkin-details-value">{reasonOfVisit}</div>
              </div>
            </div>
            <div className="admin-walkin-details-col">
              <div>
                <span className="admin-walkin-details-label">Middle Initial:</span>
                <div className="admin-walkin-details-value">{middleInitial}</div>
              </div>
              <div>
                <span className="admin-walkin-details-label">Appointment Date:</span>
                <div className="admin-walkin-details-value">{appointmentDate}</div>
              </div>
            </div>
          </div>
          <div className="admin-walkin-details-actions">
            <button className="admin-walkin-details-cancel-btn" onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button
              className="admin-walkin-details-complete-btn"
              onClick={() => alert('Marked as complete!')}
            >
              Complete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminWalkInDetails;
