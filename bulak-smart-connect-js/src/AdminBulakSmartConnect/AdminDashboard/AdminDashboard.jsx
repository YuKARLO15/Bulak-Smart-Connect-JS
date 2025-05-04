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
import NavBar from '../../NavigationComponents/NavSide';

const AdminDashboard = () => {
  // Empty data arrays
  const walkInData = [];
  const certificateData = [];
  const documentApplications = [];
  const preAppointments = [];
  const [navOpen, setNavOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  return (
      <div className={`admin-dashboard ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <NavBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      
      {/* Top Navigation Bar */}
      <div className="admin-dashboard-top-nav">
     
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
