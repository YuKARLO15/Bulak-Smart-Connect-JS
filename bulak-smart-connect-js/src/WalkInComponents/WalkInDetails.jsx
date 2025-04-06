import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './WalkInDetails.css';
import NavBar from '../UserDashboard/NavBar';
const WalkInQueueDetail = () => {
  const [queueData, setQueueData] = useState(null);
  const [queuePosition, setQueuePosition] = useState(5);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  useEffect(() => {
   
    const userData = JSON.parse(localStorage.getItem('userQueue'));
    if (userData) {
      setQueueData(userData);
    }
    
  
  }, []);

  if (!queueData) {
    return <div className="loading">Loading queue information...</div>;
  }

  const { id, userData, appointmentType } = queueData;
  const fullName = `${userData.firstName} ${userData.middleInitial ? userData.middleInitial + ' ' : ''}${userData.lastName}`;
  const firstName = userData.firstName;

  return (
          <div className={`queue-detail-container ${isSidebarOpen ? "sidebar-open" : ""}`}>
          <NavBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="queue-detail-card">
        <div className="queue-welcome">
          <h2> Hi, <span className="highlight">{ firstName}</span></h2>
          <p>You Are Currently in {queuePosition}th Queue.</p>
          <p className="notification">we'll notify you when it is almost your turn</p>
        </div>
        
        <div className="queue-number-section">
          <p>Your number is:</p>
          <div className="queue-number">{id}</div>
        </div>
        
        <div className="requirements-link">
          <Link to="/requirements">Link for Requirements</Link>
        </div>
        
        <div className="appointment-info">

          <p><span className="label">Name:</span> {fullName}</p>
          <p><span className="label">Address:</span> {userData.address}</p>
          <p><span className="label">Phone:</span> {userData.phoneNumber}</p>
          <p><span className="label">Reason of Visit:</span> {userData.reasonOfVisit}</p>
        </div>
      </div>
    </div>
  );
};

export default WalkInQueueDetail;