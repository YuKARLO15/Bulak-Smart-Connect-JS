import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminWalkInQueue.css';
import NavBar from '../../NavigationComponents/NavSide';
import { queueService } from '../../services/queueService';
import axios from 'axios';

// Format queue number to WK format - reusing from WalkInQueueAdmin
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

const AdminWalkInQueue = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [pendingQueues, setPendingQueues] = useState([]);
  const [currentQueues, setCurrentQueues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Current queue is the first in the serving queues
  const currentQueue = currentQueues.length > 0 ? 
    formatWKNumber(currentQueues[0].queueNumber || currentQueues[0].id) : 'None';
  
  // Next queue is the first in the pending queues
  const nextQueue = pendingQueues.length > 0 ? 
    formatWKNumber(pendingQueues[0].queueNumber || pendingQueues[0].id) : 'None';
  
  // Total queues count
  const totalQueues = pendingQueues.length + currentQueues.length;
  // Update queue status
  const updateQueueStatus = async (queueId, newStatus) => {
    try {
      // Make API call to update status using queueService
      await queueService.updateQueueStatus(queueId, newStatus);
      
      // Update local state based on new status
      if (newStatus === 'serving') {
        // Move from pending to current
        const queueToMove = pendingQueues.find(q => q.id === queueId);
        if (queueToMove) {
          setPendingQueues(prev => prev.filter(q => q.id !== queueId));
          setCurrentQueues(prev => [...prev, {...queueToMove, status: 'serving'}]);
        }
      } else if (newStatus === 'completed') {
        // Remove from current
        setCurrentQueues(prev => prev.filter(q => q.id !== queueId));
      } else if (newStatus === 'pending') {
        // Move from current to pending
        const queueToMove = currentQueues.find(q => q.id === queueId);
        if (queueToMove) {
          setCurrentQueues(prev => prev.filter(q => q.id !== queueId));
          setPendingQueues(prev => [...prev, {...queueToMove, status: 'pending'}]);
        }
      }
      
      console.log(`Queue ${queueId} updated to ${newStatus}`);
      
      // Refresh data after updating
      fetchQueueData();
    } catch (error) {
      console.error('Failed to update queue status:', error);
      alert('Failed to update queue status. Please try again.');
    }
  };
  // Function to fetch queue data - using queueService.fetchWalkInQueues
  const fetchQueueData = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch all walk-in queues (includes both pending and serving)
      const walkInQueues = await queueService.fetchWalkInQueues();
      
      // Separate into pending and current queues
      const formattedPendingQueues = walkInQueues
        .filter(queue => queue.status === 'pending')
        .map(queue => ({
          id: queue.id,
          queueNumber: formatWKNumber(queue.queueNumber || queue.id),
          firstName: queue.firstName || 'Guest',
          lastName: queue.lastName || '',
          reasonOfVisit: queue.reasonOfVisit || 'General Inquiry',
          status: 'pending',
          timestamp: queue.createdAt || new Date().toISOString()
        }));
      
      const formattedCurrentQueues = walkInQueues
        .filter(queue => queue.status === 'serving')
        .map(queue => ({
          id: queue.id,
          queueNumber: formatWKNumber(queue.queueNumber || queue.id),
          firstName: queue.firstName || 'Guest',
          lastName: queue.lastName || '',
          reasonOfVisit: queue.reasonOfVisit || 'General Inquiry',
          status: 'serving',
          timestamp: queue.createdAt || new Date().toISOString()
        }));
      
      setPendingQueues(formattedPendingQueues);
      setCurrentQueues(formattedCurrentQueues);
      setError(null);
    } catch (err) {
      console.error('Error fetching queue data:', err);
      setError('Failed to load queue data. Please ensure the server is running.');
    } finally {
      setLoading(false);
    }
  }, []);

  // View details of a specific queue
  const viewQueueDetails = (queueId) => {
    navigate(`/AdminWalkInDetails/${queueId}`);
  };
  
  // Fetch data on component mount and refresh periodically
  useEffect(() => {
    fetchQueueData();
    
    // Auto-refresh every 30 seconds
    const intervalId = setInterval(fetchQueueData, 30000);
    
    return () => clearInterval(intervalId);
  }, [fetchQueueData]);

  return (
    <div className="admin-walkin-queue">
      {/* Header Bar */}
      <div className="admin-walkin-queue-header-bar">
        <button
          className="admin-walkin-queue-menu-btn"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open navigation"
        >
          <span className="admin-walkin-queue-menu-icon">
            <span className="admin-walkin-queue-menu-bar"></span>
            <span className="admin-walkin-queue-menu-bar"></span>
            <span className="admin-walkin-queue-menu-bar"></span>
          </span>
        </button>
        <h1 className="admin-walkin-queue-header-title">Walk - in</h1>
      </div>

      {/* Sidebar */}
      <NavBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      {/* Main Content */}
      <div className="admin-walkin-queue-main">
        {/* Summary Cards */}
        <div className="admin-walkin-queue-summary-row">
          <div className="admin-walkin-queue-summary-card">
            <h2 className="admin-walkin-queue-summary-title">CURRENT QUEUE</h2>
            <div className="admin-walkin-queue-summary-number">{currentQueue}</div>
            <div className="admin-walkin-queue-summary-next">
              Next on Queue <span className="admin-walkin-queue-summary-next-number">{nextQueue}</span>
            </div>
          </div>
          <div className="admin-walkin-queue-summary-card gray">
            <h2 className="admin-walkin-queue-summary-title">TOTAL NUMBER OF QUEUE</h2>
            <div className="admin-walkin-queue-summary-number">{totalQueues}</div>
          </div>
        </div>

        {/* Walk-In Queues List */}
        <div className="admin-walkin-queue-list-section">
          <h2 className="admin-walkin-queue-list-title">Walk - In Queues</h2>
          
          {loading ? (
            <div style={{textAlign: 'center', padding: '20px'}}>
              <div className="loading-spinner"></div>
              <p>Loading queue data...</p>
            </div>
          ) : error ? (
            <div style={{textAlign: 'center', padding: '20px', color: '#721c24'}}>
              <p>{error}</p>
            </div>
          ) : pendingQueues.length === 0 && currentQueues.length === 0 ? (
            <div style={{textAlign: 'center', padding: '20px', color: '#666'}}>
              <p>No active walk-in queues</p>
            </div>
          ) : (
            <div className="admin-walkin-queue-list">
              {/* Show current queues first */}
                {/*<button className="admin-walkin-queue-action-btn" onClick={getDetails}>
                 View Details
                </button>*/}
              {currentQueues.map(queue => (
                <div 
                  key={queue.id} 
                  className="admin-walkin-queue-item active-queue"
                  onClick={() => viewQueueDetails(queue.id)}
                >
                  <div className="admin-walkin-queue-status-section">
                    <div className="admin-walkin-queue-status">IN PROGRESS</div>
                    <div className="admin-walkin-queue-date">
                      {new Date(queue.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </div>
                  <div className="admin-walkin-queue-applicant">
                    {`${queue.firstName} ${queue.lastName}`}
                  </div>
                  <div className="admin-walkin-queue-id">{queue.queueNumber}</div>
                </div>
              ))}
              
              {/* Then show pending queues */}
              {pendingQueues.map(queue => (
                <div 
                  key={queue.id} 
                  className="admin-walkin-queue-item"
                  onClick={() => viewQueueDetails(queue.id)}
                >
                  <div className="admin-walkin-queue-status-section">
                    <div className="admin-walkin-queue-status">PENDING</div>
                    <div className="admin-walkin-queue-date">
                      {new Date(queue.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </div>
                  </div>
                  <div className="admin-walkin-queue-applicant">
                    {`${queue.firstName} ${queue.lastName}`}
                  </div>
                  <div className="admin-walkin-queue-id">{queue.queueNumber}</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminWalkInQueue;
