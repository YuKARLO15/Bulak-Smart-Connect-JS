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
  const [debugMode, setDebugMode] = useState(false);
  const [debugData, setDebugData] = useState(null);

  // Update the fetchQueueData function
  const fetchQueueData = useCallback(async () => {
  setLoading(true);
  try {
    // Simplify the fetch approach to match what works in AdminWalkInDetails
    const [pendingData, currentData] = await Promise.all([
      queueService.fetchPendingQueuesWithDetails(),
      queueService.fetchCurrentQueuesWithDetails()
    ]);
    
    console.log('Queue data fetched:', pendingData, currentData);
    
    // Process the data similar to how AdminWalkInDetails handles it
    const formattedPendingQueues = pendingData.map(queueDetail => {
      const queue = queueDetail.queue || {};
      const details = queueDetail.details || {};
      const user = details.user || {};
      
      return {
        id: queue.id || queueDetail.id,
        queueNumber: formatWKNumber(queue.queueNumber || queue.id),
        firstName: details.firstName || user.firstName || queue.firstName || 'Guest',
        lastName: details.lastName || user.lastName || queue.lastName || '',
        reasonOfVisit: details.reasonOfVisit || queue.reason || queue.reasonOfVisit || 'General Inquiry',
        status: queue.status || 'pending',
        timestamp: queue.createdAt || queue.date || new Date().toISOString()
      };
    });
      const formattedCurrentQueues = currentData.map(queueDetail => {
      const queue = queueDetail.queue || {};
      const details = queueDetail.details || {};
      const user = details.user || {};
      
      return {
        id: queue.id || queueDetail.id,
        queueNumber: formatWKNumber(queue.queueNumber || queue.id),
        firstName: details.firstName || user.firstName || queue.firstName || 'Guest',
        lastName: details.lastName || user.lastName || queue.lastName || '',
        reasonOfVisit: details.reasonOfVisit || queue.reason || queue.reasonOfVisit || 'General Inquiry',
        status: queue.status || 'in-progress',
        timestamp: queue.createdAt || queue.date || new Date().toISOString()
      };
    });


    setPendingQueues(formattedPendingQueues);
    setCurrentQueues(formattedCurrentQueues);
    setError(null);
  } catch (err) {
    console.error('Error fetching queue data:', err);
    setError('Could not load queue data. Please ensure the server is running.');
  } finally {
    setLoading(false);
  }
}, []);

  // Update queue status (we should add this to queueService later)
  const updateQueueStatus = async (queueId, newStatus) => {
    try {
      // Make API call to update status
      await axios.patch(`http://localhost:3000/queue/${queueId}/status`, { 
        status: newStatus 
      });
      
      // Update local state based on new status
      if (newStatus === 'in-progress') {
        // Move from pending to current
        const queueToMove = pendingQueues.find(q => q.id === queueId);
        if (queueToMove) {
          setPendingQueues(prev => prev.filter(q => q.id !== queueId));
          setCurrentQueues(prev => [...prev, {...queueToMove, status: 'in-progress'}]);
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
    fetchQueueData();
    
    // Refresh queue data every 30 seconds
    const intervalId = setInterval(fetchQueueData, 30000);
    
    // Clean up on component unmount
    return () => clearInterval(intervalId);
  }, [fetchQueueData]);

  // Direct test of an endpoint - for debugging
  const testEndpoint = async (endpoint) => {
    try {
      const response = await axios.get(`http://localhost:3000${endpoint}`);
      alert(`Response from ${endpoint}:\n${JSON.stringify(response.data, null, 2).slice(0, 300)}...`);
      console.log(`Full response from ${endpoint}:`, response.data);
    } catch (err) {
      alert(`Error testing ${endpoint}: ${err.message}`);
      console.error(`Error testing ${endpoint}:`, err);
    }
  };

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
            {/* Reload button for error cases */}
            <button 
              onClick={fetchQueueData} 
              className="retry-btn"
              style={{
                padding: '8px 16px',
                background: '#1C4D5A',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                marginTop: '10px',
                cursor: 'pointer'
              }}
            >
              Retry
            </button>
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
      
      {/* Debug panel - hidden by default */}
      {debugMode && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          background: 'white',
          border: '1px solid #ddd',
          padding: '15px',
          borderRadius: '5px',
          boxShadow: '0 0 10px rgba(0,0,0,0.1)',
          zIndex: 9999,
          maxWidth: '400px',
          maxHeight: '80vh',
          overflow: 'auto'
        }}>
          <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <h3 style={{margin: '0 0 10px'}}>API Response Debug</h3>
            <button onClick={() => setDebugMode(false)}>Close</button>
          </div>
          
          {debugData ? (
            <>
              <p><strong>Queue Count:</strong> {debugData.queueCount || 0}</p>
              <p><strong>Queue Properties:</strong> {debugData.dataStructure || 'No data'}</p>
              <div>
                <strong>Test API Endpoints:</strong>
                <div style={{display: 'flex', flexDirection: 'column', gap: '5px', margin: '5px 0'}}>
                  <button onClick={() => testEndpoint('/queue/pending')}>Test /queue/pending</button>
                  <button onClick={() => testEndpoint('/queue/pending/details')}>Test /queue/pending/details</button>
                  {debugData.rawPendingQueue && debugData.rawPendingQueue.id && (
                    <button onClick={() => testEndpoint(`/queue/${debugData.rawPendingQueue.id}/details`)}>
                      Test /queue/{debugData.rawPendingQueue.id}/details
                    </button>
                  )}
                </div>
              </div>
              <p><strong>Raw Queue Data:</strong></p>
              <pre style={{
                background: '#f5f5f5', 
                padding: '10px', 
                overflow: 'auto',
                fontSize: '12px'
              }}>
                {JSON.stringify(debugData.rawPendingQueue, null, 2)}
              </pre>
            </>
          ) : (
            <p>No queue data available for debugging</p>
          )}
        </div>
      )}

      {/* Debug toggle button */}
      <button 
        onClick={() => setDebugMode(!debugMode)}
        style={{
          position: 'fixed',
          bottom: '10px',
          right: '10px',
          padding: '5px 10px',
          background: '#f0f0f0',
          border: '1px solid #ccc',
          borderRadius: '4px',
          opacity: debugMode ? 0 : 0.7,
          zIndex: 9990
        }}
      >
        Debug
      </button>
    </div>
  );
};

export default WalkInQueueAdmin;