import React, { useState, useEffect } from 'react';
import logger from '../../utils/logger';
import { Box, Typography, Button, Card, CardContent } from '@mui/material';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './AppointmentDashboard.css';
import RecentAppointments from './RecentAppointment';
import AppointmentContainer from './AppointmentContent';
import { announcementService } from '../../services/announcementService';
import { useNavigate } from 'react-router-dom';

const AppointmentDashboard = () => {
  const navigate = useNavigate();
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
      logger.error('Failed to load announcements:', error);
    } finally {
      setAnnouncementLoading(false);
    }
  };

  const handleRequirementClick = type => {
    if (type === 'birth') {
      navigate('/RequirementBirthList');
    } else if (type === 'marriage') {
      navigate('/RequirementMarriageList');
    } else if (type === 'death') {
      navigate('/RequirementDeathCertificateList');
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
          <Box className="ContentAppointment">
            <Box className="LeftSectionAppointment">
              <Box className="HeaderAppointment">
                <Box className="HeaderContentAppointment">
                  <Typography variant="h4" className="TitleAppointment">
                    SKIP LONG WAITING LINES
                  </Typography>
                </Box>

                <Button
                  variant="contained"
                  className="ButtonAppointment"
                  onClick={handleBookAppointment}
                >
                  BOOK AN APPOINTMENT !
                </Button>
              </Box>
              <Box className="RecentAppointmentsDesktop">
                <RecentAppointments />
              </Box>
            </Box>

            <Box className="RightSectionContentAppointment">
              <Card className="ContentAppointmentrequirements">
                <Typography variant="h6" className="SectionTitleAppointmentRequirements">
                  Documents Requirements
                </Typography>
                <Typography variant="body2" className="SectionDescriptionAppointment">
                  <strong>Important! </strong> Please review and prepare all required documents
                  before scheduling your appointment.
                </Typography>

                <Box className="RequirementsList">
                  <Typography
                    variant="body2"
                    className="RequirementItem"
                    onClick={() => handleRequirementClick('birth')}
                    style={{ cursor: 'pointer' }}
                  >
                    View Birth Certificate Requirements
                  </Typography>
                  <Typography
                    variant="body2"
                    className="RequirementItem"
                    onClick={() => handleRequirementClick('marriage')}
                    style={{ cursor: 'pointer' }}
                  >
                    View Marriage License Requirements
                  </Typography>
                  <Typography
                    variant="body2"
                    className="RequirementItem"
                    onClick={() => handleRequirementClick('death')}
                    style={{ cursor: 'pointer' }}
                  >
                    View Death Certificate Requirements
                  </Typography>
                </Box>
              </Card>

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
            </Box>
          </Box>

          <Box className="RecentAppointmentsMobile">
            <RecentAppointments />
          </Box>

   
        </>
      )}
    </Box>
  );
};

export default AppointmentDashboard;
