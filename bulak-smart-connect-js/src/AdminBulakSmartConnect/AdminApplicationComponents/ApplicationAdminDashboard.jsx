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

        {/* Right Column: Line Chart */}
        <Card className="ApplicationDashChart">
          <CardContent>
            <Box className="ApplicationDashChartContainer">
              <Box className="ApplicationDashChartHeader">
                <Typography variant="caption" color="textSecondary">
                  Stats overview
                </Typography>
                <Box className="ApplicationDashChartLegend">
                  <Box className="ApplicationDashChartLegendItem">
                    <Box className="ApplicationDashChartLegendDot approved"></Box>
                    <Typography variant="caption">Approved</Typography>
                  </Box>
                  <Box className="ApplicationDashChartLegendItem">
                    <Box className="ApplicationDashChartLegendDot pending"></Box>
                    <Typography variant="caption">Pending</Typography>
                  </Box>
                </Box>
              </Box>

              {/* Line chart */}
              <Box className="ApplicationDashChartBody">
                {/* Chart grid lines */}
                {[0, 1, 2, 3].map(line => (
                  <Box key={line} className="ApplicationDashChartGridLine" />
                ))}

                {/* Line chart for approved applications */}
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  style={{ position: 'absolute', left: 0, bottom: 0, right: 0, top: 0 }}
                >
                  <polyline
                    points="
                      0,80
                      9,65
                      18,75
                      27,55
                      36,45
                      45,50
                      54,40
                      63,30
                      72,35
                      81,25
                      90,20
                      100,15
                    "
                    fill="none"
                    stroke="green"
                    strokeWidth="2"
                  />
                  {/* Dots for approved line */}
                  {[
                    [0, 80],
                    [9, 65],
                    [18, 75],
                    [27, 55],
                    [36, 45],
                    [45, 50],
                    [54, 40],
                    [63, 30],
                    [72, 35],
                    [81, 25],
                    [90, 20],
                    [100, 15],
                  ].map((point, i) => (
                    <circle
                      key={`approved-${i}`}
                      cx={point[0]}
                      cy={point[1]}
                      r="1.5"
                      fill="green"
                    />
                  ))}
                </svg>

                {/* Line chart for pending applications */}
                <svg
                  width="100%"
                  height="100%"
                  viewBox="0 0 100 100"
                  preserveAspectRatio="none"
                  style={{ position: 'absolute', left: 0, bottom: 0, right: 0, top: 0 }}
                >
                  <polyline
                    points="
                      0,85
                      9,75
                      18,80
                      27,70
                      36,60
                      45,65
                      54,55
                      63,60
                      72,50
                      81,45
                      90,35
                      100,40
                    "
                    fill="none"
                    stroke="orange"
                    strokeWidth="2"
                  />
                  {/* Dots for pending line */}
                  {[
                    [0, 85],
                    [9, 75],
                    [18, 80],
                    [27, 70],
                    [36, 60],
                    [45, 65],
                    [54, 55],
                    [63, 60],
                    [72, 50],
                    [81, 45],
                    [90, 35],
                    [100, 40],
                  ].map((point, i) => (
                    <circle
                      key={`pending-${i}`}
                      cx={point[0]}
                      cy={point[1]}
                      r="1.5"
                      fill="orange"
                    />
                  ))}
                </svg>
              </Box>

              {/* Month labels */}
              <Box className="ApplicationDashChartLabels">
                {['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'].map((month, i) => (
                  <Typography key={i} variant="caption" className="ApplicationDashChartMonthLabel">
                    {month}
                  </Typography>
                ))}
              </Box>
            </Box>
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
