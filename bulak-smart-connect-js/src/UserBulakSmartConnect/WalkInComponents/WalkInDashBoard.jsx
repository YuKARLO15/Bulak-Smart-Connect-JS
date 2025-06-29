import React, { useState, useEffect, useCallback } from 'react';
import QueueListWalkIn from './WalkInQueueList';
import './WalkInQueue.css';
import NavBar from '../../NavigationComponents/NavSide';
import { io } from 'socket.io-client';
import { queueService } from '../../services/queueService';
import FloatingAnnouncementFab from '../../LandingPageComponents/FloatingAnnouncement';
import { Box, Button, Container, Grid, Typography, Card, CardContent } from '@mui/material';
import config from '../../config/env.js';

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

// Add this function to get current user ID
const getCurrentUserId = () => {
  try {
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    return currentUser?.id || currentUser?.email || 'guest';
  } catch (e) {
    console.error('Error getting current user:', e);
    return 'guest';
  }
};

const WalkInQueueContainer = () => {
  const [queuePosition, setQueuePosition] = useState(null); 
  const [currentQueue, setCurrentQueue] = useState([]); // Make sure this is currentQueue, not currentQueues
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

  // Update your getAllUserQueues function
const getAllUserQueues = () => {
  try {
    const userId = getCurrentUserId();
    console.log('Getting ALL queues for user:', userId);
    
    // Try user-specific storage first
    const userSpecificQueueKey = `userQueue_${userId}`;
    const userSpecificQueuesKey = `userQueues_${userId}`;
    
    const storedUserQueue = localStorage.getItem(userSpecificQueueKey);
    const storedUserQueues = localStorage.getItem(userSpecificQueuesKey);
    
    let userQueues = [];
    
    // Parse the stored queue(s) - PREFER MULTIPLE QUEUES
    if (storedUserQueues) {
      const parsedQueues = JSON.parse(storedUserQueues);
      if (Array.isArray(parsedQueues)) {
        userQueues = parsedQueues;
      } else if (parsedQueues) {
        userQueues = [parsedQueues];
      }
    } else if (storedUserQueue) {
      const parsedQueue = JSON.parse(storedUserQueue);
      if (parsedQueue) {
        userQueues = [parsedQueue];
      }
    } else {
      // Fallback to generic keys for backward compatibility
      const genericQueue = localStorage.getItem('userQueue');
      if (genericQueue) {
        try {
          const parsedQueue = JSON.parse(genericQueue);
          // Check if this queue belongs to current user or doesn't have user info
          if (!parsedQueue.userId || parsedQueue.userId === userId) {
            userQueues = [parsedQueue];
          }
        } catch (e) {
          console.error('Error parsing generic queue:', e);
        }
      }
    }
    
    // Filter queues that belong to current user
    userQueues = userQueues.filter(queue => 
      !queue.userId || queue.userId === userId
    );
    
    console.log('Found user queues:', userQueues);
    return userQueues;
  } catch (err) {
    console.error('Error getting user queues:', err);
    return [];
  }
};

  // Update your fetchQueueData function to clear localStorage when API returns empty

  const fetchQueueData = useCallback(async () => {
    try {
      setLoading(true);
      
      // Get current user
      const currentUser = getCurrentUserId();
      
      // Make API calls in parallel
      const promises = [
        queueService.fetchCurrentQueues().catch(err => {
          console.error('Error fetching current queues:', err);
          return []; 
        }),
        queueService.fetchPendingQueues().catch(err => {
          console.error('Error fetching pending queues:', err);
          return [];
        }),
        queueService.fetchUserQueues(currentUser).catch(err => {
          console.error('Error fetching user queues:', err);
          return [];
        })
      ];
      
      // Get stored user queue for fallback
      const storedUserQueue = localStorage.getItem('userQueue');
      let localUserQueueData = null;
      
      if (storedUserQueue) {
        try {
          localUserQueueData = JSON.parse(storedUserQueue);
        } catch (e) {
          console.error('Error parsing user queue from localStorage:', e);
        }
      }

      // Wait for all requests to complete
      const [currentQueuesResponse, pendingQueuesResponse, userQueuesResponse] = await Promise.all(promises);
      
      // Process user queues from backend FIRST, fallback to localStorage
      if (userQueuesResponse && Array.isArray(userQueuesResponse) && userQueuesResponse.length > 0) {
        console.log('Using user queues from backend:', userQueuesResponse);
        
        // Filter out completed queues and clear them from localStorage
        const activeUserQueues = userQueuesResponse.filter(queue => {
          if (queue.status === 'completed') {
            console.log('Found completed queue, clearing from localStorage:', queue.id);
            
            // Clear completed queue from localStorage
            const userId = getCurrentUserId();
            localStorage.removeItem('userQueue');
            localStorage.removeItem(`userQueue_${userId}`);
            
            // Remove from user queues array
            try {
              const storedQueues = localStorage.getItem(`userQueues_${userId}`);
              if (storedQueues) {
                const userQueues = JSON.parse(storedQueues);
                const filteredQueues = userQueues.filter(q => q.dbId !== queue.id);
                localStorage.setItem(`userQueues_${userId}`, JSON.stringify(filteredQueues));
              }
            } catch (e) {
              console.error('Error updating user queues:', e);
            }
            
            return false; // Don't include completed queues
          }
          return queue.status === 'pending' || queue.status === 'serving';
        });
        
        if (activeUserQueues.length > 0) {
          const validUserQueues = activeUserQueues.map(queue => ({
            id: formatWKNumber(queue.queueNumber || queue.id),
            dbId: queue.id,
            queueNumber: formatWKNumber(queue.queueNumber || queue.id),
            date: new Date(queue.createdAt).toLocaleDateString('en-US', {
              month: '2-digit', 
              day: '2-digit', 
              year: '2-digit'
            }),
            userData: {
              firstName: queue.firstName,
              lastName: queue.lastName,
              reasonOfVisit: queue.reasonOfVisit
            },
            userId: currentUser,
            isUserQueue: true,
            status: queue.status, 
            isPrimaryQueue: true  
          }));
          
          console.log('Valid active user queues:', validUserQueues);
          setUserQueue(validUserQueues);
          
          // Get position for user's active queue
          const pendingQueue = validUserQueues.find(q => q.status === 'pending');
          const servingQueue = validUserQueues.find(q => q.status === 'serving');
          
          if (servingQueue) {
            console.log('User queue is being served');
            setQueuePosition('NOW SERVING');
          } else if (pendingQueue) {
            console.log('Found pending queue, getting position for:', pendingQueue.dbId);
            try {
              const positionData = await queueService.getQueuePosition(pendingQueue.dbId);
              console.log('Position data received:', positionData);
              
              if (positionData.status === 'serving') {
                setQueuePosition('NOW SERVING');
              } else if (positionData.position > 0) {
                setQueuePosition(positionData.position);
              } else {
                setQueuePosition(null);
              }
            } catch (error) {
              console.error('Error fetching position:', error);
              setQueuePosition(null);
            }
          } else {
            console.log('No active queue found');
            setQueuePosition(null);
          }
        } else {
          console.log('No active user queues, clearing state');
          setUserQueue(null);
          setQueuePosition(null);
        }
      } else if (localUserQueueData) {
        // Fallback to localStorage - but also check if it's completed
        console.log('Using user queue from localStorage as fallback');
        
        // Check if localStorage queue is completed by fetching its current status
        const userQueuesData = getAllUserQueues();
        if (userQueuesData.length > 0) {
          const firstQueue = userQueuesData[0];
          if (firstQueue && firstQueue.dbId) {
            try {
              // Check current status of the queue
              const queueDetails = await queueService.getQueueDetails(firstQueue.dbId);
              
              if (queueDetails.status === 'completed') {
                console.log('localStorage queue is completed, clearing');
                const userId = getCurrentUserId();
                localStorage.removeItem('userQueue');
                localStorage.removeItem(`userQueue_${userId}`);
                localStorage.removeItem(`userQueues_${userId}`);
                setUserQueue(null);
                setQueuePosition(null);
              } else {
                // Queue is still active, proceed normally
                setUserQueue(localUserQueueData);
                
                const positionData = await queueService.getQueuePosition(firstQueue.dbId);
                if (queueDetails.status === 'serving') {
                  setQueuePosition('NOW SERVING');
                } else if (positionData.position > 0) {
                  setQueuePosition(positionData.position);
                } else {
                  setQueuePosition(null);
                }
              }
            } catch (error) {
              console.error('Error checking queue status:', error);
              setUserQueue(localUserQueueData);
              setQueuePosition(null);
            }
          }
        }
      } else {
        setUserQueue(null);
        setQueuePosition(null);
      }
      
      // Process current queues - FIX: Use setCurrentQueue instead of setCurrentQueues
      if (currentQueuesResponse && Array.isArray(currentQueuesResponse)) {
        console.log('Raw current queues data:', currentQueuesResponse);
        
        const formattedCurrentQueues = currentQueuesResponse.map(queue => {
          const details = Array.isArray(queue.details) ? queue.details[0] : queue.details;
          
          return {
            id: formatWKNumber(queue.queueNumber || queue.id),
            dbId: queue.id,
            queueNumber: formatWKNumber(queue.queueNumber || queue.id),
            firstName: details?.firstName || 'N/A',
            lastName: details?.lastName || 'N/A',
            counterNumber: queue.counterNumber || 'N/A',
            status: queue.status,
            userData: {
              firstName: details?.firstName,
              lastName: details?.lastName,
              reasonOfVisit: details?.reasonOfVisit
            }
          };
        });
        
        console.log('Setting current queues to:', formattedCurrentQueues);
        setCurrentQueue(formattedCurrentQueues); // FIXED: Use setCurrentQueue
      } else {
        setCurrentQueue([]); // FIXED: Use setCurrentQueue
      }

      // Process pending queues
      if (pendingQueuesResponse && Array.isArray(pendingQueuesResponse)) {
        console.log('All pending queues before filtering:', pendingQueuesResponse);
        
        const userQueuesData = getAllUserQueues();
        
        const filteredPendingQueues = pendingQueuesResponse.filter(queue => {
          const queueDbId = queue.id;
          const formattedQueueNumber = formatWKNumber(queue.queueNumber || queue.id);
          
          // Check if this queue belongs to the current user
          const isUserQueue = userQueuesData.some(userQueue => {
            const userDbId = userQueue.dbId;
            const userFormattedNumber = userQueue.id || userQueue.queueNumber;
            
            return userDbId === queueDbId || userFormattedNumber === formattedQueueNumber;
          });
          
          return !isUserQueue;
        });

        const formattedPendingQueues = filteredPendingQueues.map(queue => {
          const details = Array.isArray(queue.details) ? queue.details[0] : queue.details;
          
          return {
            id: formatWKNumber(queue.queueNumber || queue.id),
            dbId: queue.id,
            queueNumber: formatWKNumber(queue.queueNumber || queue.id),
            date: new Date(queue.createdAt).toLocaleDateString('en-US', {
              month: '2-digit', 
              day: '2-digit', 
              year: '2-digit'
            }),
            firstName: details?.firstName || 'N/A',
            lastName: details?.lastName || 'N/A',
            reasonOfVisit: details?.reasonOfVisit || 'N/A',
            userData: {
              firstName: details?.firstName,
              lastName: details?.lastName,
              reasonOfVisit: details?.reasonOfVisit
            }
          };
        });

        setPendingQueues(formattedPendingQueues);
      } else {
        setPendingQueues([]);
      }

      setLoading(false);
    } catch (error) {
      console.error('Failed to fetch queue data:', error);
      setLoading(false);
    }
  }, []);

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
      socket = io(config.WS_URL, {
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
        
        // If user's queue was completed, clear it immediately
        if (data.status === 'completed') {
          setUserQueue(prev => {
            if (!prev) return null;
            
            const userQueueArray = Array.isArray(prev) ? prev : [prev];
            const completedQueue = userQueueArray.find(q => q.dbId === data.queueId);
            
            if (completedQueue) {
              console.log('User queue completed via socket, clearing localStorage');
              const userId = getCurrentUserId();
              localStorage.removeItem('userQueue');
              localStorage.removeItem(`userQueue_${userId}`);
              localStorage.removeItem(`userQueues_${userId}`);
              
              setQueuePosition(null);
              return null;
            }
            
            return prev;
          });
        }
        
        // Refresh data for other updates
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
              {loading ? '...' : 
                queuePosition === 'NOW SERVING' ? 'NOW SERVING' :
                (queuePosition !== null && queuePosition > 0 ? queuePosition : '-')
              }
            </div>
            <div className="QueuePositionMessageWalkIn">
              {loading ? 'Loading...' : 
                queuePosition === 'NOW SERVING' ? 'Please proceed to the counter' :
                userQueue && Array.isArray(userQueue) && userQueue.length > 0 ? 
                  (queuePosition !== null && queuePosition > 0 ? 
                    `You are #${queuePosition} in line` : 
                    `You have ${userQueue.length} queue${userQueue.length > 1 ? 's' : ''}`
                  ) : 
                  "You'll be notified when it's almost your turn"
              }
            </div>
            {/* Show user queue info if available */}
            {userQueue && (
              <div style={{fontSize: '12px', color: '#24536a', marginTop: '5px', fontWeight: 'bold'}}>
                {Array.isArray(userQueue) && userQueue.length > 1 ? 
                  `${userQueue.length} Active Queues: ${userQueue.map(q => q.id).join(', ')}` :
                  `Your Queue: ${Array.isArray(userQueue) ? userQueue[0]?.id : userQueue.id}`
                }
              </div>
            )}
            {/* Debug info */}
            <div style={{fontSize: '10px', color: '#999', marginTop: '5px'}}>
              {userQueue ? 
                `Queues: ${Array.isArray(userQueue) ? userQueue.length : 1} | Position: ${queuePosition}` : 
                'No queue found'
              }
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
          <Box className="AnnouncementButtonContainer">
          <FloatingAnnouncementFab/>
          </Box>
      </div>
    </div>
  );
};

export default WalkInQueueContainer;
