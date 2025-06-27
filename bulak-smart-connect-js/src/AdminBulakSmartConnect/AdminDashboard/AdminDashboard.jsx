import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';
import axios from 'axios';
import { queueService } from '../../services/queueService';
import { documentApplicationService } from '../../services/documentApplicationService';
import { appointmentService } from '../../services/appointmentService';
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
  Container,
  Alert
} from '@mui/material';
import NavBar from '../../NavigationComponents/NavSide';
import RecentApplicationsAdmin from './RecentApplicationsAdmin';
import RecentAppointmentsAdmin from './RecentAppointmentsAdmin';
import WalkInQueueAdmin from './WalkInQueueAdmin';
import { getRecentAppointments } from '../../UserBulakSmartConnect/AppointmentComponents/RecentAppointmentData';
import ApplicationPieChart from '../AdminApplicationComponents/ApplicationPieChart'; 

const formatWKNumber = queueNumber => {
  if (typeof queueNumber === 'string' && queueNumber.startsWith('WK')) {
    return queueNumber;
  }

  if (!queueNumber) return 'WK000';

  const numberPart = queueNumber.includes('-') ? queueNumber.split('-')[1] : queueNumber;
  const num = parseInt(numberPart, 10) || 0;
  return `WK${String(num).padStart(3, '0')}`;
};

