import React, { useEffect, useState } from 'react';
import './ScreenSmartQueue.css';
import { queueService } from '../../services/queueService';

const formatQueueNumber = queueNumber => {
  const num = parseInt(queueNumber?.split('-')[1] || queueNumber, 10) || 0;
  return `WK${String(num).padStart(3, '0')}`;
};

const ScreenSmartQueue = () => {
  const [currentQueue, setCurrentQueue] = useState('—');
  const [nextQueue, setNextQueue] = useState('—');
  const [inQueueList, setInQueueList] = useState([]);

  const fetchData = async () => {
    try {
      const allQueues = await queueService.fetchWalkInQueues();
      const serving = allQueues.find(q => q.status === 'serving');
      const pending = allQueues.filter(q => q.status === 'pending');

      setCurrentQueue(serving ? formatQueueNumber(serving.queueNumber || serving.id) : '—');
      setNextQueue(pending[0] ? formatQueueNumber(pending[0].queueNumber || pending[0].id) : '—');
      setInQueueList(pending.slice(1, 13).map(q => formatQueueNumber(q.queueNumber || q.id)));
    } catch (err) {
      console.error('Failed to fetch queue data:', err);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 5000); // Refresh every 5s
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="screen-queue-container">
      <div className="screen-queue-body">
        <div className="in-queue-section">
          <div className="in-queue-title">In Queue</div>
          <div className="in-queue-list">
            {inQueueList.length > 0 ? (
              inQueueList.map((q, i) => (
                <div key={i} className="in-queue-item">
                  {q}
                </div>
              ))
            ) : (
              <>
                <div className="in-queue-item">—</div>
                <div className="in-queue-item">—</div>
                <div className="in-queue-item">—</div>
                <div className="in-queue-item">—</div>
                <div className="in-queue-item">—</div>
                <div className="in-queue-item">—</div>
                <div className="in-queue-item">—</div>
                <div className="in-queue-item">—</div>
                <div className="in-queue-item">—</div>
                <div className="in-queue-item">—</div>
                <div className="in-queue-item">—</div>
                <div className="in-queue-item">—</div>
              </>
            )}
          </div>
        </div>

        <div className="screen-queue-main">
          <div className="screen-queue-header">
            <div className="queue-label">Current Queue</div>
          </div>

          <div className="queue-value">{currentQueue}</div>
          <div className="screen-queue-header">
            <div className="queue-label">Next Queue</div>
          </div>
          <div className="queue-value">{nextQueue}</div>
        </div>
      </div>
    </div>
  );
};

export default ScreenSmartQueue;
