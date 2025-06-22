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

  const status = data.status.toLowerCase();
  
  // Only show status update buttons for pending or confirmed statuses
  if (status === 'pending' || status === 'confirmed') {
    const actionText = status === 'pending' ? 'Confirm' : 'Complete';
    const actionStatus = status === 'pending' ? 'confirmed' : 'completed';
    const buttonClass = status === 'pending' ? 'btn-confirm' : 'btn-complete';
    
    return (
      <div className="status-actions">
        <button 
          className={buttonClass}
          onClick={() => handleStatusUpdate(actionStatus)}
          disabled={updating}
        >
          {updating ? 'Updating...' : actionText}
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
  } else if (status === 'completed') {
    // Show navigation buttons when completed
    return (
      <div className="status-actions">
        <button 
          className="btn-back"
          onClick={onBack}
          disabled={updating}
        >
          Back
        </button>
        <button 
          className="btn-next"
          onClick={onNext}
          disabled={updating}
        >
          Next
        </button>
      </div>
    );
  }
  
  return null;
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
      
    </div>
  );
};

export default UserInfoCard;