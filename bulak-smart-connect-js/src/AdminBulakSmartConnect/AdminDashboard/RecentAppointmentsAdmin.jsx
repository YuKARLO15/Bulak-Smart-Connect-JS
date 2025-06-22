import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Card, CardContent, Button, Grid, Paper, CircularProgress, Container, Alert } from '@mui/material';
import { appointmentService } from '../../services/appointmentService'; 
import RefreshIcon from '@mui/icons-material/Refresh';
import './RecentAppointmentsAdmin.css';

const RecentAppointmentsAdmin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statistics, setStatistics] = useState({
    todayTotal: 0,
    weekPending: 0,
    weekCompleted: 0,
    weekCanceled: 0
  });
  
  // Initialize with current datetime
  const [currentDateTime, setCurrentDateTime] = useState(
    new Date().toISOString().replace('T', ' ').substring(0, 19)
  );
 const fetchStatistics = async () => {
  setLoading(true);
  setError(null);
  
  try {
    console.log('Attempting to fetch appointment statistics...');
    
    // This line has the wrong function name - let's use the proper method name
    // Original: const allAppointments = await appointmentService.getAllAppointments();
    // Correct method name:
    const allAppointments = await appointmentService.fetchAllAppointments();
    console.log('Raw appointments data:', allAppointments);
    
    // Calculate statistics manually from appointments data
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Start of today
    
    const startOfWeek = new Date(today);
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay()); // Start of week (Sunday)
    
    // Filter and count appointments
    let todayCount = 0;
    let pendingCount = 0;
    let completedCount = 0;
    let canceledCount = 0;
    
    // Check if we have appointments data and if it's an array
    if (Array.isArray(allAppointments)) {
      allAppointments.forEach(appointment => {
        // Parse appointment date
        const appointmentDate = new Date(appointment.appointmentDate || appointment.date);
        
        // Count today's appointments
        if (appointmentDate >= today && appointmentDate < new Date(today.getTime() + 86400000)) {
          todayCount++;
        }
        
        // Count week's appointments by status
        if (appointmentDate >= startOfWeek) {
          const status = (appointment.status || '').toLowerCase();
          if (status === 'pending') {
            pendingCount++;
          } else if (status === 'completed') {
            completedCount++;
          } else if (status === 'canceled' || status === 'cancelled') {
            canceledCount++;
          }
        }
      });
    }
    
    // Set the statistics based on our manual count
    setStatistics({
      todayTotal: todayCount,
      weekPending: pendingCount,
      weekCompleted: completedCount,
      weekCanceled: canceledCount
    });
    
    console.log('Calculated statistics:', {
      todayTotal: todayCount,
      weekPending: pendingCount,
      weekCompleted: completedCount,
      weekCanceled: canceledCount
    });
  } catch (error) {
    console.error('Error fetching appointment statistics:', error);
    setError(error.message || 'Failed to load appointment statistics');
    
    // Fallback: Try the regular stats endpoint if manual calculation fails
    try {
      console.log('Falling back to stats API endpoint...');
      const response = await appointmentService.getAppointmentStats();
      console.log('Stats API response:', response);
      
      const stats = response?.data || response || {};
      
      setStatistics({
        todayTotal: parseInt(stats.todayTotal || 0),
        weekPending: parseInt(stats.weekPending || 0),
        weekCompleted: parseInt(stats.weekCompleted || 0),
        weekCanceled: parseInt(stats.weekCanceled || 0)
      });
    } catch (fallbackError) {
      console.error('Fallback also failed:', fallbackError);
      // Keep the original error
    }
  } finally {
    setLoading(false);
  }
};
  
  useEffect(() => {
    // Update current time
    const updateCurrentTime = () => {
      const now = new Date();
      
      // Format as YYYY-MM-DD HH:MM:SS
      const year = now.getFullYear();
      const month = String(now.getMonth() + 1).padStart(2, '0');
      const day = String(now.getDate()).padStart(2, '0');
      const hours = String(now.getHours()).padStart(2, '0');
      const minutes = String(now.getMinutes()).padStart(2, '0');
      const seconds = String(now.getSeconds()).padStart(2, '0');
      
      const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      setCurrentDateTime(formattedDateTime);
    };
    
    // Update the time immediately
    updateCurrentTime();
    
    // Update the time every second
    const timeInterval = setInterval(updateCurrentTime, 1000);
    
    // Fetch statistics when component mounts
    fetchStatistics();
    
    return () => {
      clearInterval(timeInterval);
    };
  }, []);

  const handleRefresh = () => {
    fetchStatistics();
  };

  const renderStatisticsCard = () => {
    // Check if we should display data
    // Allow displaying even if values are zero - show the zeros rather than "no data"
    const hasAnyPositiveValue = Object.values(statistics).some(value => value > 0);
    
    return (
      <Card className="RecentAppointmentsAdminCard">
        <CardContent>
          <Box mb={2} className="RecentApptAdminHeader">
            <Container className='RecentApptAdminHeaderContainer'>
              <Typography variant="h6" className="RecentApptAdminTitle">
                Weekly Appointment Statistics
              </Typography>
              <Typography variant="body2" sx={{ color: '#666', display: 'flex', justifyContent: 'space-between' }}>
                <span>{currentDateTime} (Local Time)</span>
              </Typography>
            </Container>
            
            <Box display="flex" justifyContent="center" gap={2} mt={3}>
              <Button
                size="small"
                className="ViewDetailsButtonAdmin"
                onClick={() => navigate('/AdminAppointmentDashboard')}
              >
                View All Appointments
              </Button>
             
            </Box>
          </Box>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error} - Please try refreshing the data.
            </Alert>
          )}

          <Grid container spacing={2}>
            {/* Today's Appointments */}
            <Grid item xs={12} sm={6} md={3}>
              <Paper 
                elevation={1}
                sx={{ 
                  p: 2, 
                  borderRadius: '8px',
                  height: '100%',
                  border: '1px solid rgba(138, 172, 181, 0.2)',
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: hasAnyPositiveValue ? 'white' : '#f9f9f9'
                }}
              >
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    color: '#184a5b', 
                    fontWeight: 600, 
                    mb: 1,
                    fontSize: '0.9rem'
                  }}
                >
                  Today's Appointments
                </Typography>
                <Box 
                  sx={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexGrow: 1,
                    py: 1
                  }}
                >
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      color: '#184a5b', 
                      fontWeight: 500 
                    }}
                  >
                    {statistics.todayTotal}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#666',
                      fontSize: '0.75rem'
                    }}
                  >
                    Total for today
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            {/* This Week's Pending */}
            <Grid item xs={12} sm={6} md={3}>
              <Paper 
                elevation={1}
                sx={{ 
                  p: 2, 
                  borderRadius: '8px',
                  height: '100%',
                  border: '1px solid rgba(138, 172, 181, 0.2)',
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: hasAnyPositiveValue ? 'white' : '#f9f9f9'
                }}
              >
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    color: '#184a5b', 
                    fontWeight: 600, 
                    mb: 1,
                    fontSize: '0.9rem'
                  }}
                >
                  Week's Pending
                </Typography>
                <Box 
                  sx={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexGrow: 1,
                    py: 1
                  }}
                >
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      color: '#ff9800', 
                      fontWeight: 500 
                    }}
                  >
                    {statistics.weekPending}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#666',
                      fontSize: '0.75rem'
                    }}
                  >
                    Pending this week
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            {/* Week's Completed Appointments */}
            <Grid item xs={12} sm={6} md={3}>
              <Paper 
                elevation={1}
                sx={{ 
                  p: 2, 
                  borderRadius: '8px',
                  height: '100%',
                  border: '1px solid rgba(138, 172, 181, 0.2)',
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: hasAnyPositiveValue ? 'white' : '#f9f9f9'
                }}
              >
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    color: '#184a5b', 
                    fontWeight: 600, 
                    mb: 1,
                    fontSize: '0.9rem'
                  }}
                >
                  Week's Completed
                </Typography>
                <Box 
                  sx={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexGrow: 1,
                    py: 1
                  }}
                >
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      color: '#4caf50', 
                      fontWeight: 500 
                    }}
                  >
                    {statistics.weekCompleted}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#666',
                      fontSize: '0.75rem'
                    }}
                  >
                    Completed this week
                  </Typography>
                </Box>
              </Paper>
            </Grid>

            {/* Week's Canceled Appointments */}
            <Grid item xs={12} sm={6} md={3}>
              <Paper 
                elevation={1}
                sx={{ 
                  p: 2, 
                  borderRadius: '8px',
                  height: '100%',
                  border: '1px solid rgba(138, 172, 181, 0.2)',
                  display: 'flex',
                  flexDirection: 'column',
                  backgroundColor: hasAnyPositiveValue ? 'white' : '#f9f9f9'
                }}
              >
                <Typography 
                  variant="subtitle1" 
                  sx={{ 
                    color: '#184a5b', 
                    fontWeight: 600, 
                    mb: 1,
                    fontSize: '0.9rem'
                  }}
                >
                  Week's Canceled
                </Typography>
                <Box 
                  sx={{ 
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexGrow: 1,
                    py: 1
                  }}
                >
                  <Typography 
                    variant="h3" 
                    sx={{ 
                      color: '#f44336', 
                      fontWeight: 500 
                    }}
                  >
                    {statistics.weekCanceled}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      color: '#666',
                      fontSize: '0.75rem'
                    }}
                  >
                    Canceled this week
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          </Grid>

          {!hasAnyPositiveValue && !loading && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 3, mb: 1 }}>
              <Alert severity="info" sx={{ width: '100%', maxWidth: '600px' }}>
                <Typography variant="body2">
                  All statistics are currently zero. This could mean there are no appointments in the system yet.
                </Typography>
              </Alert>
            </Box>
          )}
        </CardContent>
      </Card>
    );
  };

  if (loading) {
    return (
      <Card className="RecentAppointmentsAdminCard">
        <CardContent className="RecentApptAdminLoading">
          <CircularProgress size={24} sx={{ color: '#184a5b' }} />
          <Typography variant="body2" sx={{ mt: 1, color: '#666' }}>
            Loading appointments...
          </Typography>
        </CardContent>
      </Card>
    );
  }

  return renderStatisticsCard();
};

export default RecentAppointmentsAdmin;