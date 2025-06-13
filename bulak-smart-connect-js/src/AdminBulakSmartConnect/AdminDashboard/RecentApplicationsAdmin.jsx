import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
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
import { documentApplicationService } from '../../services/documentApplicationService'; // Update path as needed
import './RecentApplicationsAdmin.css';

const RecentApplicationsAdmin = () => {
  const [applications, setApplications] = useState([]);
  const [statistics, setStatistics] = useState({
    birthCertificate: {
      pending: 0,
      approved: 0,
      declined: 0,
      total: 0
    },
    marriage: {
      pending: 0,
      approved: 0,
      declined: 0,
      total: 0
    },
    overall: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [dataSource, setDataSource] = useState('loading');
  const navigate = useNavigate();

  // Date formatting helper
  const formatDate = (dateInput) => {
    if (!dateInput) return 'N/A';
    try {
      const date = new Date(dateInput);
      return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch {
      return String(dateInput);
    }
  };

  // Data standardization function (similar to AdminApplicationDashboard)
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

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setLoading(true);
        console.log('Fetching applications for RecentApplicationsAdmin...');
        
        // Use the service to get applications from the database
        const response = await documentApplicationService.getAllApplications();
        
        // Log the raw response to help with debugging
        console.log('API response:', response);
        
        if (Array.isArray(response)) {
          // Standardize the data to ensure consistent structure
          const standardizedData = standardizeApplicationData(response);
          setApplications(standardizedData);
          setDataSource('api');
          
          // Calculate statistics using standardized data
          calculateStatistics(standardizedData);
        } else {
          throw new Error('Invalid response format: Not an array');
        }
      } catch (err) {
        console.error('Failed to fetch from API:', err);
        setError('Error loading applications: ' + err.message);
        
        // Fallback to localStorage
        try {
          const localData = JSON.parse(localStorage.getItem('applications') || '[]');
          const standardizedData = standardizeApplicationData(localData);
          setApplications(standardizedData);
          setDataSource('localStorage');
          
          // Calculate statistics using local data
          calculateStatistics(standardizedData);
        } catch (localErr) {
          console.error('Failed to load from localStorage:', localErr);
        }
      } finally {
        setLoading(false);
      }
    };
    
    fetchApplications();
  }, []);

  // Separate function to calculate statistics for better readability
  const calculateStatistics = (apps) => {
    const stats = {
      birthCertificate: {
        pending: 0,
        approved: 0,
        declined: 0,
        total: 0
      },
      marriage: {
        pending: 0,
        approved: 0,
        declined: 0,
        total: 0
      },
      overall: apps.length
    };
    
    // Log the number of applications for debugging
    console.log(`Processing ${apps.length} applications for statistics`);
    
    apps.forEach(app => {
      // Log each application type and status to debug
      console.log(`Application: Type=${app.type}, Status=${app.status}`);
      
      // Check application type - make case-insensitive checks to improve matching
      const appType = (app.type || app.applicationType || '').toLowerCase();
      let docCategory = null;
      
      // Determine the category based on application type
      if (appType.includes('birth') || appType.includes('certificate')) {
        docCategory = 'birthCertificate';
      } else if (appType.includes('marriage') || appType.includes('wed')) {
        docCategory = 'marriage';
      }
      
      // If we identified a category, update stats
      if (docCategory) {
        stats[docCategory].total++;
        
        // Process status - normalize to handle different status formats
        const status = (app.status || '').toLowerCase();
        
        if (status.includes('pending') || status.includes('submitted') || status === '') {
          stats[docCategory].pending++;
        } else if (status.includes('approved') || status.includes('accept')) {
          stats[docCategory].approved++;
        } else if (status.includes('declined') || status.includes('denied') || status.includes('reject')) {
          stats[docCategory].declined++;
        } else {
          // Default to pending for any other status
          stats[docCategory].pending++;
        }
      }
    });
    
    // Log the calculated statistics for debugging
    console.log('Calculated statistics:', stats);
    
    setStatistics(stats);
  };

  const StatusColor = status => {
    switch (status) {
      case 'approved':
        return '#4caf50'; // Green
      case 'pending':
        return '#ff9800'; // Orange
      case 'declined':
        return '#f44336'; // Red
      default:
        return '#184a5b'; // Default blue
    }
  };

  const handleManualRefresh = () => {
    window.location.reload();
  };

  if (loading) {
    return (
      <Box className="RecentAppsAdminLoading">
        <CircularProgress size={24} sx={{ color: '#184a5b' }} />
        <Typography variant="body2" sx={{ mt: 1, color: '#666' }}>
          Loading applications...
        </Typography>
      </Box>
    );
  }

  return (
    <Card className="RecentAppsAdminCard">
      <CardContent>
        <Box mb={2} className="RecentAppsAdminHeader">
          <Typography variant="h6" className="ApplicationStatsTitle">
            Document Application 
          </Typography>
          <Box display="flex" justifyContent="end" mt={2}>
            <Button
              size="small"
              onClick={() => navigate('/ApplicationAdmin')}
              className='ApplicationStatsViewAllButton'
            >
              View All Applications
            </Button>
          </Box>
        </Box>
        
        {error && (
          <Alert 
            severity="error" 
            sx={{ mb: 2 }}
            action={
              <Button color="inherit" size="small" onClick={handleManualRefresh}>
                Refresh
              </Button>
            }
          >
            {error}
          </Alert>
        )}
        
        {dataSource === 'localStorage' && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Using local data. API connection failed.
          </Alert>
        )}
        
        <Container className="ApplicationStatsMainContainer">
          <Container className='StatAppointmentTypeContainer'>
            {/* Birth Certificate Stats */}
            <Grid className='StatsBirthContainer'>
              <Paper className="StatCard" elevation={1}>
                <Typography variant="subtitle1" className="StatCardTitle">
                  Birth Certificate Applications
                </Typography>
                
                <Box className="StatNumbers">
                  <Box className="StatItem">
                    <Typography variant="body2">Pending:</Typography>
                    <Typography variant="h6" sx={{ color: StatusColor('pending') }}>
                      {statistics.birthCertificate.pending}
                    </Typography>
                  </Box>
                  <Box className="StatItem">
                    <Typography variant="body2">Approved:</Typography>
                    <Typography variant="h6" sx={{ color: StatusColor('approved') }}>
                      {statistics.birthCertificate.approved}
                    </Typography>
                  </Box>
                  <Box className="StatItem">
                    <Typography variant="body2">Declined:</Typography>
                    <Typography variant="h6" sx={{ color: StatusColor('declined') }}>
                      {statistics.birthCertificate.declined}
                    </Typography>
                  </Box>
                </Box>
             
              </Paper>
            </Grid>

            {/* Marriage Application Stats */}
            <Grid item xs={120} md={60} className='StatsMarriageContainer'>
              <Paper className="StatCard" elevation={1}>
                <Typography variant="subtitle1" className="StatCardTitle">
                  Marriage Applications
                </Typography>
                <Box className="StatNumbers">
                  <Box className="StatItem">
                    <Typography variant="body2">Pending:</Typography>
                    <Typography variant="h6" sx={{ color: StatusColor('pending') }}>
                      {statistics.marriage.pending}
                    </Typography>
                  </Box>
                  <Box className="StatItem">
                    <Typography variant="body2">Approved:</Typography>
                    <Typography variant="h6" sx={{ color: StatusColor('approved') }}>
                      {statistics.marriage.approved}
                    </Typography>
                  </Box>
                  <Box className="StatItem">
                    <Typography variant="body2">Declined:</Typography>
                    <Typography variant="h6" sx={{ color: StatusColor('declined') }}>
                      {statistics.marriage.declined}
                    </Typography>
                  </Box>
                </Box>
                
           
              </Paper>
            </Grid>
          </Container>
          
          {applications.length === 0 && !error && !loading && (
            <Box sx={{ textAlign: 'center', mt: 2, mb: 1 }}>
              <Typography variant="body2" color="text.secondary">
                No applications found. Applications will appear here once submitted.
              </Typography>
            </Box>
          )}
        </Container>
      </CardContent>
    </Card>
  );
};

export default RecentApplicationsAdmin;