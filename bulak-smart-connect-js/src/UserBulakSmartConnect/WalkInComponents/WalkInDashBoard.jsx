import React, { useState, useEffect, useCallback } from 'react';
import QueueListWalkIn from './WalkInQueueList';
import './WalkInQueue.css';
import NavBar from '../../NavigationComponents/NavSide';
import { io } from 'socket.io-client';
import { queueService } from '../../services/queueService';

// Format queue number to WK format
const formatWKNumber = (queueNumber) => {
  if (typeof queueNumber === 'string' && queueNumber.startsWith('WK')) {
    return queueNumber; // Already in right format
  }
  
  // Extract number from backend format or use as is
  const numberPart = queueNumber.includes('-') 
    ? queueNumber.split('-')[1]
    : queueNumber;
  
  // Convert to number and format as WK format
  const num = parseInt(numberPart, 10) || 0;
  return `WK${String(num).padStart(3, '0')}`;
};

const WalkInQueueContainer = () => {
  const [queuePosition, setQueuePosition] = useState(null); 
  const [currentQueue, setCurrentQueue] = useState([]); 
  const [pendingQueues, setPendingQueues] = useState([]);
  const [userQueue, setUserQueue] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true); 

  // Add near the top of your component
  useEffect(() => {
    // Verify if the stored userQueue is valid on page load
    const validateUserQueue = async () => {
      try {
        const storedUserQueue = localStorage.getItem('userQueue');
        if (!storedUserQueue) return;
        
        const userQueueData = JSON.parse(storedUserQueue);
        
        // Check if this queue still exists in the system
        const queueId = userQueueData.dbId || 
          (userQueueData.id?.startsWith('WK') ? userQueueData.id.replace('WK', '') : userQueueData.id);
        
        if (queueId) {
          const isValid = await queueService.checkQueueExists(queueId)
            .catch(() => false);
          
          if (!isValid) {
            console.log('User queue not found in system - clearing');
            localStorage.removeItem('userQueue');
            setUserQueue(null);
          }
        }
      } catch (err) {
        console.error('Error validating user queue:', err);
      }
    };
    
    validateUserQueue();
  }, []);

  // Update your fetchQueueData function to clear localStorage when API returns empty

  const fetchQueueData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Make API calls in parallel
      const promises = [
        queueService.fetchCurrentQueues().catch(err => {
          console.error('Error fetching current queues:', err);
          return []; 
        }),
        queueService.fetchPendingQueues().catch(err => {
          console.error('Error fetching pending queues:', err);
          return [];
        })
      ];
      
      // Get stored user queue after API calls (to possibly clear it)
      const storedUserQueue = localStorage.getItem('userQueue');
      let userQueueData = null;
      
      if (storedUserQueue) {
        try {
          userQueueData = JSON.parse(storedUserQueue);
          setUserQueue(userQueueData);
        } catch (e) {
          console.error('Error parsing user queue from localStorage:', e);
        }
      }
      
      // Add position request if we have a user queue
      if (userQueueData && (userQueueData.dbId || userQueueData.id)) {
        const queueId = userQueueData.dbId || (userQueueData.id?.startsWith('WK') 
          ? userQueueData.id.replace('WK', '') 
          : userQueueData.id);
        
        if (queueId) {
          promises.push(
            queueService.getQueuePosition(queueId)
              .then(data => data)
              .catch(() => ({ position: queuePosition }))
          );
        }
      }
      
      // Wait for all requests to complete
      const [currentQueuesResponse, pendingQueuesResponse, positionResponse] = await Promise.all(promises);
      
      // IMPORTANT: Clear localStorage if API returns empty arrays - the database has been cleared
      if (Array.isArray(currentQueuesResponse) && currentQueuesResponse.length === 0 && 
          Array.isArray(pendingQueuesResponse) && pendingQueuesResponse.length === 0) {
        console.log('API returned empty data - clearing localStorage cache');
        localStorage.removeItem('currentQueue');
        localStorage.removeItem('pendingQueues');
        // Only remove userQueue if position API also returns no data
        if (!positionResponse || positionResponse.position === undefined) {
          localStorage.removeItem('userQueue');
        }
      }
      
      // Process current queue data with detailed logging
      console.log('Raw current queues data:', currentQueuesResponse);
      
      // Always update state with latest API data, even if empty
      if (Array.isArray(currentQueuesResponse)) {
        const formattedCurrentQueues = currentQueuesResponse.length > 0 
          ? currentQueuesResponse.map(queue => {
              const queueNumber = queue.queueNumber || queue.number || queue.id;
              const counterNumber = queue.counterNumber || queue.counter || '1';
              
              return {
                id: formatWKNumber(queueNumber),
                counter: `COUNTER ${counterNumber}`
              };
            })
          : [];
        
        console.log('Setting current queues to:', formattedCurrentQueues);
        setCurrentQueue(formattedCurrentQueues);
        
        // Store in localStorage ONLY if there's actual data
        if (formattedCurrentQueues.length > 0) {
          localStorage.setItem('currentQueue', JSON.stringify(formattedCurrentQueues));
        } else {
          localStorage.removeItem('currentQueue');
        }
      }
      
      // Process pending queues - ENSURE user's queue is filtered out
      if (Array.isArray(pendingQueuesResponse)) {
        // First format all pending queues
        const formattedPendingQueues = pendingQueuesResponse.length > 0
          ? pendingQueuesResponse.map(queue => {
              const queueId = formatWKNumber(queue.queueNumber || queue.id);
              return {
                id: queueId,
                rawId: queue.id, // Store the raw ID for comparison
                date: new Date(queue.createdAt || Date.now()).toLocaleDateString('en-US', {
                  month: '2-digit', day: '2-digit', year: '2-digit'
                })
              };
            })
          : [];
        
        console.log('All pending queues before filtering:', formattedPendingQueues);
        
        // Check if we have a valid userQueue
        let validUserQueue = null;
        
        if (userQueueData) {
          // Check if this user queue actually exists in the pending queues
          const matchingQueue = formattedPendingQueues.find(queue => 
            queue.id === userQueueData.id || 
            queue.rawId === userQueueData.dbId
          );
          
          if (matchingQueue) {
            console.log('Found matching user queue in pending queues:', matchingQueue);
            validUserQueue = {
              ...userQueueData,
              date: matchingQueue.date // Use the latest date from the API
            };
            setUserQueue(validUserQueue);
            
            // Save updated user queue to localStorage
            localStorage.setItem('userQueue', JSON.stringify(validUserQueue));
          } else {
            console.log('User queue not found in pending queues - clearing user queue');
            setUserQueue(null);
            localStorage.removeItem('userQueue');
          }
        }
        
        // Now filter out the user's queue from pending queues
        const filteredPendingQueues = formattedPendingQueues.filter(queue => {
          if (!validUserQueue) return true;
          
          return queue.id !== validUserQueue.id && 
                 queue.rawId !== validUserQueue.dbId;
        });
        
        console.log('Filtered pending queues (without user queue):', filteredPendingQueues);
        setPendingQueues(filteredPendingQueues);
        
        // Only store if we have data
        if (filteredPendingQueues.length > 0) {
          localStorage.setItem('pendingQueues', JSON.stringify(filteredPendingQueues));
        } else {
          localStorage.removeItem('pendingQueues');
        }
      }
      
      // Update position if we have data
      if (positionResponse && positionResponse.position !== undefined) {
        setQueuePosition(positionResponse.position);
      } else {
        setQueuePosition(null);
      }
      
      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch queue data:', error);
      setLoading(false);
    }
  }, [queuePosition]);

  // Add this function and call it periodically
  const syncWithOtherTabs = useCallback(() => {
    // Handle forced sync from any tab
    const handleStorageChange = (e) => {
      if (e.key === 'lastSyncTime' || e.key === 'forceSync') {
        console.log('Sync triggered from another tab:', e.key);
        
        // Force a complete refresh of all data
        if (e.key === 'forceSync') {
          setUserQueue(null);
          setPendingQueues([]);
          setCurrentQueue([]);
        }
        
        fetchQueueData();
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, [fetchQueueData]);

  // Update your initial loading useEffect
  useEffect(() => {
    // Skip localStorage and just load from API directly
    // This ensures we always start with fresh data
    setLoading(true);
    fetchQueueData();
  }, [fetchQueueData]);

  // WebSocket connection for real-time updates
  useEffect(() => {
    // Only connect if not already connected
    let socket = null;
    
    try {
      socket = io('http://localhost:3000', {
        transports: ['websocket'],
        reconnectionAttempts: 3,
        timeout: 5000,
        forceNew: false
      });
      
      socket.on('connect', () => {
        console.log('Socket connected successfully');
        
        // Join queue update events
        socket.emit('joinQueueList');
        console.log('Joined queue list updates');
        
        if (userQueue?.dbId) {
          socket.emit('joinQueue', userQueue.dbId);
          console.log('Joined specific queue room:', userQueue.dbId);
        }
      });

      socket.on('queueListUpdate', (data) => {
        console.log('Queue list update event received:', data);
        
        // Clear localStorage cache to force fresh data
        if (data && data.action === 'cleared') {
          console.log('Database was cleared - removing cached data');
          localStorage.removeItem('currentQueue');
          localStorage.removeItem('pendingQueues');
          setCurrentQueue([]);
          setPendingQueues([]);
        }
        
        // Always fetch fresh data
        fetchQueueData();
      });

      socket.on('queueUpdate', (data) => {
        console.log('Queue update event received:', data);
        fetchQueueData();
      });

      socket.on('error', (error) => {
        console.error('Socket error:', error);
      });

      socket.on('disconnect', (reason) => {
        console.log('Socket disconnected:', reason);
      });
      
      // Clean up function
      return () => {
        if (socket) {
          socket.disconnect();
          socket = null;
        }
        if (window.queueUpdateTimeout) {
          clearTimeout(window.queueUpdateTimeout);
        }
      };
    } catch (err) {
      console.error('Socket connection error:', err);
      return () => {
        if (socket) socket.disconnect();
      };
    }
  }, [userQueue?.dbId]); // Only depend on userQueue.dbId, not the entire object

  // Use this in a useEffect
  useEffect(() => {
    const cleanup = syncWithOtherTabs();
    
    // Periodically check for updates
    const intervalId = setInterval(() => {
      fetchQueueData();
    }, 30000); // Check every 30 seconds
    
    return () => {
      cleanup();
      clearInterval(intervalId);
    };
  }, [fetchQueueData, syncWithOtherTabs]);

  return (
    <div className={`QueueContainerWalkIn${isSidebarOpen ? ' sidebar-open' : ''}`}>
      <NavBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="HeaderWalkIn">
        <h1>Walk - In</h1>
      </div>
      <div className="WalkInDashboard">
        <div className="HeadWalkIn">
          <div className="QueuePositionContainerWalkIn">
            <div className="QueuePositionLabelWalkIn">QUEUE POSITION</div>
            <div className="QueuePositionNumberWalkIn">
              {loading ? '...' : (queuePosition || '-')}
            </div>
            <div className="QueuePositionMessageWalkIn">
              {loading ? 'Loading...' : "You'll be notified when it's almost your turn"}
            </div>
            {/* Debug info - remove in production */}
            <div style={{fontSize: '10px', color: '#999', marginTop: '5px'}}>
              {userQueue?.dbId ? `ID: ${userQueue.dbId}` : 'No queue ID found'}
            </div>
          </div>

          <div className="CurrentQueueContainerWalkIn">
            <div className="CurrentQueueLabelWalkIn">CURRENT QUEUE</div>
            <div className="CurrentQueueListWalkIn">
              {loading ? (
                <div style={{padding: '10px', color: '#666', textAlign: 'center'}}>Loading...</div>
              ) : currentQueue.length === 0 ? (
                <div style={{padding: '10px', color: '#666', textAlign: 'center'}}>No queues currently being served</div>
              ) : (
                currentQueue.map((item, index) => (
                  <div key={index} className="CurrentQueueItemWalkIn">
                    <span className="QueueIdWalkIn">{item.id}</span>
                    <span className="CounterNumberWalkIn">{item.counter}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div className="FooterWalkIn">
          <div className="FooterTitleWalkIn">Walk - In Queues</div>
          <button
            className="GetQueueButtonWalkIn"
            onClick={() => (window.location.href = '/WalkInForm')}
          >
            Get Queue Number
          </button>
          <div className="QueueListWalkIn">
            {pendingQueues.length === 0 && !userQueue ? (
              <div style={{padding: '15px', color: '#666', textAlign: 'center', background: '#f9f9f9', borderRadius: '8px'}}>
                No queues waiting
              </div>
            ) : (
              <QueueListWalkIn pendingQueues={pendingQueues} userQueue={userQueue} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalkInQueueContainer;
