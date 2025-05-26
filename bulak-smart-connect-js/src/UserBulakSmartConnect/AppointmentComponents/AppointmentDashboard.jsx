import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './AppointmentDashboard.css';
import RecentAppointments from './RecentAppointment';
import AppointmentContainer from './AppointmentContent';
import { announcementService } from '../../services/announcementService';

const AppointmentDashboard = () => {
  const [showAppointmentContent, setShowAppointmentContent] = useState(false);
  const [selectedDate, setSelectedDate] = useState(null);
  const [announcements, setAnnouncements] = useState([]);
  const [announcementLoading, setAnnouncementLoading] = useState(true);

  const handleBookAppointment = () => {
    setShowAppointmentContent(true);
  };

  const handleDateClick = date => {
    if (date.getDay() !== 0 && date.getDay() !== 6 && date >= new Date()) {
      setSelectedDate(date);
      setShowAppointmentContent(true);
    }
  };

  useEffect(() => {
    loadAnnouncements();
  }, []);

  const loadAnnouncements = async () => {
    try {
      const data = await announcementService.getRecentAnnouncements(2);
      setAnnouncements(data);
    } catch (error) {
      console.error('Failed to load announcements:', error);
    } finally {
      setAnnouncementLoading(false);
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
                  <Typography variant="h6" className='SectionTitleAppointment'>ANNOUNCEMENT</Typography>
                  {announcementLoading ? (
                    <Typography variant="body1" className='AnnouncementTextAppointment'>Loading...</Typography>
                  ) : announcements.length > 0 ? (
                    announcements.map((announcement) => (
                      <div key={announcement.id} style={{ marginBottom: '10px', padding: '10px', borderBottom: '1px solid #eee' }}>
                        <Typography variant="subtitle2" style={{ fontWeight: 'bold' }} className='AnnouncementTextAppointment'>
                          {announcement.title}
                        </Typography>
                        <Typography variant="body2" style={{ marginTop: '5px' }} className='AnnouncementTextAppointment'>
                          {announcement.description}
                        </Typography>
                      </div>
                    ))
                  ) : (
                    <Typography variant="body2" style={{ color: '#666', fontStyle: 'italic' }}>
                      No announcements available
                    </Typography>
                  )}
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
