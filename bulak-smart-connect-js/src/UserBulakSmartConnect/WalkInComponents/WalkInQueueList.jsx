import React from 'react';
import './WalkInQueue.css';

const WalkInQueueList = ({ pendingQueues, userQueue }) => {
  return (
    <div className="QueueListWalkIn">
      {pendingQueues.map((queue, index) => (
        <div key={index} className="QueueItemWalkIn PendingWalkIn">
          <div className="QueueStatusWalkIn">
            <span className="StatusLabelWalkIn">PENDING QUEUE</span>
            <span className="QueueDateWalkIn">{queue.date}</span>
          </div>
          <div className="QueueIdContainerWalkIn">
            <span className="QueueListIdWalkIn">{queue.id}</span>
          </div>
        </div>
      ))}

      {userQueue && (
        <div className="QueueItemWalkIn UserQueueWalkIn">
          <div className="QueueStatusWalkIn">
            <span className="StatusLabelWalkIn">YOUR QUEUE</span>
            <span className="QueueDateWalkIn">{userQueue.date}</span>
          </div>
          <div className="QueueIdContainerWalkIn">
            <span className="QueueListIdWalkIn">{userQueue.id}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default WalkInQueueList;
