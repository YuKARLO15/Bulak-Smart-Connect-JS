import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Card, CardContent, Button, Divider, CircularProgress } from '@mui/material';
import { getRecentAppointments } from '../../UserBulakSmartConnect/AppointmentComponents/RecentAppointmentData';
import './RecentAppointmentsAdmin.css';

const RecentAppointmentsAdmin = () => {
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate loading delay to match your application's behavior
    const timer = setTimeout(() => {
      const fetchedAppointments = getRecentAppointments();
      setAppointments(fetchedAppointments);
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleViewDetails = (appointment) => {
    navigate(`/AppointmentDetails/${appointment.id}`, { state: { appointment } });
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


  return (
    <Card className="RecentAppointmentsAdminCard">
      <CardContent>
      
     

        {appointments.length === 0 ? (
          <Typography variant="body2" sx={{ color: '#666', py: 2, textAlign: 'center' }}>
            No recent appointments found.
          </Typography>
        ) : (
          appointments.map((appointment, index) => (
            <Box key={index} className="AppointmentItemAdmin">
              <div className="AppointmentContentAdmin">
                <Typography variant="body1" className="AppointmentTypeAdmin">
                  {appointment.type}
                </Typography>
                <Box className="AppointmentDateTimeAdmin">
                  <Typography variant="body2" className="AppointmentDateAdmin">
                    {appointment.date}
                  </Typography>
                  <Typography variant="body2" className="AppointmentTimeAdmin">
                    {appointment.time}
                  </Typography>
                </Box>
                <Typography variant="body2" className="AppointmentNameAdmin">
                  {appointment.firstName + ' ' + appointment.lastName || "Anonymous User"}
                </Typography>
              </div>
              <Button
                size="small"
                className="ViewDetailsButtonAdmin"
                onClick={() => handleViewDetails(appointment)}
              >
                View
              </Button>
              {index < appointments.length - 1 && <Divider className="AppointmentDividerAdmin" />}
            </Box>
          ))
        )}

        <Box display="flex" justifyContent="center" mt={1}>
          <Button
            size="small"
            onClick={() => navigate('/AppointmentsDashboard')}
            sx={{
              color: '#184a5b',
              fontSize: '0.8rem',
              textTransform: 'none',
              '&:hover': {
                backgroundColor: 'rgba(24, 74, 91, 0.04)'
              }
            }}
          >
            View All Appointments
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default RecentAppointmentsAdmin;