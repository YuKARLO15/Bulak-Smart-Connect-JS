import React, { useState, useEffect } from 'react';
import QueueListWalkIn from './WalkInQueueList';
import './WalkInQueue.css';
import NavBar from '../NavSide';

const WalkInQueueContainer = () => {
  const [queuePosition, setQueuePosition] = useState(4);
  const [currentQueue, setCurrentQueue] = useState([
    { id: 'WK003', counter: 'COUNTER 1' },
    { id: 'WK004', counter: 'COUNTER 2' },
  ]);

  const [pendingQueues, setPendingQueues] = useState([]);
  const [userQueue, setUserQueue] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  useEffect(() => {
    const storedCurrentQueue = localStorage.getItem('currentQueue');
    const storedPendingQueues = localStorage.getItem('pendingQueues');
    const storedUserQueue = localStorage.getItem('userQueue');

    if (storedCurrentQueue) {
      setCurrentQueue(JSON.parse(storedCurrentQueue));
    }

    if (storedPendingQueues) {
      setPendingQueues(JSON.parse(storedPendingQueues));
    } else {
      const defaultPendingQueues = [
        { id: 'WK005', date: '02/26/25' },
        { id: 'WK006', date: '02/26/25' },
        { id: 'WK007', date: '02/26/25' },
      ];
      setPendingQueues(defaultPendingQueues);
      localStorage.setItem('pendingQueues', JSON.stringify(defaultPendingQueues));
    }

    if (storedUserQueue) {
      setUserQueue(JSON.parse(storedUserQueue));
    } else {
      const defaultUserQueue = { id: 'WK008', date: '02/26/25' };
      setUserQueue(defaultUserQueue);
      localStorage.setItem('userQueue', JSON.stringify(defaultUserQueue));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem('currentQueue', JSON.stringify(currentQueue));
    localStorage.setItem('pendingQueues', JSON.stringify(pendingQueues));
    if (userQueue) {
      localStorage.setItem('userQueue', JSON.stringify(userQueue));
    }
  }, [currentQueue, pendingQueues, userQueue]);

  return (
    <div className={`QueueContainerWalkIn${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <NavBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="HeaderWalkIn">
        <h1>Walk - In</h1>
      </div>
      <div className="WalkInDashboard">
        <div className="HeadWalkIn">
          <div className="QueuePositionContainerWalkIn">
            <div className="QueuePositionLabelWalkIn">QUEUE POSITION</div>
            <div className="QueuePositionNumberWalkIn">{queuePosition}</div>
            <div className="QueuePositionMessageWalkIn">
              You'll be notified when it's almost your turn
            </div>
          </div>

          <div className="CurrentQueueContainerWalkIn">
            <div className="CurrentQueueLabelWalkIn">CURRENT QUEUE</div>
            <div className="CurrentQueueListWalkIn">
              {currentQueue.map((item, index) => (
                <div key={index} className="CurrentQueueItemWalkIn">
                  <span className="QueueIdWalkIn">{item.id}</span>
                  <span className="CounterNumberWalkIn">{item.counter}</span>
                </div>
              ))}
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
            <QueueListWalkIn pendingQueues={pendingQueues} userQueue={userQueue} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default WalkInQueueContainer;
