import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  CircularProgress,
  Alert,
  IconButton,
  Paper,
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Snackbar
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import './ApplicationAdminDashboard.css';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../NavigationComponents/NavSide';
import ApplicationPieChart from './ApplicationPieChart';
import { documentApplicationService } from '../../services/documentApplicationService';

const AdminApplicationDashboard = () => {
  const [filter, setFilter] = useState('All');
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [dataSource, setDataSource] = useState('loading'); // 'api', 'localStorage', or 'loading'

  // Show snackbar notification
  const showNotification = (message, severity = 'info') => {
    setSnackbar({
      open: true,
      message,
      severity
    });
  };

  // Close snackbar
  const handleCloseSnackbar = () => {
    setSnackbar(prev => ({ ...prev, open: false }));
  };

  // Convert data from any format to our standard format
  const standardizeApplicationData = (apps) => {
    if (!Array.isArray(apps)) {
      console.error('Not an array:', apps);
      return [];
    }
    
    return apps.map(app => {
      // Handle both API and localStorage data formats
      return {
        id: app.id || app._id || 'unknown-id',
        type: app.applicationType || app.type || 'Document Application',
        applicationType: app.applicationSubtype || app.applicationType || app.type || 'Unknown Type',
        date: formatDate(app.createdAt || app.date || new Date()),
        status: app.status || 'Pending',
        message: app.statusMessage || app.message || `Application for ${app.applicantName || 'Unknown'}`,
        applicantName: app.applicantName || `${app.firstName || ''} ${app.lastName || ''}`.trim() || 'Unknown',
        // Store the original data
        originalData: app
      };
    });
  };

  // Format date consistently
  const formatDate = (dateInput) => {
    if (!dateInput) return 'N/A';
    
    try {
      const date = new Date(dateInput);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (err) {
      return String(dateInput); // Return as string if parsing fails
    }
  };

  // Fetch applications from backend or localStorage
  const fetchApplications = async () => {
    try {
      setLoading(true);
      console.log("Fetching applications from backend...");
      
      try {
        // Try to get applications from service (which has its own fallbacks)
        const response = await documentApplicationService.getAllApplications();
        
        // Make sure we have an array to work with
        if (Array.isArray(response)) {
          console.log("Applications fetched:", response);
          
          // Standardize the data format
          const standardizedData = standardizeApplicationData(response);
          setApplications(standardizedData);
          setDataSource('api');
          return standardizedData;
        } else {
          throw new Error('Invalid response format: Not an array');
        }
      } catch (apiError) {
        console.error("API error:", apiError);
        showNotification('Cannot load from API. Using local data.', 'warning');
        
        // Direct fallback to localStorage
        const localData = JSON.parse(localStorage.getItem('applications') || '[]');
        const standardizedData = standardizeApplicationData(localData);
        setApplications(standardizedData);
        setDataSource('localStorage');
        return standardizedData;
      }
    } catch (err) {
      console.error("Error fetching applications:", err);
      setError('Error loading applications: ' + err.message);
      
      // Final fallback - set empty array if all else fails
      setApplications([]);
      setDataSource('localStorage');
      return [];
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchApplications();
    
    // Set up polling to refresh data at intervals - use a longer interval
    const intervalId = setInterval(() => {
      fetchApplications();
    }, 120000); // refresh every 2 minutes to reduce load
    
    return () => clearInterval(intervalId);
  }, []);

  // Calculate stats based on available data
  const pendingCount = applications.filter(app => 
    app.status?.toLowerCase() === 'pending' || app.status?.toLowerCase() === 'submitted').length;
    
  const approvedCount = applications.filter(app => 
    app.status?.toLowerCase() === 'approved').length;
    
  const deniedCount = applications.filter(app => 
    app.status?.toLowerCase() === 'rejected' || 
    app.status?.toLowerCase() === 'declined' ||
    app.status?.toLowerCase() === 'denied').length;

  useEffect(() => {
    try {
      if (filter === 'All') {
        setFilteredApplications(applications);
      } else if (filter === 'Pending') {
        setFilteredApplications(
          applications.filter(app => 
            app.status?.toLowerCase() === 'pending' || app.status?.toLowerCase() === 'submitted')
        );
      } else if (filter === 'Approved') {
        setFilteredApplications(
          applications.filter(app => 
            app.status?.toLowerCase() === 'approved')
        );
      } else if (filter === 'Denied') {
        setFilteredApplications(
          applications.filter(app => 
            app.status?.toLowerCase() === 'rejected' || 
            app.status?.toLowerCase() === 'declined' || 
            app.status?.toLowerCase() === 'denied')
        );
      }
    } catch (err) {
      setError('Error filtering applications: ' + err.message);
    }
  }, [filter, applications]);

  const handleFilterClick = status => {
    setFilter(status);
  };

  const handleReviewApplication = async application => {
    console.log('Reviewing application:', application.id);

    try {
      // Store current application ID in localStorage for the details page
      localStorage.setItem('currentApplicationId', application.id);
      
      // Navigate to the application details page
      navigate('/ApplicationDetails/' + application.id);
    } catch (err) {
      console.error('Error preparing for review:', err);
      showNotification('Error opening application details', 'error');
    }
  };

  const getStatusClassName = status => {
    if (!status) return '';
    
    status = status.toLowerCase();
    
    if (status.includes('approved')) return 'Approved';
    if (status.includes('pending') || status.includes('submitted')) return 'Pending';
    if (status.includes('declined') || status.includes('denied') || status.includes('rejected')) return 'Denied';
    
    return '';
  };

  // Refresh button handler
  const handleRefresh = () => {
    fetchApplications();
    showNotification('Refreshing application data...', 'info');
  };

  return (
    <Box className={`ApplicationDashContainer ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <NavBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      <Box className="ApplicationDashHeader">
        <Typography variant="h5" className="ApplicationDashTitle">
          Applications
        </Typography>
        
        <Button 
          variant="outlined" 
          onClick={handleRefresh}
          startIcon={loading ? <CircularProgress size={20} /> : null}
          disabled={loading}
          sx={{ ml: 2 }}
        >
          Refresh
        </Button>
      </Box>

      {dataSource === 'localStorage' && (
        <Alert severity="info" sx={{ mb: 2 }}>
          Using local data. API connection failed or returned forbidden. Please check your network or permissions.
        </Alert>
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
          <Button onClick={handleRefresh} size="small" sx={{ mt: 1 }}>
            Try Again
          </Button>
        </Alert>
      )}

      <Box className="ApplicationDashContent">
        <Card className="ApplicationDashOverview">
          <CardContent>
            <Typography variant="h6" className="ApplicationDashSectionTitle" gutterBottom>
              Application Overview
            </Typography>

            <Box className="ApplicationDashStats">
              <Button
                fullWidth
                className={`ApplicationDashPendingCard ${filter === 'Pending' ? 'Active' : ''}`}
                onClick={() => handleFilterClick('Pending')}
              >
                <Box className="ApplicationDashIcon Pending">
                  <Box className="ApplicationDashCircleIcon Pending" />
                </Box>
                <Typography className="ApplicationDashLabel">APPLICATION PENDING</Typography>
                <Typography className="ApplicationDashCount">{pendingCount}</Typography>
              </Button>

              <Button
                fullWidth
                className={`ApplicationDashApprovedCard ${filter === 'Approved' ? 'Active' : ''}`}
                onClick={() => handleFilterClick('Approved')}
              >
                <Box className="ApplicationDashIcon Approved">
                  <Box className="ApplicationDashCircleIcon Approved" />
                </Box>
                <Typography className="ApplicationDashLabel">APPLICATION APPROVED</Typography>
                <Typography className="ApplicationDashCount">{approvedCount}</Typography>
              </Button>

              <Button
                fullWidth
                className={`ApplicationDashDeniedCard ${filter === 'Denied' ? 'Active' : ''}`}
                onClick={() => handleFilterClick('Denied')}
              >
                <Box className="ApplicationDashIcon Denied">
                  <Box className="ApplicationDashCircleIcon Denied" />
                </Box>
                <Typography className="ApplicationDashLabel">APPLICATION DENIED</Typography>
                <Typography className="ApplicationDashCount">{deniedCount}</Typography>
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Pie chart component */}
        <Card className="ApplicationDashPieChart">
          <CardContent>
            <ApplicationPieChart applications={applications} />
          </CardContent>
        </Card>
      </Box>

      <Box className="ApplicationDashTableSection" sx={{ maxWidth: '80vw', overflowX: 'hidden' }}>
        <Box className="ApplicationDashTableHeader">
          <Typography variant="h6" className="ApplicationDashTableTitle">
            Submitted Applications
          </Typography>
          <IconButton className="ApplicationDashFilterButton" size="small">
            <FilterListIcon fontSize="small" />
          </IconButton>
        </Box>

        <Box className="ApplicationDashTableContent" sx={{ maxWidth: '80vw', overflowX: 'hidden' }}>
          {loading && applications.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : filteredApplications.length === 0 ? (
            <Box className="ApplicationDashNoData">
              {applications.length === 0 ? 
                "No applications found. Try refreshing or check your connection." : 
                "No applications found for the selected status."}
            </Box>
          ) : (
            <TableContainer
              component={Paper}
              elevation={0}
              sx={{
                width: '100%',
                maxWidth: '80vw',
                overflowX: 'hidden',
              }}
            >
              <Table
                stickyHeader
                sx={{
                  width: '100%',
                  tableLayout: 'fixed',
                  maxWidth: '100%',
                }}
              >
                <TableHead>
                  <TableRow>
                    <TableCell>Type</TableCell>
                    <TableCell>Submitted Date</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>ID</TableCell>
                    <TableCell align="right">Action</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredApplications.map((app, index) => (
                    <TableRow key={app.id || index} className="ApplicationDashTableRow">
                      <TableCell className="ApplicationDashApplicationType">
                        {app.applicationType || app.type || 'Document Application'}
                      </TableCell>
                      <TableCell className="ApplicationDashApplicationRef">
                        {app.date || 'N/A'}
                      </TableCell>
                      <TableCell
                        className={`ApplicationDashApplicationStatus ${getStatusClassName(app.status)}`}
                      >
                        {app.status || 'Pending'}
                      </TableCell>
                      <TableCell className="ApplicationDashApplicationId">
                        {app.id || 'N/A'}
                      </TableCell>
                      <TableCell className="ApplicationDashApplicationAction" align="right">
                        <Button
                          size="small"
                          color="primary"
                          className="ApplicationDashReviewButton"
                          onClick={() => handleReviewApplication(app)}
                        >
                          REVIEW
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          )}
        </Box>
      </Box>

      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default AdminApplicationDashboard;