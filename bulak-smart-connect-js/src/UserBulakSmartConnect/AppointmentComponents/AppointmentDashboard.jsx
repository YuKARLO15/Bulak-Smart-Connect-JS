import React, { useState } from 'react';
import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './AppointmentDashboard.css';
import RecentAppointments from './RecentAppointment';
import AppointmentContainer from './AppointmentContent';

const AppointmentDashboard = () => {
  const [showAppointmentContent, setShowAppointmentContent] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);

  const handleBookAppointment = () => {
    setShowAppointmentContent(true);
  };

  const handleDateClick = date => {
    if (date.getDay() !== 0 && date.getDay() !== 6 && date >= new Date()) {
      setSelectedDate(date);
      setShowAppointmentContent(true);
    }
  };

  return (
    <Box className="AppointmentDashboardContainer">
      {showAppointmentContent ? (
        <AppointmentContainer
          onBack={() => setShowAppointmentContent(false)}
          preselectedDate={selectedDate}
        />
      ) : (
        <>
          <Box className="HeaderAppointment">
            <Box className="HeaderContentAppointment">
              <Typography variant="h4" className="TitleAppointment">
                SKIP LONG WAITING LINES
              </Typography>
              <Typography variant="h5" className="TitleAppointment">
                AND BOOK YOUR APPOINTMENT
              </Typography>
            </Box>
            <Button
              variant="contained"
              className="ButtonAppointment"
              onClick={handleBookAppointment}
            >
              BOOK APPOINTMENT
            </Button>
          </Box>

          <Box className="ContentAppointment">
            <RecentAppointments />
            <Box className="RightSectionAppointment">
              <Card className="AvailableSlotsAppointment">
                <CardContent>
                  <Typography variant="h6" className="SectionTitleAppointment">
                    AVAILABLE SLOTS
                  </Typography>
                  <Calendar
                    className="CalendarAppointment"
                    onChange={handleDateClick}
                    tileDisabled={({ date }) =>
                      date.getDay() === 0 || date.getDay() === 6 || date < new Date()
                    }
                  />
                  <Typography variant="body2" className="CalendarHelperText">
                    Click on a date to book an appointment
                  </Typography>
                </CardContent>
              </Card>

              {/* Announcement */}
              <Card className="AnnouncementAppointment">
                <CardContent>
                  <Typography variant="h6" className="SectionTitleAppointment">
                    ANNOUNCEMENT
                  </Typography>
                  <Typography variant="body1" className="AnnouncementTextAppointment">
                    Office is open 8:00 AM - 5:00 PM (Monday - Friday)
                  </Typography>
                </CardContent>
              </Card>
            </Box>
          </Box>
        </>
      )}
    </Box>
  );
};

export default AppointmentDashboard;
