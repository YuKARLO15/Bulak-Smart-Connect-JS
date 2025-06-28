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
  Snackbar,
  Menu,
  MenuItem
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import './ApplicationAdminDashboard.css';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../NavigationComponents/NavSide';
import ApplicationPieChart from './ApplicationPieChart';
import { documentApplicationService } from '../../services/documentApplicationService';

const FILTER_OPTIONS = [
  { label: 'All', value: 'All' },
  { label: 'Pending', value: 'Pending' },
  { label: 'Approved', value: 'Approved' },
  { label: 'Denied', value: 'Denied' }
];

const AdminApplicationDashboard = () => {
  const [filter, setFilter] = useState('All');
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataSource, setDataSource] = useState('loading');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const openFilterMenu = Boolean(anchorEl);
  const navigate = useNavigate();

  // Snackbar functions
  const showNotification = (message, severity = 'info') => {
    setSnackbar({ open: true, message, severity });
  };
  const handleCloseSnackbar = () => setSnackbar(prev => ({ ...prev, open: false }));

  // Data standardization
  const standardizeApplicationData = (apps) => {
    if (!Array.isArray(apps)) return [];
    return apps.map(app => ({
      id: app.id || app._id || 'unknown-id',
      type: app.applicationType || app.type || 'Document Application',
      applicationType: app.applicationSubtype || app.applicationType || app.type || 'Unknown Type',
      date: formatDate(app.createdAt || app.date || new Date()),
      status: app.status || 'Pending',
      message: app.statusMessage || app.message || `Application for ${app.applicantName || 'Unknown'}`,
      applicantName: app.applicantName || `${app.firstName || ''} ${app.lastName || ''}`.trim() || 'Unknown',
      originalData: app
    }));
  };

  // Date formatting
  const formatDate = (dateInput) => {
    if (!dateInput) return 'N/A';
    try {
      const date = new Date(dateInput);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return String(dateInput);
    }
  };

  // Fetch applications
  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await documentApplicationService.getAllApplications();
      if (Array.isArray(response)) {
        const standardizedData = standardizeApplicationData(response);
        setApplications(standardizedData);
        setDataSource('api');
        return standardizedData;
      } else {
        throw new Error('Invalid response format: Not an array');
      }
    } catch (apiError) {
      showNotification('Cannot load from API. Using local data.', 'warning');
      const localData = JSON.parse(localStorage.getItem('applications') || '[]');
      const standardizedData = standardizeApplicationData(localData);
      setApplications(standardizedData);
      setDataSource('localStorage');
      return standardizedData;
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch and polling
  useEffect(() => {
    fetchApplications();
    const intervalId = setInterval(fetchApplications, 120000);
    return () => clearInterval(intervalId);
  }, []);

  // Filtering logic
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
          applications.filter(app => app.status?.toLowerCase() === 'approved')
        );
      } else if (filter === 'Denied') {
        setFilteredApplications(
          applications.filter(app =>
            ['rejected', 'declined', 'denied', 'decline'].includes(app.status?.toLowerCase())
          )
        );
      }
    } catch (err) {
      setError('Error filtering applications: ' + err.message);
    }
  }, [filter, applications]);

  // Table status pill class
  const getStatusClassName = status => {
    if (!status) return '';
    status = status.toLowerCase();
    if (status.includes('approved')) return 'Approved';
    if (status.includes('pending') || status.includes('submitted')) return 'Pending';
    if (status.includes('declined') || status.includes('decline') ||  status.includes('denied') || status.includes('rejected')) return 'Denied';
    return '';
  };

  // Review application
  const handleReviewApplication = (application) => {
    try {
      localStorage.setItem('currentApplicationId', application.id);
      navigate('/ApplicationDetails/' + application.id);
    } catch (err) {
      showNotification('Error opening application details', 'error');
    }
  };

  // Dropdown logic
  const handleFilterIconClick = (e) => setAnchorEl(e.currentTarget);
  const handleFilterMenuClose = () => setAnchorEl(null);
  const handleDropdownSelect = (status) => {
    setFilter(status);
    setAnchorEl(null);
  };

  // Refresh
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

     

      <Box className="ApplicationDashTableSection">
        <Box className="ApplicationDashTableHeader">
          <Typography variant="h6" className="ApplicationDashTableTitle">
            Submitted Applications
          </Typography>
          <IconButton
            className="ApplicationDashFilterButton"
            size="small"
            onClick={handleFilterIconClick}
          >
            <FilterListIcon fontSize="small" />
          </IconButton>
          <Menu
            anchorEl={anchorEl}
            open={openFilterMenu}
            onClose={handleFilterMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            className="FilterDropdownMenu"
          >
            {FILTER_OPTIONS.map(option => (
              <MenuItem
                key={option.value}
                selected={filter === option.value}
                onClick={() => handleDropdownSelect(option.value)}
              >
                {option.label}
              </MenuItem>
            ))}
          </Menu>
        </Box>

        <Box className="ApplicationDashTableContent">
          {loading && applications.length === 0 ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
              <CircularProgress />
            </Box>
          ) : filteredApplications.length === 0 ? (
            <Box className="ApplicationDashNoData">
              <img
                src="https://cdn-icons-png.flaticon.com/512/4076/4076549.png"
                alt="No data"
                style={{ height: 80, opacity: 0.4, marginBottom: 16 }}
              /><br />
              <span>
                {applications.length === 0 ? 
                  "No applications found. Try refreshing or check your connection." : 
                  "No applications found for the selected status."}
              </span>
            </Box>
          ) : (
            <TableContainer component={Paper} elevation={0} sx={{ width: '100%', overflowX: 'hidden', background: 'transparent' }}>
              <Table stickyHeader sx={{ width: '100%', tableLayout: 'fixed', maxWidth: '100%' }}>
                <TableHead>
                  <TableRow>
                    <TableCell className='ApplicationDashRowTitle' >Type</TableCell>
                    <TableCell className='ApplicationDashRowTitle' >Submitted Date</TableCell>
                    <TableCell className='ApplicationDashRowTitle' >Status</TableCell>
                    <TableCell className='ApplicationDashRowTitle' >ID</TableCell>
                    <TableCell className='ApplicationDashRowTitle'  align="right">Action</TableCell>
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
                        className={`ApplicationDashApplicationStatusPill ${getStatusClassName(app.status)}`}
                        style={{ verticalAlign: 'middle' }}
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