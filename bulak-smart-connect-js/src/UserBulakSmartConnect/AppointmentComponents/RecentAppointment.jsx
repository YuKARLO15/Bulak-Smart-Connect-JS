import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Card, CardContent, Button, CircularProgress } from '@mui/material';
import { getRecentAppointments, saveRecentAppointments } from './RecentAppointmentData'; 
import { appointmentService } from '../../services/appointmentService'; 
import './RecentAppointment.css';

const RecentAppointments = () => {
  const navigate = useNavigate();
  const [appointmentsData, setAppointmentsData] = useState(getRecentAppointments()); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch appointments from backend
  useEffect(() => {
    const fetchRealAppointments = async () => {
      const token = localStorage.getItem('token');
      
      // Only try to fetch from backend if user is authenticated
      if (!token) {
        console.log('No token found, using local storage data only');
        return;
      }

      try {
        setLoading(true);
        console.log('Fetching real appointments from backend...');
        
        // Fetch real appointments from backend
        const realAppointments = await appointmentService.fetchUserAppointments();
        
        console.log('Real appointments fetched:', realAppointments);

        // Transform real backend data to match existing structure
        const transformedAppointments = realAppointments.map(appointment => ({
          id: appointment.appointmentNumber || appointment.id, 
          appointmentNumber: appointment.appointmentNumber, 
          type: appointment.reasonOfVisit,
          date: appointment.appointmentDate,
          time: appointment.appointmentTime,
          firstName: appointment.firstName,
          lastName: appointment.lastName,
          middleInitial: appointment.middleInitial,
          address: appointment.address,
          phoneNumber: appointment.phoneNumber,
          reasonOfVisit: appointment.reasonOfVisit,
          appointmentDate: appointment.appointmentDate,
          appointmentTime: appointment.appointmentTime,
          status: appointment.status, 
          // Real backend metadata
          dbId: appointment.id,
          createdAt: appointment.createdAt,
          updatedAt: appointment.updatedAt
        }));

        // Update state with real data
        setAppointmentsData(transformedAppointments);
        
        // Also update local storage with real data for offline access
        transformedAppointments.forEach(appointment => {
          const existingAppointments = getRecentAppointments();
          // Only add if not already in local storage
          const exists = existingAppointments.find(local => 
            local.appointmentNumber === appointment.appointmentNumber || 
            local.dbId === appointment.dbId
          );
          if (!exists) {
            saveRecentAppointments(appointment);
          }
        });
        
      } catch (error) {
        console.error('Failed to fetch real appointments from backend:', error);
        setError('Could not load latest appointments from server. Showing local data.');
        // Keep using local storage data if backend fails
      } finally {
        setLoading(false);
      }
    };

    fetchRealAppointments();
  }, []);

  const handleSeeMore = appointment => {
    console.log('Navigating to QRCodeAppointment with real appointment:', appointment);
    
 
    const appointmentId = appointment.appointmentNumber || appointment.id;
    
    navigate(`/QRCodeAppointment/${appointmentId}`, { 
      state: { 
          source: 'appointmentDashboard',
        appointment: {
        
          id: appointmentId,
          appointmentNumber: appointment.appointmentNumber,
          type: appointment.reasonOfVisit || appointment.type,
          date: appointment.appointmentDate || appointment.date,
          time: appointment.appointmentTime || appointment.time,
          firstName: appointment.firstName,
          lastName: appointment.lastName,
          middleInitial: appointment.middleInitial || '',
          address: appointment.address,
          phoneNumber: appointment.phoneNumber,
          reasonOfVisit: appointment.reasonOfVisit || appointment.type,
          appointmentDate: appointment.appointmentDate || appointment.date,
          appointmentTime: appointment.appointmentTime || appointment.time,
          status: appointment.status, // Pass real status
          // Include real backend data
          dbId: appointment.dbId,
          createdAt: appointment.createdAt,
          updatedAt: appointment.updatedAt
        } 
        
      }
    });
  };

  if (loading) {
    return (
      <Card className="RecentAppointmentsAppointment">
        <CardContent>
          <Typography variant="h6" className="SectionTitleAppointment">
            RECENT APPOINTMENTS
          </Typography>
          <Box display="flex" justifyContent="center" alignItems="center" p={2}>
            <CircularProgress size={24} />
            <Typography variant="body2" style={{ marginLeft: '10px' }}>
              Loading real appointments...
            </Typography>
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="RecentAppointmentsAppointment">
      <CardContent>
        <Typography variant="h6" className="SectionTitleAppointment">
          RECENT APPOINTMENTS
        </Typography>
        {error && (
          <Box p={1} mb={1}>
            <Typography variant="body2" color="error" style={{ fontSize: '0.8rem' }}>
              {error}
            </Typography>
          </Box>
        )}
        {appointmentsData.length === 0 ? (
          <Box p={2} textAlign="center">
            <Typography variant="body2" color="textSecondary">
              No appointments found.
            </Typography>
          </Box>
        ) : (
          appointmentsData.map((appointment, index) => (
            <Box key={appointment.appointmentNumber || appointment.id || index} className="AppointmentItemAppointment">
              <div className="AppointmentDivider">
                <Typography variant="body1" className="AppointmentTypeAppointment">
                  {appointment.reasonOfVisit || appointment.type}
                </Typography>
                <Typography variant="body2" className="AppointmentDateAppointment">
                  {appointment.appointmentDate || appointment.date}
                </Typography>
                <Typography variant="body2" className="AppointmentTimeAppointment">
                  {appointment.appointmentTime || appointment.time}
                </Typography>
                {appointment.status && (
                  <Typography variant="body2" className="AppointmentStatusAppointment">
                    Status: <span style={{ 
                      color: appointment.status === 'confirmed' ? 'green' : 
                            appointment.status === 'cancelled' ? 'red' : 'orange' 
                    }}>
                      {appointment.status.toUpperCase()}
                    </span>
                  </Typography>
                )}
              </div>
              <Button
                size="small"
                className="SeeMoreAppointment"
                onClick={() => handleSeeMore(appointment)}
              >
                See More
              </Button>
            </Box>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default RecentAppointments;
