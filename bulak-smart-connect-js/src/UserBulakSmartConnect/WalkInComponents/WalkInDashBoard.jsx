import React, { useState, useEffect, useCallback } from 'react';
import QueueListWalkIn from './WalkInQueueList';
import './WalkInQueue.css';
import NavBar from '../../NavigationComponents/NavSide';
import { io } from 'socket.io-client';
import { queueService } from '../../services/queueService';
import FloatingAnnouncementFab from '../../LandingPageComponents/FloatingAnnouncement';
import { Box, Button, Container, Grid, Typography, Card, CardContent } from '@mui/material';

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
      
      // Make API calls in parallel - ADD user queues fetch
      const promises = [
        queueService.fetchCurrentQueues().catch(err => {
          console.error('Error fetching current queues:', err);
          return []; 
        }),
        queueService.fetchPendingQueues().catch(err => {
          console.error('Error fetching pending queues:', err);
          return [];
        }),
        // ADD THIS: Fetch user queues from backend
        queueService.fetchUserQueues(currentUser).catch(err => {
          console.error('Error fetching user queues:', err);
          return [];
        })
      ];
      
      // Get stored user queue after API calls (keep for fallback)
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
      if (userQueuesResponse && userQueuesResponse.length > 0) {
        console.log('Using user queues from backend:', userQueuesResponse);
        
        const validUserQueues = userQueuesResponse.map(queue => ({
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
          status: queue.status
        }));
        
        setUserQueue(validUserQueues);
        
        // Get position for user's active queue
        const activeQueue = validUserQueues.find(q => q.status === 'pending');
        if (activeQueue) {
          const positionData = await queueService.getQueuePosition(activeQueue.dbId);
          setQueuePosition(positionData.position);
        }
      } else if (localUserQueueData) {
        // Fallback to localStorage if backend has no data
        console.log('Using user queue from localStorage as fallback');
        setUserQueue(localUserQueueData);
        
        // Try to get position for localStorage queue
        const userQueuesData = getAllUserQueues();
        if (userQueuesData.length > 0) {
          userQueuesData.forEach(userQueue => {
            const queueId = userQueue.dbId || (userQueue.id?.startsWith('WK') 
              ? userQueue.id.replace('WK', '') 
              : userQueue.id);
            
            if (queueId) {
              promises.push(
                queueService.getQueuePosition(queueId)
                  .then(data => ({ ...data, queueId, userQueue }))
                  .catch(err => {
                    console.error(`Error fetching position for queue ${queueId}:`, err);
                    return { position: null, queueId, userQueue };
                  })
              );
            }
          });
        }
      } else {
        setUserQueue(null);
        setQueuePosition(null);
      }
      
      // IMPORTANT: Clear localStorage if API returns empty arrays - the database has been cleared
      if (Array.isArray(currentQueuesResponse) && currentQueuesResponse.length === 0 && 
          Array.isArray(pendingQueuesResponse) && pendingQueuesResponse.length === 0) {
        console.log('API returned empty data - clearing localStorage cache');
        localStorage.removeItem('currentQueue');
        localStorage.removeItem('pendingQueues');
        // Only remove userQueue if position API also returns no data
        if (!results.find(r => r && r.position !== undefined)) {
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
        
        // Get all user queues from localStorage
        const userQueuesData = getAllUserQueues();
        let validUserQueues = [];
        
        // Validate which user queues still exist in the system
        if (userQueuesData.length > 0) {
          validUserQueues = userQueuesData.filter(userQ => {
            // Enhanced matching for multiple queue formats
            return formattedPendingQueues.some(pendingQ => 
              pendingQ.id === userQ.id || 
              pendingQ.rawId === userQ.dbId ||
              pendingQ.rawId === userQ.rawId ||
              pendingQ.id === userQ.dbId?.toString() ||
              pendingQ.id === `WK${String(userQ.dbId).padStart(3, '0')}`
            );
          });
          
          // Update dates from API data and preserve all ID formats
          validUserQueues = validUserQueues.map(userQ => {
            const matchingQueue = formattedPendingQueues.find(pendingQ => 
              pendingQ.id === userQ.id || 
              pendingQ.rawId === userQ.dbId ||
              pendingQ.rawId === userQ.rawId ||
              pendingQ.id === userQ.dbId?.toString() ||
              pendingQ.id === `WK${String(userQ.dbId).padStart(3, '0')}`
            );
            
            return {
              ...userQ,
              date: matchingQueue ? matchingQueue.date : userQ.date,
              rawId: matchingQueue ? matchingQueue.rawId : userQ.rawId || userQ.dbId
            };
          });
          
          console.log('Valid user queues after filtering:', validUserQueues);
          
          // In your fetchQueueData function, modify where you save user queues:

          if (validUserQueues.length > 0) {
            const userId = getCurrentUserId();
            
            // Update state
            setUserQueue(validUserQueues);
            
            // Add userId to queue objects
            const userQueuesWithId = validUserQueues.map(q => ({
              ...q,
              userId: userId,
              isUserQueue: true
            }));
            
            // Store with user-specific keys
            localStorage.setItem(`userQueue_${userId}`, JSON.stringify(userQueuesWithId[0]));
            localStorage.setItem(`userQueues_${userId}`, JSON.stringify(userQueuesWithId));
            
            // For backward compatibility
            localStorage.setItem('userQueue', JSON.stringify(userQueuesWithId[0]));
          } else {
            const userId = getCurrentUserId();
            setUserQueue(null);
            localStorage.removeItem(`userQueue_${userId}`);
            localStorage.removeItem(`userQueues_${userId}`);
            localStorage.removeItem('userQueue'); // Clean up legacy storage
          }
        }
        
        // Set all pending queues (will be filtered by the WalkInQueueList component)
        setPendingQueues(formattedPendingQueues);
        
        // Store in localStorage
        if (formattedPendingQueues.length > 0) {
          localStorage.setItem('pendingQueues', JSON.stringify(formattedPendingQueues));
        } else {
          localStorage.removeItem('pendingQueues');
        }
      }
      
      // Process position responses for multiple queues
      const positionResponses = await Promise.all(promises); // Change this line
      const actualPositionResponses = positionResponses.slice(2); // Skip current and pending queue responses
      
      if (actualPositionResponses.length > 0) {
        // Find the best position (lowest non-zero position)
        let bestPosition = null;
        let activeQueue = null;
        
        actualPositionResponses.forEach(response => {
          if (response && response.position !== undefined && response.position > 0) {
            if (bestPosition === null || response.position < bestPosition) {
              bestPosition = response.position;
              activeQueue = response.userQueue;
            }
          }
        });
        
        console.log('Best position found:', bestPosition, 'for queue:', activeQueue);
        setQueuePosition(bestPosition);
        
        // Set the active queue as the primary user queue
        if (activeQueue) {
          setUserQueue([activeQueue, ...userQueuesData.filter(q => q.id !== activeQueue.id)]);
        }
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
              {loading ? '...' : (queuePosition !== null && queuePosition > 0 ? queuePosition : '-')}
            </div>
            <div className="QueuePositionMessageWalkIn">
              {loading ? 'Loading...' : 
                userQueue && Array.isArray(userQueue) && userQueue.length > 0 ? 
                  (queuePosition !== null && queuePosition > 0 ? 
                    `You are #${queuePosition} in line` : 
                    `You have ${userQueue.length} queue${userQueue.length > 1 ? 's' : ''}`
                  ) : 
                  userQueue ?
                    (queuePosition !== null && queuePosition > 0 ? 
                      `You are #${queuePosition} in line` : 
                      "You'll be notified when it's almost your turn"
                    ) :
                    'No active queue'
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
