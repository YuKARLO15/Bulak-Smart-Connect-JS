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
import ApplicationLineChart from '../AdminChartsComponent/ApplicationLineChart';

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

const [monthlyData, setMonthlyData] = useState({
  Birth: [15, 20, 10, 25, 30, 22, 28, 35, 32, 40, 45, 50],
  Marriage: [20, 25, 15, 18, 20, 25, 22, 28, 30, 32, 28, 35],
});



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

        {/* Right Column: Line Chart */}
        <Card className="ApplicationDashChart">
  <CardContent>
    <Typography variant="h6" className="ApplicationDashSectionTitle" gutterBottom>
      Application Trends
    </Typography>
    <Typography variant="body2" sx={{ color: 'rgba(0,0,0,0.6)', marginBottom: 2 }}>
      Monthly application statistics
    </Typography>
    
   
    <ApplicationLineChart 
      data={[
        { name: 'Feb', Birth: monthlyData.Birth[1], Marriage: monthlyData.Marriage[1] },
        { name: 'Mar', Birth: monthlyData.Birth[2], Marriage: monthlyData.Marriage[2] },
        { name: 'Apr', Birth: monthlyData.Birth[3], Marriage: monthlyData.Marriage[3] },
        { name: 'May', Birth: monthlyData.Birth[4], Marriage: monthlyData.Marriage[4] },
        { name: 'Jun', Birth: monthlyData.Birth[5], Marriage: monthlyData.Marriage[5] },
        { name: 'Jul', Birth: monthlyData.Birth[6], Marriage: monthlyData.Marriage[6] },
        { name: 'Aug', Birth: monthlyData.Birth[7], Marriage: monthlyData.Marriage[7] },
        { name: 'Sep', Birth: monthlyData.Birth[8], Marriage: monthlyData.Marriage[8] },
        { name: 'Oct', Birth: monthlyData.Birth[9], Marriage: monthlyData.Marriage[9] },
        { name: 'Nov', Birth: monthlyData.Birth[10],Marriage: monthlyData.Marriage[10] },
        { name: 'Dec', Birth: monthlyData.Birth[11],Marriage: monthlyData.Marriage[11] },
      ]}
    />
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
