import React from 'react';
import './WalkInQueue.css';

const WalkInQueueList = ({ pendingQueues, userQueue }) => {
  // Convert single userQueue to array if needed
  const userQueues = userQueue ? (Array.isArray(userQueue) ? userQueue : [userQueue]) : [];
  
  // Get all user queue IDs for filtering
  const userQueueIds = userQueues.map(q => q.id);
  
  // Filter out any queues that belong to the user
  const filteredPendingQueues = pendingQueues.filter(queue => !userQueueIds.includes(queue.id));
    // Sort all queues by queue number for sequential display
  const sortByQueueNumber = (queues) => {
    return [...queues].sort((a, b) => {
      // Ensure id is a string and handle WK prefix
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
    ...sortedUserQueues.map(queue => ({
      ...queue,
      isUserQueue: true
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
          </div>
        </div>
      ))}
    </div>
  );
};

export default WalkInQueueList;
