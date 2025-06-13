import React, { useState } from 'react';
import './UserInfoCard.css';

const UserInfoCard = ({ data, onBack, onNext, onStatusUpdate }) => {
  const [updating, setUpdating] = useState(false);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'pending': return '#f39c12';
      case 'confirmed': return '#3498db';
      case 'completed': return '#27ae60';
      case 'cancelled': return '#e74c3c';
      default: return '#95a5a6';
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    setUpdating(true);
    try {
      await onStatusUpdate(newStatus);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusActions = () => {
    if (!data?.status) return null;

    switch (data.status.toLowerCase()) {
      case 'pending':
        return (
          <div className="status-actions">
            <button 
              className="btn-confirm"
              onClick={() => handleStatusUpdate('confirmed')}
              disabled={updating}
            >
              {updating ? 'Updating...' : 'Confirm'}
            </button>
            <button 
              className="btn-cancel"
              onClick={() => handleStatusUpdate('cancelled')}
              disabled={updating}
            >
              {updating ? 'Updating...' : 'Cancel'}
            </button>
          </div>
        );
      case 'confirmed':
        return (
          <div className="status-actions">
            <button 
              className="btn-complete"
              onClick={() => handleStatusUpdate('completed')}
              disabled={updating}
            >
              {updating ? 'Updating...' : 'Complete'}
            </button>
            <button 
              className="btn-cancel"
              onClick={() => handleStatusUpdate('cancelled')}
              disabled={updating}
            >
              {updating ? 'Updating...' : 'Cancel'}
            </button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="info-card">
      <div className="appointment-header">
        <h2>
          Application Number: <span className="app-number">{data.applicationNumber}</span>
        </h2>
        {data.status && (
          <div 
            className="status-badge"
            style={{ backgroundColor: getStatusColor(data.status) }}
          >
            {data.status.toUpperCase()}
          </div>
        )}
      </div>

      <div className="details-grid">
        <div>
          <strong>Last Name:</strong> {data.lastName}
        </div>
        <div>
          <strong>First Name:</strong> {data.firstName}
        </div>
        <div>
          <strong>Middle Initial:</strong> {data.middleInitial}
        </div>
        <div>
          <strong>Phone Number:</strong> {data.phone}
        </div>
        <div>
          <strong>Email Address:</strong> {data.email}
        </div>
        <div>
          <strong>Address:</strong> {data.address}
        </div>
        <div>
          <strong>Application Type:</strong> {data.applicationType}
          <br />
          <small>{data.subType}</small>
        </div>
        <div>
          <strong>Submission Date:</strong> {data.submissionDate}
        </div>
      </div>

      {getStatusActions()}

      <div className="btn-group">
        <button className="back" onClick={onBack}>
          Back
        </button>
        <button className="next" onClick={onNext}>
          {data.status === 'pending' ? 'Quick Confirm' : 
           data.status === 'confirmed' ? 'Quick Complete' : 'Next'}
        </button>
      </div>
    </div>
  );
};

export default UserInfoCard;
