import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';
import axios from 'axios';
import { queueService } from '../../services/queueService';
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
  Legend
} from 'recharts';
import {
  Box, 
  Card, 
  CardContent, 
  Typography, 
  Button, 
  CircularProgress,
  Grid,
  Paper,
  Container
} from '@mui/material';
import NavBar from '../../NavigationComponents/NavSide';
import RecentApplicationsAdmin from './RecentApplicationsAdmin';
import RecentAppointmentsAdmin from './RecentAppointmentsAdmin';
import WalkInQueueAdmin from './WalkInQueueAdmin';
import { getApplications } from '../../UserBulakSmartConnect/ApplicationComponents/ApplicationData';
import { getRecentAppointments } from '../../UserBulakSmartConnect/AppointmentComponents/RecentAppointmentData';


const formatWKNumber = queueNumber => {
  if (typeof queueNumber === 'string' && queueNumber.startsWith('WK')) {
    return queueNumber;
  }

  // Handle null or undefined
  if (!queueNumber) return 'WK000';

  const numberPart = queueNumber.includes('-') ? queueNumber.split('-')[1] : queueNumber;
  const num = parseInt(numberPart, 10) || 0;
  return `WK${String(num).padStart(3, '0')}`;
};
const AdminDashboard = () => {
  // Empty data arrays
  const [walkInData, setWalkInData] = useState([]);
  const [certificateData, setCertificateData] = useState([]);
  const [documentApplications, setDocumentApplications] = useState([]);
  const [preAppointments, setPreAppointments] = useState([]);
  const [walkInQueue, setWalkInQueue] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [navOpen, setNavOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [queueLoading, setQueueLoading] = useState(true);
  const [queueError, setQueueError] = useState(null);

  // Search functionality
  const handleSearch = e => {
    setSearchTerm(e.target.value);
  }; 

  const [statistics, setStatistics] = useState({
    overall: 0
  });
  
  // Add appointment statistics state
  const [appointmentStats, setAppointmentStats] = useState({
    overall: 0
  });

  // Generate sample monthly data for appointment vs walk-in
  // This can be replaced with actual API calls when available
  const generateMonthlyAnalytics = () => {
    const currentDate = new Date('2025-06-04'); // Using the date you provided
    const months = [];
    
    // Generate data for the last 6 months
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(currentDate);
      monthDate.setMonth(currentDate.getMonth() - i);
      
      const monthName = monthDate.toLocaleString('default', { month: 'short' });
      
      // Generate some sample data with a slight randomization
      // In a real app, this would come from your API
      const walkIns = Math.floor(Math.random() * 30) + 15 + (i * 2);
      const appointments = Math.floor(Math.random() * 40) + 10 + (i * 3);
      
      months.push({
        name: monthName,
        value: walkIns, // walk-ins
        appointments: appointments // appointments
      });
    }
    
    return months;
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch applications data
        const fetchedApplications = getApplications();
        setStatistics({
          overall: fetchedApplications.length
        });
        
        // Fetch appointments data
        const fetchedAppointments = getRecentAppointments();
        setAppointmentStats({
          overall: fetchedAppointments.length
        });
        
        // Generate monthly analytics data for the bar graph
        // In a real application, this would be replaced with API calls
        const monthlyAnalytics = generateMonthlyAnalytics();
        setWalkInData(monthlyAnalytics);
        
        // Attempt to fetch walk-in queue data for display purposes
        try {
          // Try different possible methods to get walk-in data
          let walkIns;
          
          if (typeof queueService.getWalkInQueue === 'function') {
            walkIns = await queueService.getWalkInQueue();
          } else if (typeof queueService.getQueue === 'function') {
            walkIns = await queueService.getQueue();
          } else if (typeof queueService.getAll === 'function') {
            walkIns = await queueService.getAll();
          }
          
          if (walkIns && walkIns.length > 0) {
            setWalkInQueue(walkIns);
          }
        } catch (queueErr) {
          console.warn('Could not fetch queue data:', queueErr);
          // Continue execution, this error doesn't need to stop the dashboard from rendering
        }
        
      } catch (err) {
        setError('Error loading data: ' + err.message);
      } finally {
        setLoading(false);
        setQueueLoading(false);
      }
    };
    
    fetchData();
  }, []);

  return (
    <div className={`admin-dashboard ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <NavBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      {/* Top Navigation Bar */}
      <div className="admin-dashboard-top-nav">
        <h1 className="admin-dashboard-title">Dashboard</h1>
        <div className="admin-dashboard-search-bar">
          <input type="text" placeholder="Search" value={searchTerm} onChange={handleSearch} />
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
                {loading ? (
                  <div className="loading-container">
                    <CircularProgress />
                    <p>Loading chart data...</p>
                  </div>
                ) : error ? (
                  <div className="error-container">
                    <p>{error}</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={walkInData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" name="Walk-ins" fill="#1C4D5A" />
                      <Bar dataKey="appointments" name="Appointments" fill="#8DC3A7" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
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

          
            <RecentAppointmentsAdmin />
    
            <RecentApplicationsAdmin />
          </div>

          {/* Right side column */}
          <div className="admin-dashboard-sidebar">
            {/* Walk-In Queue Section */}
            <div className="admin-dashboard-walk-in-queue">
              <h2>Walk - In Queue</h2>
              <WalkInQueueAdmin />
              
            </div>
               {/* Appointments Overall Stat - Added this section */}
              <Container className='OverAllStatContainer'>
                <Paper className="TotalStatCard" elevation={1}>
                  <Typography variant="subtitle1" className="AllStatCardTitle">
                    Overall Appointments
                  </Typography>
                  <Typography variant="h4" sx={{ color: '#184a5b', fontWeight: 600 }}>
                    {appointmentStats.overall}
                  </Typography>
                </Paper>
              </Container>
              
              {/* Applications Overall Stat */}
              <Container className='OverAllStatContainer'>
                <Paper className="TotalStatCard" elevation={1}>
                  <Typography variant="subtitle1" className="AllStatCardTitle">
                    Overall Applications
                  </Typography>
                  <Typography variant="h4" sx={{ color: '#184a5b', fontWeight: 600 }}>
                    {statistics.overall}
                  </Typography>
                </Paper>
              </Container>
              
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;