const AdminDashboard = () => {
  const [walkInData, setWalkInData] = useState([]);
  const [certificateData, setCertificateData] = useState([]);
  const [documentApplications, setDocumentApplications] = useState([]);
  const [preAppointments, setPreAppointments] = useState([]);
  const [walkInQueue, setWalkInQueue] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [applications, setApplications] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [queueLoading, setQueueLoading] = useState(true);
  const [queueError, setQueueError] = useState(null);
  const [dataSource, setDataSource] = useState('loading');
  const [chartLoading, setChartLoading] = useState(true);

  const handleSearch = e => {
    setSearchTerm(e.target.value);
  }; 

  const [statistics, setStatistics] = useState({
    overall: 0,
    birthCertificate: 0,
    marriage: 0,
    pending: 0,
    approved: 0,
    declined: 0
  });
  
  const [appointmentStats, setAppointmentStats] = useState({
    overall: 0
  });

  const getLastSixMonths = () => {
    const months = [];
    const currentDate = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date(currentDate);
      date.setMonth(currentDate.getMonth() - i);
      months.push({
        month: date.getMonth() + 1,
        year: date.getFullYear(),
        name: date.toLocaleString('default', { month: 'short' })
      });
    }
    
    return months;
  };

  const generateMonthlyAnalyticsFromDB = async () => {
    try {
      setChartLoading(true);
      const months = getLastSixMonths();
      const monthlyData = [];

      for (const monthData of months) {
        let walkInCount = 0;
        let appointmentCount = 0;

        try {
          const walkInQueues = await queueService.fetchWalkInQueues();
          
          if (Array.isArray(walkInQueues)) {
            walkInCount = walkInQueues.filter(queue => {
              if (!queue.createdAt) return false;
              const queueDate = new Date(queue.createdAt);
              return queueDate.getMonth() + 1 === monthData.month && 
                     queueDate.getFullYear() === monthData.year;
            }).length;
          }

          try {
            const appointments = await appointmentService.fetchAllAppointments();
            
            if (Array.isArray(appointments)) {
              appointmentCount = appointments.filter(appointment => {
                if (!appointment.createdAt && !appointment.appointmentDate) return false;
                const appointmentDate = new Date(appointment.createdAt || appointment.appointmentDate);
                return appointmentDate.getMonth() + 1 === monthData.month && 
                       appointmentDate.getFullYear() === monthData.year;
              }).length;
            }
          } catch (appointmentError) {
            console.warn(`Could not fetch appointments for ${monthData.name}:`, appointmentError);
          }

        } catch (queueError) {
          console.warn(`Could not fetch queues for ${monthData.name}:`, queueError);
        }

        monthlyData.push({
          name: monthData.name,
          value: walkInCount,
          appointments: appointmentCount
        });
      }

      console.log('Generated monthly analytics from database:', monthlyData);
      return monthlyData;
      
    } catch (error) {
      console.error('Error generating monthly analytics from database:', error);
      
      return getLastSixMonths().map(month => ({
        name: month.name,
        value: Math.floor(Math.random() * 20) + 5,
        appointments: Math.floor(Math.random() * 30) + 10
      }));
    } finally {
      setChartLoading(false);
    }
  };

  const standardizeApplicationData = (apps) => {
    if (!Array.isArray(apps)) return [];
    return apps.map(app => ({
      id: app.id || app._id || 'unknown-id',
      type: app.applicationType || app.type || 'Document Application',
      applicationType: app.applicationSubtype || app.applicationType || app.type || 'Unknown Type',
      date: formatDate(app.createdAt || app.date || new Date()),
      status: app.status || 'Pending',
      message: app.statusMessage || app.message || '',
      applicantName: app.applicantName || `${app.firstName || ''} ${app.lastName || ''}`.trim() || 'Unknown',
      originalData: app
    }));
  };

  const formatDate = (dateInput) => {
    if (!dateInput) return 'N/A';
    try {
      const date = new Date(dateInput);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return String(dateInput);
    }
  };

  const fetchApplicationData = useCallback(async () => {
    try {
      setLoading(true);
      console.log('Fetching applications for dashboard statistics...');
      
      const response = await documentApplicationService.getAllApplications();
      console.log('API response:', response);
      
      if (Array.isArray(response)) {
        const standardizedData = standardizeApplicationData(response);
        setApplications(standardizedData);
        setDataSource('api');
        
        const stats = {
          overall: standardizedData.length,
          birthCertificate: 0,
          marriage: 0,
          pending: 0,
          approved: 0,
          declined: 0
        };
        
        standardizedData.forEach(app => {
          const appType = (app.type || '').toLowerCase();
          if (appType.includes('birth') || appType.includes('certificate')) {
            stats.birthCertificate++;
          } else if (appType.includes('marriage') || appType.includes('wed')) {
            stats.marriage++;
          }
          
          const status = (app.status || '').toLowerCase();
          if (status.includes('pending') || status.includes('submitted') || status === '') {
            stats.pending++;
          } else if (status.includes('approved') || status.includes('accept')) {
            stats.approved++;
          } else if (status.includes('declined') || status.includes('denied') || status.includes('reject')) {
            stats.declined++;
          }
        });
        
        console.log('Calculated application statistics:', stats);
        setStatistics(stats);
        
        return standardizedData;
      } else {
        throw new Error('Invalid response format: Not an array');
      }
    } catch (err) {
      console.error("Error fetching application data:", err);
      setError('Error loading application data: ' + err.message);
      
      try {
        console.log('Falling back to localStorage for applications...');
        const localData = JSON.parse(localStorage.getItem('applications') || '[]');
        const standardizedData = standardizeApplicationData(localData);
        setApplications(standardizedData);
        setDataSource('localStorage');
        
        setStatistics({
          overall: standardizedData.length,
          birthCertificate: standardizedData.filter(app => 
            (app.type || '').toLowerCase().includes('birth') || 
            (app.type || '').toLowerCase().includes('certificate')
          ).length,
          marriage: standardizedData.filter(app => 
            (app.type || '').toLowerCase().includes('marriage') || 
            (app.type || '').toLowerCase().includes('wed')
          ).length,
          pending: standardizedData.filter(app => 
            (app.status || '').toLowerCase().includes('pending') || 
            (app.status || '').toLowerCase().includes('submitted') || 
            (app.status || '') === ''
          ).length,
          approved: standardizedData.filter(app => 
            (app.status || '').toLowerCase().includes('approved') || 
            (app.status || '').toLowerCase().includes('accept')
          ).length,
          declined: standardizedData.filter(app => 
            (app.status || '').toLowerCase().includes('declined') || 
            (app.status || '').toLowerCase().includes('denied') || 
            (app.status || '').toLowerCase().includes('reject')
          ).length
        });
        
        return standardizedData;
      } catch (localErr) {
        console.error('Failed to load from localStorage:', localErr);
        return [];
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchAppointmentStats = async () => {
    try {
      const appointments = await appointmentService.fetchAllAppointments();
      setAppointmentStats({
        overall: Array.isArray(appointments) ? appointments.length : 0
      });
    } catch (error) {
      console.error('Error fetching appointment stats:', error);
      const fetchedAppointments = getRecentAppointments();
      setAppointmentStats({
        overall: fetchedAppointments.length
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        await fetchApplicationData();
        
        await fetchAppointmentStats();
        
        const monthlyAnalytics = await generateMonthlyAnalyticsFromDB();
        setWalkInData(monthlyAnalytics);
        
        try {
          let walkIns;
          
          if (typeof queueService.fetchWalkInQueues === 'function') {
            walkIns = await queueService.fetchWalkInQueues();
          } else if (typeof queueService.getQueue === 'function') {
            walkIns = await queueService.getQueue();
          }
          
          if (walkIns && walkIns.length > 0) {
            setWalkInQueue(walkIns);
          }
        } catch (queueErr) {
          console.warn('Could not fetch queue data:', queueErr);
        }
        
      } catch (err) {
        setError('Error loading data: ' + err.message);
      } finally {
        setLoading(false);
        setQueueLoading(false);
      }
    };
    
    fetchData();
    
    const intervalId = setInterval(() => {
      fetchApplicationData();
      fetchAppointmentStats();
      generateMonthlyAnalyticsFromDB().then(setWalkInData);
    }, 300000);
    
    return () => clearInterval(intervalId);
  }, [fetchApplicationData]);

  const handleRefresh = async () => {
    setLoading(true);
    setChartLoading(true);
    
    try {
      await fetchApplicationData();
      await fetchAppointmentStats();
      const monthlyAnalytics = await generateMonthlyAnalyticsFromDB();
      setWalkInData(monthlyAnalytics);
    } catch (error) {
      console.error('Error during refresh:', error);
    } finally {
      setLoading(false);
      setChartLoading(false);
    }
  };

  return (
    <div className={`admin-dashboard ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <NavBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      <div className="admin-dashboard-top-nav">
        <h1 className="AdminDahboardHeader">Dashboard</h1>
        <div className="admin-dashboard-search-bar">
          <input type="text" placeholder="Search" value={searchTerm} onChange={handleSearch} />
          <Button 
            variant="contained" 
            onClick={handleRefresh}
            size="small"
            disabled={loading || chartLoading}
            sx={{ ml: 1, bgcolor: '#184a5b', '&:hover': { bgcolor: '#0f323d' } }}
          >
            {(loading || chartLoading) ? <CircularProgress size={24} sx={{ color: '#fff' }} /> : 'Refresh'}
          </Button>
        </div>
      </div>

      <div className="admin-dashboard-content-wrapper">
        <div className="admin-dashboard-container">
          <div className="admin-dashboard-main">
            {dataSource === 'localStorage' && (
              <Alert severity="info" sx={{ mb: 2 }}>
                Using local data. API connection failed or returned forbidden.
              </Alert>
            )}

            <div className="admin-dashboard-charts">
              <div className="admin-dashboard-chart-card">
                <div className="admin-dashboard-chart-header">
                  <div className="admin-dashboard-chart-title">
                    <span className="admin-dashboard-walk-in-dot"></span> Walk In
                    <span className="admin-dashboard-appointment-dot"></span> Appointment
                  </div>
                </div>
                {chartLoading ? (
                  <div className="loading-container">
                    <CircularProgress />
                    <p>Loading chart data from database...</p>
                  </div>
                ) : error ? (
                  <div className="error-container">
                    <p>{error}</p>
                  </div>
                ) : (
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={walkInData}>
                      <CartesianGrid strokeDasharray="5 5" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" name="Walk-ins" fill="#1C4D5A" />
                      <Bar dataKey="appointments" name="Appointments" fill="#8DC3A7" />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </div>

              <div className="admin-dashboard-chart-card">
                {loading ? (
                  <div className="loading-container">
                    <CircularProgress />
                    <p>Loading application data...</p>
                  </div>
                ) : (
                  <Card className="ApplicationDashPieChart">
                    <CardContent>
                      <ApplicationPieChart applications={applications} />
                    </CardContent>
                  </Card>
                )}
              </div>
            </div>

            <RecentAppointmentsAdmin />
            <RecentApplicationsAdmin />
          </div>

          <div className="admin-dashboard-sidebar">
            <div className="admin-dashboard-walk-in-queue">
              <h2>Walk - In Queue</h2>
              <WalkInQueueAdmin />
            </div>
            
            <Container className='OverAllStatAppointContainer'>
              <Paper className="TotalStatCard" elevation={1}>
                <Typography variant="subtitle1" className="AllStatCardTitle">
                  Overall Appointments
                </Typography>
                <Typography variant="h4" sx={{ color: '#184a5b', fontWeight: 600 }}>
                  {appointmentStats.overall}
                </Typography>
              </Paper>
            </Container>
              
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