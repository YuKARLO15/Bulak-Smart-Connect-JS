import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import './AdminWalkInDetails.css';
import { queueService } from '../../services/queueService';
import axios from 'axios';

const AdminWalkInDetails = () => {
  const navigate = useNavigate();
  const { id } = useParams(); // Get the queue ID from the URL
  const [queueDetails, setQueueDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Format queue number to WK format
  const formatWKNumber = (queueNumber) => {
    if (typeof queueNumber === 'string' && queueNumber.startsWith('WK')) {
      return queueNumber;
    }
    
    // Handle null or undefined
    if (!queueNumber) return 'WK000';
    
    const numberPart = queueNumber?.includes('-') ? queueNumber.split('-')[1] : queueNumber;
    const num = parseInt(numberPart, 10) || 0;
    return `WK${String(num).padStart(3, '0')}`;
  };

  useEffect(() => {
    const fetchQueueDetails = async () => {
      if (!id) {
        setError('No queue ID provided');
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const details = await queueService.fetchQueueDetails(id);
        console.log('Queue details fetched:', details);
        setQueueDetails(details);
        setError(null);
      } catch (err) {
        console.error('Error fetching queue details:', err);
        setError('Failed to load queue details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchQueueDetails();
  }, [id]);
    // Handle queue completion
  const handleCompleteQueue = async () => {
    try {
      // Use queueService for consistency
      await queueService.updateQueueStatus(id, 'completed');
      alert('Queue marked as complete!');
      navigate(-1); // Go back to previous page
    } catch (err) {
      console.error('Error completing queue:', err);
      console.error('Error details:', err.response?.data || err.message);
      alert(`Failed to complete queue. Error: ${err.response?.data?.message || err.message}`);
    }
  };

  if (loading) {
    return (
      <div style={{display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh'}}>
        <div className="loading-spinner"></div>
        <p style={{marginLeft: '12px'}}>Loading queue details...</p>
      </div>
    );
  }
  
  if (error) {
    return (
      <div style={{
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        height: '100vh',
        flexDirection: 'column',
        color: '#721c24',
        background: '#f8d7da',
        padding: '20px',
        borderRadius: '8px'
      }}>
        <p>{error}</p>
        <button 
          onClick={() => navigate(-1)}
          style={{
            marginTop: '16px',
            background: '#1C4D5A',
            color: 'white',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          Go Back
        </button>
      </div>
    );
  }
  
  // Extract queue data from the response
  const queue = queueDetails?.queue || {};
  const details = queueDetails?.details || {};
  const user = details.user || {};
  
  const walkinNumber = formatWKNumber(queue.queueNumber || queue.id);
  const firstName = details.firstName || user.firstName || queue.firstName || '';
  const lastName = details.lastName || user.lastName || queue.lastName || '';
  const middleInitial = details.middleInitial || user.middleInitial || '';
  const phoneNumber = details.phoneNumber || user.phoneNumber || '';
  const reasonOfVisit = details.reasonOfVisit || queue.reason || queue.reasonOfVisit || '';

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
                <span className="admin-walkin-details-label">Last Name:</span>
                <div className="admin-walkin-details-value">{lastName}</div>
              </div>
              <div>
                <span className="admin-walkin-details-label">Phone Number:</span>
                <div className="admin-walkin-details-value">{phoneNumber}</div>
              </div>
            </div>
            <div className="admin-walkin-details-col">
              <div>
                <span className="admin-walkin-details-label">First Name:</span>
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
            </div>
          </div>
          <div className="admin-walkin-details-actions">
            <button className="admin-walkin-details-cancel-btn" onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button
              className="admin-walkin-details-complete-btn"
              onClick={handleCompleteQueue}
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
