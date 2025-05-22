import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { queueService } from '../../services/queueService';
import axios from 'axios';
import './WalkInQueueAdmin.css';

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

const WalkInQueueAdmin = () => {
  const [pendingQueues, setPendingQueues] = useState([]);
  const [currentQueues, setCurrentQueues] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

// Update the fetchQueueData function
const fetchQueueData = useCallback(async () => {
  setLoading(true);
  try {
    // Try to fetch queues with details directly (if those endpoints exist)
    let pendingData, currentData;
    
    try {
      // First attempt: Try to fetch queues with details included
      [pendingData, currentData] = await Promise.all([
        queueService.fetchPendingQueuesWithDetails(),
        queueService.fetchCurrentQueuesWithDetails()
      ]);
    } catch (e) {
      console.log('Detailed endpoints not available, falling back to basic endpoints');
      // Fallback: Fetch basic queue data without details
      [pendingData, currentData] = await Promise.all([
        queueService.fetchPendingQueues(),
        queueService.fetchCurrentQueues()
      ]);
      
      // Get queue IDs
      const pendingIds = pendingData.map(q => q.id);
      const currentIds = currentData.map(q => q.id);
      const allIds = [...pendingIds, ...currentIds];
      
      if (allIds.length > 0) {
        // Fetch details for all queues in a single request
        try {
          const detailsMap = await queueService.fetchDetailsForMultipleQueues(allIds);
          
          // Attach details to queue objects
          pendingData = pendingData.map(queue => ({
            ...queue,
            userData: detailsMap[queue.id] || {}
          }));
          
          currentData = currentData.map(queue => ({
            ...queue,
            userData: detailsMap[queue.id] || {}
          }));
        } catch (error) {
          console.error('Failed to fetch queue details in bulk:', error);
          
          // Fallback to individual requests if bulk fetch fails
          console.log('Attempting to fetch details individually');
          
          // Fetch details for each pending queue
          const pendingDetailsPromises = pendingData.map(queue => 
            queueService.fetchQueueDetails(queue.id)
              .then(details => ({ ...queue, userData: details }))
              .catch(() => queue) // Keep original queue if details fetch fails
          );
          
          // Fetch details for each current queue
          const currentDetailsPromises = currentData.map(queue => 
            queueService.fetchQueueDetails(queue.id)
              .then(details => ({ ...queue, userData: details }))
              .catch(() => queue) // Keep original queue if details fetch fails
          );
          
          // Wait for all details to be fetched
          pendingData = await Promise.all(pendingDetailsPromises);
          currentData = await Promise.all(currentDetailsPromises);
        }
      }
    }
    
    // Process and format pending queues with details
    const formattedPendingQueues = pendingData.map(queue => {
      console.log('Queue with details:', queue);
      
      // Extract userData from wherever it exists
      const userData = queue.userData || queue.details || queue.user || {};
      
      return {
        id: queue.id || queue._id,
        queueNumber: formatWKNumber(queue.queueNumber || queue.id),
        firstName: userData.firstName || 'Guest',
        lastName: userData.lastName || '',
        reasonOfVisit: userData.reasonOfVisit || userData.reason || userData.service || 'General Inquiry',
        status: queue.status || 'pending',
        timestamp: queue.createdAt || queue.date || new Date().toISOString()
      };
    });
    
    // Process and format current queues with details
    const formattedCurrentQueues = currentData.map(queue => {
      // Extract userData from wherever it exists
      const userData = queue.userData || queue.details || queue.user || {};
      
      return {
        id: queue.id || queue._id,
        queueNumber: formatWKNumber(queue.queueNumber || queue.id),
        firstName: userData.firstName || 'Guest',
        lastName: userData.lastName || '',
        reasonOfVisit: userData.reasonOfVisit || userData.reason || userData.service || 'General Inquiry',
        status: 'in-progress',
        timestamp: queue.createdAt || queue.date || new Date().toISOString()
      };
    });
    
    setPendingQueues(formattedPendingQueues);
    setCurrentQueues(formattedCurrentQueues);
    setError(null);
  } catch (err) {
    console.error('Error fetching queue data:', err);
    setError('Could not load queue data. Please ensure the server is running.');
    setPendingQueues([]);
    setCurrentQueues([]);
  } finally {
    setLoading(false);
  }
}, []);  // Update queue status using the queueService
  const updateQueueStatus = async (queueId, newStatus) => {
    try {
      console.log(`Attempting to update queue ${queueId} to status: ${newStatus}`);
      
      // Parse the queueId if it's not already a number
      const parsedQueueId = parseInt(queueId, 10) || queueId;
      
      // First update local state optimistically to provide immediate feedback
      if (newStatus === 'in-progress') {
        // Move from pending to current
        const queueToMove = pendingQueues.find(q => q.id === queueId || q.id === parsedQueueId);
        if (queueToMove) {
          setPendingQueues(prev => prev.filter(q => q.id !== queueId && q.id !== parsedQueueId));
          setCurrentQueues(prev => [...prev, {...queueToMove, status: 'in-progress'}]);
        }
      } else if (newStatus === 'completed') {
        // Remove from current
        setCurrentQueues(prev => prev.filter(q => q.id !== queueId && q.id !== parsedQueueId));
      } else if (newStatus === 'pending') {
        // Move from current to pending
        const queueToMove = currentQueues.find(q => q.id === queueId || q.id === parsedQueueId);
        if (queueToMove) {
          setCurrentQueues(prev => prev.filter(q => q.id !== queueId && q.id !== parsedQueueId));
          setPendingQueues(prev => [...prev, {...queueToMove, status: 'pending'}]);
        }
      }
      
      // Make API call to update status using queueService
      await queueService.updateQueueStatus(parsedQueueId, newStatus);
      console.log(`Queue status updated successfully: ${queueId} → ${newStatus}`);
      
      // Refresh data after updating to ensure our UI is in sync with the server
      setTimeout(() => fetchQueueData(), 500);
    } catch (error) {
      console.error('Failed to update queue status:', error);
      console.error('Error details:', error.response?.data || error.message);
      
      // Show friendlier error message
      alert('Failed to update queue status. Please try again.');
      
      // Refresh data to revert UI to server state
      fetchQueueData();
    }
  };

  // Combined queues for display
  const getAllQueues = () => {
    // Concatenate and sort by queue number
    const allQueues = [...pendingQueues, ...currentQueues];
    return allQueues.sort((a, b) => {
      const numA = parseInt(a.queueNumber.replace('WK', ''), 10);
      const numB = parseInt(b.queueNumber.replace('WK', ''), 10);
      return numA - numB;
    });
  };
  // Fetch queue data on component mount and refresh periodically
  useEffect(() => {
    console.log('WalkInQueueAdmin: Initial data fetch');
    fetchQueueData();
    
    // Refresh queue data every 30 seconds
    const intervalId = setInterval(() => {
      console.log('WalkInQueueAdmin: Auto-refreshing queue data');
      fetchQueueData();
    }, 30000);
    
    // Clean up on component unmount
    return () => {
      console.log('WalkInQueueAdmin: Cleanup - clearing interval');
      clearInterval(intervalId);
    };
  }, [fetchQueueData]);

  return (
    <div className="admin-walk-in-queue">
      {/* Queue stats summary */}
      {!loading && !error && (pendingQueues.length > 0 || currentQueues.length > 0) && (
        <div className="queue-stats">
          <div className="queue-stat">
            <span className="queue-stat-value">{pendingQueues.length + currentQueues.length}</span>
            <span className="queue-stat-label">Total</span>
          </div>
          <div className="queue-stat">
            <span className="queue-stat-value">{pendingQueues.length}</span>
            <span className="queue-stat-label">Waiting</span>
          </div>
          <div className="queue-stat">
            <span className="queue-stat-value">{currentQueues.length}</span>
            <span className="queue-stat-label">In Progress</span>
          </div>
        </div>
      )}
      
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
            {/* Show only the first 5 items for preview */}
            {getAllQueues().slice(0, 5).map(queue => (
              <div 
                key={queue.id} 
                className={`queue-item ${queue.status === 'in-progress' ? 'active-queue' : ''}`}
              >
                <div className="queue-top">
                  <div className="queue-number">{queue.queueNumber}</div>
                  <div className={`queue-status ${queue.status}`}>
                    {queue.status}
                  </div>
                </div>
                <div className="queue-details">
                  <div className="queue-name">{`${queue.firstName} ${queue.lastName}`}</div>
                  <div className="queue-reason">{queue.reasonOfVisit}</div>
                  <div className="queue-time">
                    {new Date(queue.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
                <div className="queue-actions">
                  {queue.status === 'pending' && (
                    <button 
                      className="queue-action-btn start"
                      onClick={() => updateQueueStatus(queue.id, 'in-progress')}
                      aria-label="Start serving this client"
                    >
                      Start
                    </button>
                  )}
                  {queue.status === 'in-progress' && (
                    <button 
                      className="queue-action-btn complete"
                      onClick={() => updateQueueStatus(queue.id, 'completed')}
                      aria-label="Mark this appointment as completed"
                    >
                      Complete
                    </button>
                  )}
                </div>
              </div>
            ))}
            
            {/* Show a message if there are more items */}
            {getAllQueues().length > 5 && (
              <div className="queue-more-info">
                <p>+ {getAllQueues().length - 5} more queued visitors</p>
              </div>
            )}
          </div>
        )}
        
        <div className="queue-footer">
          <Link to="/AdminWalkInQueue" className="view-all-btn">
            View All Queues
          </Link>
        </div>
      </div>
    </div>
  );
};

export default WalkInQueueAdmin;