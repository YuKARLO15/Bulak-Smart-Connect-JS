import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import './WalkInDetails.css';
import NavBar from '../../NavigationComponents/NavSide';

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

  // Function to determine requirements link based on reason of visit
  const getRequirementsLink = (reasonOfVisit) => {
    const reason = reasonOfVisit?.toLowerCase();
    
    if (reason?.includes('birth')) {
      return '/RequirementBirthList';
    } else if (reason?.includes('marriage')) {
      return '/RequirementMarriageList';
    } else {
      // For general inquiry, return null to show different content
      return null;
    }
  };

  // Function to render requirements section
    const renderRequirementsSection = (reasonOfVisit) => {
    const requirementsLink = getRequirementsLink(reasonOfVisit);
    
    if (requirementsLink) {
      return (
        <div className="requirements-link">
          <Link to={requirementsLink}>Link for Requirements</Link>
        </div>
      );
    } else {
      // Return null to hide the section for general inquiries
      return null;
    }
  };

  if (!queueData) {
    return <div className="loading">Loading queue information...</div>;
  }

  const { id, userData, appointmentType } = queueData;
  const fullName = `${userData.firstName} ${userData.middleInitial ? userData.middleInitial + ' ' : ''}${userData.lastName}`;
  const firstName = userData.firstName;

  return (
    <div className={`queue-detail-container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <NavBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="queue-detail-card">
        <div className="queue-welcome">
          <h2>
            {' '}
            Hi, <span className="highlight">{firstName}</span>
          </h2>
          <p>You Are Currently on Queue.</p>
          <p className="notification">we'll notify you when it is almost your turn</p>
        </div>

        <div className="queue-number-section">
          <p>Your number is:</p>
          <div className="queue-number">{id}</div>
        </div>

        {renderRequirementsSection(userData.reasonOfVisit)}

        <div className="appointment-info">
          <p>
            <span className="label">Name:</span> {fullName}
          </p>
          <p>
            <span className="label">Address:</span> {userData.address}
          </p>
          <p>
            <span className="label">Phone:</span> {userData.phoneNumber}
          </p>
          <p>
            <span className="label">Reason of Visit:</span> {userData.reasonOfVisit}
          </p>
        </div>
      </div>
    </div>
  );
};

export default WalkInQueueDetail;