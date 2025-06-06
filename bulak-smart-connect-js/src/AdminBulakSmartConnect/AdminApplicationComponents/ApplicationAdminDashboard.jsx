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
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import FilterListIcon from '@mui/icons-material/FilterList';
import './ApplicationAdminDashboard.css';
import { getApplications } from '../../UserBulakSmartConnect/ApplicationComponents/ApplicationData';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../NavigationComponents/NavSide';
import ApplicationPieChart from './ApplicationPieChart'; 

const AdminApplicationDashboard = () => {
  const [filter, setFilter] = useState('All');
  const [applications, setApplications] = useState([]);
  const [filteredApplications, setFilteredApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    try {
      setLoading(true);
      const fetchedApplications = getApplications();
      setApplications(fetchedApplications);
    } catch (err) {
      setError('Error loading applications: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const handleStorageChange = e => {
      if (e.key === 'applications') {
        const updatedApplications = getApplications();
        setApplications(updatedApplications);
      }
    };

    window.addEventListener('storage', handleStorageChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  const pendingCount = applications.filter(app => app.status === 'Pending').length;
  const approvedCount = applications.filter(app => app.status === 'Approved').length;
  const deniedCount = applications.filter(
    app => app.status === 'Decline' || app.status === 'Decline'
  ).length;

  useEffect(() => {
    try {
      if (filter === 'All') {
        setFilteredApplications(applications);
      } else {
        setFilteredApplications(
          applications.filter(
            app =>
              app.status === filter ||
              (filter === 'Denied' && app.status === 'Decline') ||
              (filter === 'Decline' && app.status === 'Denied')
          )
        );
      }
    } catch (err) {
      setError('Error filtering applications: ' + err.message);
    }
  }, [filter, applications]);

  const handleFilterClick = status => {
    setFilter(status);
  };

  const handleReviewApplication = application => {
    console.log('Reviewing application:', application.id);

    if (application.type === 'Birth Certificate') {
      try {
        localStorage.setItem('currentApplicationId', application.id);

        navigate('/ApplicationDetails/' + application.id);
      } catch (err) {
        console.error('Error preparing for review:', err);
      }
    } else {
      console.log('Navigating to review for:', application.type);

      navigate('/ApplicationDetails/' + application.id);
    }
  };

  const getStatusClassName = status => {
    switch (status) {
      case 'Approved':
        return 'approved';
      case 'Pending':
        return 'pending';
      case 'Declined':
      case 'Denied':
        return 'denied';
      default:
        return '';
    }
  };

  if (loading) {
    return (
      <Box className="ApplicationDashLoading">
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading applications...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="ApplicationDashError">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  return (
    <Box className={`ApplicationDashContainer ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <NavBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      <Box className="ApplicationDashHeader">
        <Typography variant="h5" className="ApplicationDashTitle">
          Applications
        </Typography>
      </Box>

      <Box className="ApplicationDashContent">
        <Card className="ApplicationDashOverview">
          <CardContent>
            <Typography variant="h6" className="ApplicationDashSectionTitle" gutterBottom>
              Application Overview
            </Typography>

            <Box className="ApplicationDashStats">
              <Button
                fullWidth
                className={`ApplicationDashPendingCard ${filter === 'Pending' ? 'active' : ''}`}
                onClick={() => handleFilterClick('Pending')}
              >
                <Box className="ApplicationDashIcon pending">
                  <Box className="ApplicationDashCircleIcon pending" />
                </Box>
                <Typography className="ApplicationDashLabel">APPLICATION PENDING</Typography>
                <Typography className="ApplicationDashCount">{pendingCount}</Typography>
              </Button>

              <Button
                fullWidth
                className={`ApplicationDashApprovedCard ${filter === 'Approved' ? 'active' : ''}`}
                onClick={() => handleFilterClick('Approved')}
              >
                <Box className="ApplicationDashIcon approved">
                  <Box className="ApplicationDashCircleIcon approved" />
                </Box>
                <Typography className="ApplicationDashLabel">APPLICATION APPROVED</Typography>
                <Typography className="ApplicationDashCount">{approvedCount}</Typography>
              </Button>

              <Button
                fullWidth
                className={`ApplicationDashDeniedCard ${filter === 'Denied' ? 'active' : ''}`}
                onClick={() => handleFilterClick('Denied')}
              >
                <Box className="ApplicationDashIcon denied">
                  <Box className="ApplicationDashCircleIcon denied" />
                </Box>
                <Typography className="ApplicationDashLabel">APPLICATION DENIED</Typography>
                <Typography className="ApplicationDashCount">{deniedCount}</Typography>
              </Button>
            </Box>
          </CardContent>
        </Card>

        {/* Pie chart component - replacing the line chart */}
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
          {filteredApplications.length === 0 ? (
            <Box className="ApplicationDashNoData">
              No applications found for the selected status.
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
                      <TableCell className="ApplicationDashApplicationType">{app.type}</TableCell>
                      <TableCell className="ApplicationDashApplicationRef">
                        {app.date || app.ref || 'N/A'}
                      </TableCell>
                      <TableCell
                        className={`ApplicationDashApplicationStatus ${getStatusClassName(app.status)}`}
                      >
                        {app.status}
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
    </Box>
  );
};


export default AdminApplicationDashboard;