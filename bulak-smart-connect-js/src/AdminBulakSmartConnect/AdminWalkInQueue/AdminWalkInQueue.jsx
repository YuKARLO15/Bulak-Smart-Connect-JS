import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './AdminWalkInQueue.css';

const AdminWalkInQueue = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();
  const currentQueue = '';
  const nextQueue = '';
  const totalQueues = 0;

  const getDetails = () => {
    navigate('/AdminWalkInDetails');
  };

  return (
    <div className="admin-walkin-queue">
      {/* Header Bar */}
      <div className="admin-walkin-queue-header-bar">
        <button
          className="admin-walkin-queue-menu-btn"
          onClick={() => setSidebarOpen(true)}
          aria-label="Open navigation"
        >
          <span className="admin-walkin-queue-menu-icon">
            <span className="admin-walkin-queue-menu-bar"></span>
            <span className="admin-walkin-queue-menu-bar"></span>
            <span className="admin-walkin-queue-menu-bar"></span>
          </span>
        </button>
        <h1 className="admin-walkin-queue-header-title">Walk - in</h1>
      </div>

      {/* Sidebar */}
      <div className={`admin-walkin-queue-sidebar${sidebarOpen ? ' open' : ''}`}>
        <div
          className="admin-walkin-queue-sidebar-toggle"
          onClick={() => setSidebarOpen(false)}
        >
          ×
        </div>
        <div className="admin-walkin-queue-sidebar-user">
          <div className="admin-walkin-queue-user-info">
            <div className="admin-walkin-queue-user-name">[USERNAME]</div>
            <div className="admin-walkin-queue-user-email">user@email.com</div>
          </div>
        </div>
        <nav className="admin-walkin-queue-sidebar-nav">
          <Link to="/admin" className="admin-walkin-queue-nav-item">Dashboard</Link>
          <Link to="/admin/appointments" className="admin-walkin-queue-nav-item">Appointments</Link>
          <Link to="/admin/walkin" className="admin-walkin-queue-nav-item active">Walk - In Number</Link>
          <Link to="/admin/documents" className="admin-walkin-queue-nav-item">Document Application</Link>
          <Link to="/admin/account" className="admin-walkin-queue-nav-item">Account</Link>
          <Link to="/admin/settings" className="admin-walkin-queue-nav-item">Settings</Link>
        </nav>
        <div className="admin-walkin-queue-sidebar-footer">
          <button className="admin-walkin-queue-logout-btn">Log Out</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="admin-walkin-queue-main">
        {/* Summary Cards */}
        <div className="admin-walkin-queue-summary-row">
          <div className="admin-walkin-queue-summary-card">
            <h2 className="admin-walkin-queue-summary-title">CURRENT QUEUE</h2>
            <div className="admin-walkin-queue-summary-number">{currentQueue}</div>
            <div className="admin-walkin-queue-summary-next">
              Next on Queue <span className="admin-walkin-queue-summary-next-number">{nextQueue}</span>
            </div>
          </div>
          <div className="admin-walkin-queue-summary-card gray">
            <h2 className="admin-walkin-queue-summary-title">TOTAL NUMBER OF QUEUE</h2>
            <div className="admin-walkin-queue-summary-number">{totalQueues}</div>
          </div>
        </div>

        {/* Walk-In Queues List */}
        <div className="admin-walkin-queue-list-section">
          <h2 className="admin-walkin-queue-list-title">Walk - In Queues</h2>
          <div className="admin-walkin-queue-list">
            {/* No data */}
          </div>
          <button className="admin-walkin-queue-action-btn" onClick={getDetails}>
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminWalkInQueue;
