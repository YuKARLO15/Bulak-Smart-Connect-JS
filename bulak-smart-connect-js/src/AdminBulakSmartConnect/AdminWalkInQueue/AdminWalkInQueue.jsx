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
  const [selectedQueue, setSelectedQueue] = useState(null);
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
      console.log(`Attempting to update queue ${queueId} to status: ${newStatus}`);
      
      // Parse the queueId if it's not already a number
      const parsedQueueId = parseInt(queueId, 10) || queueId;
      
      // Make API call to update status using queueService
      await queueService.updateQueueStatus(parsedQueueId, newStatus);
      
      console.log(`Queue status updated successfully: ${queueId} → ${newStatus}`);
      
      // Update local state based on new status
      if (newStatus === 'serving' || newStatus === 'in-progress') {
        // Make sure we use consistent status naming when updating UI
        const mappedStatus = 'serving'; // NestJS backend uses 'serving'
        
        // Move from pending to current
        const queueToMove = pendingQueues.find(q => q.id === queueId || q.id === parsedQueueId);
        if (queueToMove) {
          setPendingQueues(prev => prev.filter(q => q.id !== queueId && q.id !== parsedQueueId));
          setCurrentQueues(prev => [...prev, {...queueToMove, status: mappedStatus}]);
          
          // Set selected queue to show details
          setSelectedQueue({...queueToMove, status: mappedStatus});
          
          // Navigate to details view
          navigate(`/AdminWalkInDetails/${queueId}`);
        }
      } else if (newStatus === 'completed') {
        // Remove from current
        setCurrentQueues(prev => prev.filter(q => q.id !== queueId && q.id !== parsedQueueId));
        // Clear selected queue if it was completed
        if (selectedQueue && (selectedQueue.id === queueId || selectedQueue.id === parsedQueueId)) {
          setSelectedQueue(null);
        }
      } else if (newStatus === 'pending') {
        // Move from current to pending
        const queueToMove = currentQueues.find(q => q.id === queueId || q.id === parsedQueueId);
        if (queueToMove) {
          setCurrentQueues(prev => prev.filter(q => q.id !== queueId && q.id !== parsedQueueId));
          setPendingQueues(prev => [...prev, {...queueToMove, status: 'pending'}]);
        }
      }
      
      // Refresh data after updating with a slight delay to ensure backend has processed the change
      setTimeout(() => fetchQueueData(), 500);
    } catch (error) {
      console.error('Failed to update queue status:', error);
      console.error('Error details:', error.response?.data || error.message);
      alert(`Failed to update queue status. Error: ${error.response?.data?.message || error.message}`);
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
  
  // Get all queues combined for rendering
  const getAllQueues = () => {
    return [...currentQueues, ...pendingQueues];
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
          
          <div className="queue-content">
            {loading ? (
              <div className="queue-loading">
                <div className="loading-spinner"></div>
                <p>Loading queue data...</p>
              </div>
            ) : error ? (
              <div className="queue-error">
                <p>{error}</p>
              </div>
            ) : getAllQueues().length === 0 ? (
              <div className="queue-empty">
                <p>No active walk-in queue</p>
                <small>When citizens create walk-in appointments, they'll appear here.</small>
              </div>
            ) : (
              <div className="queue-list">
                {getAllQueues().slice(0, 5).map(queue => (
                  <div 
                    key={queue.id} 
                    className={`queue-item ${queue.status === 'serving' ? 'active-queue' : ''}`}
                  >
                    <div className="queue-top">
                      <div className="queue-numberwalk">{queue.queueNumber}</div>
                      <div className={`queue-status ${queue.status}`}>
                        {queue.status === 'serving' ? 'in-progress' : queue.status}
                      </div>
                    </div>
                    <div className="queue-details">
                      <div className="queue-name">{`${queue.firstName} ${queue.lastName}`}</div>
                      <div className="queue-reason">{queue.reasonOfVisit}</div>
                    
                    </div>
                    <div className="queue-actions">
                      {queue.status === 'pending' && (
                        <button 
                          className="queue-action-btn start"
                          onClick={(e) => {
                            e.stopPropagation();
                            updateQueueStatus(queue.id, 'serving');
                          }}
                          aria-label="Start serving this client"
                        >
                          Start
                        </button>
                      )}
                      {queue.status === 'serving' && (
                        <>
                          <button 
                            className="queue-action-btn view"
                            onClick={(e) => {
                              e.stopPropagation();
                              viewQueueDetails(queue.id);
                            }}
                            aria-label="View details of this client"
                          >
                            View Details
                          </button>
                          <button 
                            className="queue-action-btn complete"
                            onClick={(e) => {
                              e.stopPropagation();
                              updateQueueStatus(queue.id, 'completed');
                            }}
                            aria-label="Mark this appointment as completed"
                          >
                            Complete
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminWalkInQueue;