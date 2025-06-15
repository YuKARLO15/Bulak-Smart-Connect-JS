import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Card, CardContent, Button, Grid, Paper, CircularProgress, Container } from '@mui/material';
import { appointmentService } from '../../services/appointmentService'; // Update with correct path
import './RecentAppointmentsAdmin.css';

const RecentAppointmentsAdmin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [statistics, setStatistics] = useState({
    todayTotal: 0,
    weekPending: 0,
    weekCompleted: 0,
    weekCanceled: 0
  });
  
  const [currentDateTime, setCurrentDateTime] = useState('2025-06-13 19:08:28'); // Set initial date from your system
  
  useEffect(() => {
    // Update current time
    const updateCurrentTime = () => {
      const now = new Date();
      
      // Format as YYYY-MM-DD HH:MM:SS
      const year = now.getUTCFullYear();
      const month = String(now.getUTCMonth() + 1).padStart(2, '0');
      const day = String(now.getUTCDate()).padStart(2, '0');
      const hours = String(now.getUTCHours()).padStart(2, '0');
      const minutes = String(now.getUTCMinutes()).padStart(2, '0');
      const seconds = String(now.getUTCSeconds()).padStart(2, '0');
      
      const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
      setCurrentDateTime(formattedDateTime);
    };
    
    // Update the time immediately
    updateCurrentTime();
    
    // Update the time every second
    const timeInterval = setInterval(updateCurrentTime, 1000);
    
    // Fetch appointment statistics from the API
    const fetchStatistics = async () => {
      try {
        // Use getAppointmentStats method to fetch formatted statistics
        const stats = await appointmentService.getAppointmentStats();
        console.log('Fetched appointment statistics:', stats);
        
        setStatistics({
          todayTotal: stats.todayTotal || 0,
          weekPending: stats.weekPending || 0,
          weekCompleted: stats.weekCompleted || 0,
          weekCanceled: stats.weekCanceled || 0
        });
        
        setLoading(false);
      } catch (error) {
        console.error('Error fetching appointment statistics:', error);
        // Fall back to 0 values if there's an error
        setStatistics({
          todayTotal: 0,
          weekPending: 0,
          weekCompleted: 0,
          weekCanceled: 0
        });
        setLoading(false);
      }
    };
    
    fetchStatistics();
    
    return () => {
      clearInterval(timeInterval);
    };
  }, []);

  // The rest of your component remains the same
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

  return (
    <Card className="RecentAppointmentsAdminCard">
      <CardContent>
        <Box mb={2} className="RecentApptAdminHeader">
          <Container className='RecentApptAdminHeaderContainer'>
          <Typography variant="h6" className="RecentApptAdminTitle">
            Weekly Appointment Statistics
          </Typography>
          <Typography variant="body2" sx={{ color: '#666', display: 'flex', justifyContent: 'space-between' }}>
            <span>{currentDateTime} (UTC)</span>
           
            </Typography>
            </Container>
            <Box display="flex" justifyContent="center" mt={3}>
          <Button
            size="small"
            className="ViewDetailsButtonAdmin"
            onClick={() => navigate('/AdminAppointmentDashboard')}
          >
            View All Appointments
          </Button>
        </Box>
        </Box>

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
                flexDirection: 'column'
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
                flexDirection: 'column'
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
                flexDirection: 'column'
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
                flexDirection: 'column'
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
      </CardContent>
    </Card>
  );
};

export default RecentAppointmentsAdmin;