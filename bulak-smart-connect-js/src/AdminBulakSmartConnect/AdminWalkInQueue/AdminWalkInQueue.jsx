import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AdminWalkInQueue.css';


const AdminWalkInQueue = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
const navigate = useNavigate();
  // Empty queues array
  const queues = [];

  // Empty current queue data
  const currentQueue = '';
  const nextQueue = '';
  const totalQueues = 0;
  const getDetails = (queueId) => {
   
    console.log(`Fetching details for queue ID: ${queueId}`);
    navigate("/AdminWalkInDetails");
  };
  return (
    <div className="admin-walk-in">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? '×' : '☰'}
        </div>
        <div className="sidebar-user">
       
          <div className="user-info">
            <div className="user-name">[USERNAME]</div>
            <div className="user-email">user@email.com</div>
          </div>
        </div>
        <nav className="sidebar-nav">
          <Link to="/admin" className="nav-item">
            Dashboard
          </Link>
          <Link to="/admin/appointments" className="nav-item">
            Appointments
          </Link>
          <Link to="/admin/walkin" className="nav-item active">
            Walk - In Number
          </Link>
          <Link to="/admin/documents" className="nav-item">
            Document Application
          </Link>
          <Link to="/admin/account" className="nav-item">
            Account
          </Link>
          <Link to="/admin/settings" className="nav-item">
            Settings
          </Link>
        </nav>
        <div className="sidebar-footer">
          <button className="logout-btn">Log Out</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="walk-in-header">
          <h1>Walk - In</h1>
        </div>

        <div className="queue-summary">
          <div className="current-queue-card">
            <h2>CURRENT QUEUE</h2>
            <div className="current-queue-number">{currentQueue}</div>
            <div className="next-queue">
              Next on Queue
              <div className="next-queue-number">{nextQueue}</div>
            </div>
          </div>

          <div className="total-queue-card">
            <h2>TOTAL NUMBER OF QUEUE</h2>
            <div className="total-queue-number">{totalQueues}</div>
          </div>
        </div>

        <div className="queue-list-container">
          <h2>Walk - In Queues</h2>
          <div className="queue-list">
            {queues.map((queue, index) => (
              <div key={index} className="queue-item">
                <div className="queue-status-section">
                  <div className="queue-status">{queue.status}</div>
                  <div className="queue-date">{queue.date}</div>
                </div>
                <div className="queue-applicant">{queue.applicant}</div>
                <div className="queue-id">{queue.id}</div>
          
              </div>
            ))}
          </div>
          <button className="queue-action-btn" onClick={getDetails} >View Details</button>
        </div>
      </div>
    </div>
  );
};

export default AdminWalkInQueue;
