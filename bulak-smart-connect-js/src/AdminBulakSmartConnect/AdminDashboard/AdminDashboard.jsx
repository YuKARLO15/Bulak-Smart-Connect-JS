import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
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
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { logout, user } = useAuth(); 
  const navigate = useNavigate();


  const walkInData = [];
  const certificateData = [];
  const documentApplications = [];
  const preAppointments = [];

  const getStatusClass = status => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'status-approved';
      case 'declined':
        return 'status-declined';
      case 'pending':
        return 'status-pending';
      default:
        return '';
    }
  };

  // Handle logout
  const handleLogout = () => {
    logout();
    navigate('/LogIn');
  };

  return (
    <div className="admin-dashboard">
      {/* Sidebar */}
      <div className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
          {sidebarOpen ? '×' : '☰'}
        </div>
        <div className="sidebar-user">
          <div className="user-info">
            <div className="user-name">{user?.name || '[USERNAME]'}</div>
            <div className="user-email">{user?.email || 'User@email.com'}</div>
            <div className="user-role">{user?.roles?.[0] || 'Unknown Role'}</div>
          </div>
        </div>
        <nav className="sidebar-nav">
          <Link to="/admin" className="nav-item active">
            Dashboard
          </Link>
          <Link to="/AdminWalkInDetails" className="nav-item">
            Appointments
          </Link>
          <Link to="/AdminWalkInQueue" className="nav-item">
            Walk - In Number
          </Link>
          <Link to="/ApplicationAdmin" className="nav-item">
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
          <button className="logout-btn" onClick={handleLogout}>Log Out</button>
        </div>
      </div>

      {/* Main Content */}
      <div className="main-content">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <div className="search-bar">
            <input type="text" placeholder="Search" />
          
          </div>
        </div>

        {/* Charts Section */}
        <div className="dashboard-charts">
          <div className="chart-card">
            <div className="chart-header">
              <div className="chart-title">
                <span className="walk-in-dot"></span> Walk In
                <span className="appointment-dot"></span> Appointment
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

          <div className="chart-card">
            <div className="chart-header">
              <div className="chart-title">
                <span className="birth-dot"></span> Birth Certificate
                <span className="marriage-dot"></span> Marriage Certificate
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
        <div className="section-container">
          <h2>Document Application</h2>
          <div className="document-applications">
            {documentApplications.map((doc, index) => (
              <div className="application-card" key={index}>
                <div className="application-info">
                  <div className="application-title">{doc.type}</div>
                  <div className="application-date">{doc.date}</div>
                  <div className={`application-status ${getStatusClass(doc.status)}`}>
                    {doc.status}
                  </div>
                </div>
                <div className="application-id">{doc.id}</div>
                <button className="review-btn">Review</button>
              </div>
            ))}
          </div>
        </div>

        {/* Pre-Appointments Section */}
        <div className="section-container">
          <h2>Pre-Appointments</h2>
          <div className="pre-appointments">
            {preAppointments.map((appointment, index) => (
              <div className="appointment-card" key={index}>
                <div className="appointment-info">
                  <div className="appointment-title">{appointment.type}</div>
                  <div className="appointment-date">{appointment.date}</div>
                  <div className="client-name">{appointment.name}</div>
                </div>
                <div className="appointment-id">{appointment.id}</div>
                <button className="see-more-btn">See More</button>
              </div>
            ))}
          </div>
        </div>

        {/* Walk-In Queue Section */}
        <div className="walk-in-queue">
          <h2>Walk - In Queue</h2>
          <div className="queue-content">{/* Queue content would go here */}</div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
