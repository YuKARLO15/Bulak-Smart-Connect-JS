import React from 'react';
import './WalkInQueue.css';

const WalkInQueueList = ({ pendingQueues, userQueue }) => {
  // Convert single userQueue to array if needed and handle multiple queues
  const userQueues = userQueue ? (Array.isArray(userQueue) ? userQueue : [userQueue]) : [];
  
  console.log('Processing user queues:', userQueues);
  console.log('Processing pending queues:', pendingQueues);
  
  // Get all user queue IDs for filtering - COMPREHENSIVE MATCHING
  const userQueueIds = userQueues.flatMap(q => [
    q.id,                                    // Display ID (e.g., "WK008")
    q.dbId,                                  // Database ID (e.g., 52)
    q.rawId,                                 // Raw ID if present
    q.id?.replace('WK', ''),                 // Number part without WK (e.g., "008")
    parseInt(q.id?.replace('WK', ''), 10),   // Parsed number (e.g., 8)
    q.queueNumber                            // Queue number field
  ]).filter(val => val !== null && val !== undefined && val !== '');
  
  console.log('User queue IDs for filtering:', userQueueIds);
  
  // Enhanced filtering to catch all user queues
  const filteredPendingQueues = pendingQueues.filter(queue => {
    const isUserQueue = userQueueIds.includes(queue.id) || 
                       userQueueIds.includes(queue.rawId) ||
                       userQueueIds.includes(queue.dbId) ||
                       userQueueIds.includes(queue.id?.replace('WK', '')) ||
                       userQueueIds.includes(parseInt(queue.id?.replace('WK', ''), 10)) ||
                       userQueueIds.includes(queue.queueNumber);
    
    if (isUserQueue) {
      console.log(`✅ Filtering out user queue: ${queue.id} (rawId: ${queue.rawId})`);
    }
    
    return !isUserQueue;
  });

  // Sort all queues by queue number for sequential display
  const sortByQueueNumber = (queues) => {
    return [...queues].sort((a, b) => {
      const idA = typeof a.id === 'string' ? a.id : a.id?.toString() || '';
      const idB = typeof b.id === 'string' ? b.id : b.id?.toString() || '';
      
      const numA = parseInt(idA.replace('WK', ''), 10) || 0;
      const numB = parseInt(idB.replace('WK', ''), 10) || 0;
      return numA - numB;
    });
  };
  
  const sortedPendingQueues = sortByQueueNumber(filteredPendingQueues);
  const sortedUserQueues = sortByQueueNumber(userQueues);
  
  // Combine all queues for sequential display
  const allQueues = [
    ...sortedPendingQueues.map(queue => ({
      ...queue,
      isUserQueue: false
    })),
    ...sortedUserQueues.map((queue, index) => ({
      ...queue,
      isUserQueue: true,
      isPrimaryQueue: index === 0 // Mark the first queue as primary
    }))
  ];
  
  // Final sort of all queues
  const sortedAllQueues = sortByQueueNumber(allQueues);
  
  return (
    <div className="QueueListWalkIn">
      {sortedAllQueues.map((queue, index) => (
        <div 
          key={index} 
          className={`QueueItemWalkIn ${queue.isUserQueue ? 'UserQueueWalkIn' : 'PendingWalkIn'}`}
        >
          <div className="QueueStatusWalkIn">
            <span className="StatusLabelWalkIn">
              {queue.isUserQueue ? 'YOUR QUEUE' : 'PENDING QUEUE'}
            </span>
            <span className="QueueDateWalkIn">{queue.date}</span>
          </div>
          <div className="QueueIdContainerWalkIn">
            <span className="QueueListIdWalkIn">{queue.id}</span>
            {queue.isUserQueue && (
              <span style={{
                marginLeft: '10px',
                padding: '2px 8px',
                background: queue.status === 'serving' ? '#ff6b35' : 
                           queue.isPrimaryQueue ? '#4caf50' : '#24536a',
                color: 'white',
                borderRadius: '12px',
                fontSize: '10px',
                fontWeight: 'bold',
                animation: queue.status === 'serving' ? 'pulse 1.5s infinite' : 'none'
              }}>
                {queue.status === 'serving' ? 'NOW SERVING' :
                 queue.isPrimaryQueue ? 'ACTIVE' : 'YOUR QUEUE'}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default WalkInQueueList;
