import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const AdminDashboard = () => {
  // Empty data arrays
  const walkInData = [];
  const certificateData = [];
  const documentApplications = [];
  const preAppointments = [];

  // State for nav visibility
  const [navOpen, setNavOpen] = useState(false);

  return (
    <div className="admin-dashboard">
      {/* Side Nav */}
      <div className={`admin-dashboard-side-nav${navOpen ? ' open' : ''}`}>
        <button className="admin-dashboard-close-nav" onClick={() => setNavOpen(false)}>
          &times;
        </button>
        <nav>
          <ul>
            <li>
              <Link to="/admin" onClick={() => setNavOpen(false)}>
                Dashboard
              </Link>
            </li>
            <li>
              <Link to="/AdminAppointmentDashboard" onClick={() => setNavOpen(false)}>
                Appointments
              </Link>
            </li>
            <li>
              <Link to="/AdminWalkInQueue" onClick={() => setNavOpen(false)}>
                Walk-In Number
              </Link>
            </li>
            <li>
              <Link to="/ApplicationAdmin" onClick={() => setNavOpen(false)}>
                Document Application
              </Link>
            </li>
            <li>
              <Link to="/admin/account" onClick={() => setNavOpen(false)}>
                Account
              </Link>
            </li>
            <li>
              <Link to="/admin/settings" onClick={() => setNavOpen(false)}>
                Settings
              </Link>
            </li>
            <li>
              <Link to="/logout" onClick={() => setNavOpen(false)}>
                Log Out
              </Link>
            </li>
          </ul>
        </nav>
      </div>

      {/* Top Navigation Bar */}
      <div className="admin-dashboard-top-nav">
        <button
          className="admin-dashboard-menu-icon"
          onClick={() => setNavOpen(true)}
          aria-label="Open navigation"
        >
          &#9776;
        </button>
        <h1 className="admin-dashboard-title">Dashboard</h1>
        <div className="admin-dashboard-search-bar">
          <input type="text" placeholder="Search" />
        </div>
      </div>

      <div className="admin-dashboard-content-wrapper">
        <div className="admin-dashboard-container">
          <div className="admin-dashboard-main">
            {/* Charts Section */}
            <div className="admin-dashboard-charts">
              <div className="admin-dashboard-chart-card">
                <div className="admin-dashboard-chart-header">
                  <div className="admin-dashboard-chart-title">
                    <span className="admin-dashboard-walk-in-dot"></span> Walk In
                    <span className="admin-dashboard-appointment-dot"></span> Appointment
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={walkInData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" fill="#1C4D5A" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="admin-dashboard-chart-card">
                <div className="admin-dashboard-chart-header">
                  <div className="admin-dashboard-chart-title">
                    <span className="admin-dashboard-birth-dot"></span> Birth Certificate
                    <span className="admin-dashboard-marriage-dot"></span> Marriage Certificate
                  </div>
                </div>
                <ResponsiveContainer width="100%" height={200}>
                  <LineChart data={certificateData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="birth" stroke="#1C4D5A" activeDot={{ r: 8 }} />
                    <Line type="monotone" dataKey="marriage" stroke="#8DC3A7" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Document Application Section */}
            <div className="admin-dashboard-section-container">
              <h2>Document Application</h2>
              <div className="admin-dashboard-document-applications">{/* No data */}</div>
            </div>

            {/* Pre-Appointments Section */}
            <div className="admin-dashboard-section-container">
              <h2>Pre-Appointments</h2>
              <div className="admin-dashboard-pre-appointments">{/* No data */}</div>
            </div>
          </div>

          {/* Walk-In Queue Section */}
          <div className="admin-dashboard-walk-in-queue">
            <h2>Walk - In Queue</h2>
            <div className="admin-dashboard-queue-content">{/* Queue content */}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
