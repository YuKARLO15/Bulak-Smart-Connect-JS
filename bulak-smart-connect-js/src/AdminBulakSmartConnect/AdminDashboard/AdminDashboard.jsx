import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import './AdminDashboard.css';
import axios from 'axios';
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
import RecentApplicationsAdmin from './RecentApplicationsAdmin';
import RecentAppointmentsAdmin from './RecentAppointmentsAdmin';
import WalkInQueueAdmin from './WalkInQueueAdmin';

const formatWKNumber = (queueNumber) => {
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

  // API Connection - example structure for future implementation
  const fetchWalkInQueue = useCallback(async () => {
    setQueueLoading(true);
    try {
      // Fetch walk-in queue data from your API
      const response = await axios.get('http://localhost:3000/queues/walk-in');
      
      // Format the data for display
      const formattedQueue = response.data.map(queue => ({
        id: queue.id,
        queueNumber: formatWKNumber(queue.queueNumber),
        firstName: queue.firstName || 'Guest',
        lastName: queue.lastName || '',
        reasonOfVisit: queue.reasonOfVisit || 'General Inquiry',
        status: queue.status || 'pending',
        timestamp: queue.createdAt || new Date().toISOString()
      }));
      
      setWalkInQueue(formattedQueue);
      setQueueError(null);
    } catch (error) {
      console.error('Error fetching walk-in queue:', error);
      setQueueError('Could not load queue data');
      
      // Fallback to mock data for development
      setWalkInQueue([
        {
          id: 1,
          queueNumber: 'WK001',
          firstName: 'Juan',
          lastName: 'Dela Cruz',
          reasonOfVisit: 'Birth Certificate',
          status: 'pending',
          timestamp: new Date().toISOString()
        },
        {
          id: 2,
          queueNumber: 'WK002',
          firstName: 'Maria',
          lastName: 'Santos',
          reasonOfVisit: 'Marriage Certificate',
          status: 'in-progress',
          timestamp: new Date().toISOString()
        },
        {
          id: 3,
          queueNumber: 'WK003',
          firstName: 'Pedro',
          lastName: 'Reyes',
          reasonOfVisit: 'Death Certificate',
          status: 'pending',
          timestamp: new Date().toISOString()
        }
      ]);
    } finally {
      setQueueLoading(false);
    }
  }, []);

  // Fetch queue data initially and refresh every 30 seconds
  useEffect(() => {
    fetchWalkInQueue();
    
    // Auto-refresh queue data every 30 seconds
    const intervalId = setInterval(fetchWalkInQueue, 30000);
    
    // Clean up interval on component unmount
    return () => clearInterval(intervalId);
  }, [fetchWalkInQueue]);

  // Existing useEffect for dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        const response = await fetch('http://localhost:3000/api/dashboard');
        const data = await response.json();
        setWalkInData(data.walkInData || []);
        setCertificateData(data.certificateData || []);
        setDocumentApplications(data.applications || []);
        setPreAppointments(data.appointments || []);

        setLoading(false);
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
        setError('Failed to load dashboard data');
        setLoading(false);
      }
    };

    fetchDashboardData();
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
                <ResponsiveContainer width="100%" height={200}>
                  <BarChart data={walkInData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="value" name="Walk-ins" fill="#1C4D5A" />
                    <Bar dataKey="appointments" name="Appointments" fill="#8DC3A7" />
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
              <RecentApplicationsAdmin />
              <div className="admin-dashboard-document-applications">{/* No data */}</div>
            </div>

            {/* Pre-Appointments Section */}
            <div className="admin-dashboard-section-container">
              <h2> Scheduled Appointments</h2>
              <RecentAppointmentsAdmin />
              <div className="admin-dashboard-pre-appointments">{/* No data */}</div>
            </div>
          </div>

          {/* Right side column */}
          <div className="admin-dashboard-sidebar">
            {/* Walk-In Queue Section */}
            <div className="admin-dashboard-walk-in-queue">
              <h2>Walk - In Queue</h2>
         <WalkInQueueAdmin />
            </div>
          </div>
        </div>
      </div>
    </div>
           
  );
};

export default AdminDashboard;
