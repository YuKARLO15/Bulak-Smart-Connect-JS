import React, { useState, useEffect } from 'react';
import { Box, Button, Container, Grid, Typography, Card, CardContent } from '@mui/material';
import { styled } from '@mui/material/styles';
import './LandingPage.css';
import { Link } from 'react-router-dom';
import Footer from '../footer';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import DescriptionIcon from '@mui/icons-material/Description';
import QrCodeScannerIcon from '@mui/icons-material/QrCodeScanner';
import DirectionsWalkOutlinedIcon from '@mui/icons-material/DirectionsWalkOutlined';
import NavBar from '../NavigationComponents/NavBar';
import DeviceMockUp from './LandingPageAssets/DeviceMockUp.png';
import BulakLGULogo from './LandingPageAssets/BulakLGULogo.png';
import HeroBg from './LandingPageAssets/HeroBg.JPEG';
import PhTimeComponent from './PhTimeComponent';
import { useAuth } from '../context/AuthContext';
import { announcementService } from '../services/announcementService';
import FloatingAnnouncementButton from './FloatingAnnouncement';

const LandingPage = () => {
  const { isAuthenticated } = useAuth();
  
  const [announcements, setAnnouncements] = useState([]);
  const [announcementLoading, setAnnouncementLoading] = useState(true);
  const [announcementError, setAnnouncementError] = useState(null);

  useEffect(() => {
    loadRecentAnnouncements();
  }, []);

  const loadRecentAnnouncements = async () => {
    try {
      setAnnouncementLoading(true);
      const data = await announcementService.getRecentAnnouncements(3);
      setAnnouncements(data);
      setAnnouncementError(null);
    } catch (error) {
      console.error('Failed to load announcements:', error);
      setAnnouncementError('Failed to load announcements');
      // Keep empty array as fallback
      setAnnouncements([]);
    } finally {
      setAnnouncementLoading(false);
    }
  };

  
  return (
    <Box className="LandingContainer"
   >
    <Box className=" NavbarLanding">
        <NavBar />
        </Box>

      
      <div className="PhTimeComponent">
 
        <PhTimeComponent />{' '}

        
      </div>
      <Container className="">
<Box className="HeroLanding">
  <Grid container spacing={4} alignItems="center">
    <Grid item xs={12} md={7}>
      <Box className="HeroContentLanding">
        <Typography variant="h3" className="HeroTitleLanding">
          Fast Queues, Simple Transactions, Better Service
        </Typography>
        <Typography variant="body1" className="HeroDescriptionLanding">
          <strong className="LandingTitle"> Bulak LGU Smart Connect</strong> for the civil
          registrar office of San Ildefonso Bulacan, offers fast queuing, simplified
          transactions, and improved government services by allowing residents to manage
          their queues and applications online, enhancing service efficiency and
          convenience.
        </Typography>
        <Link to={isAuthenticated ? '/Home' : '/SignUpForm'}>
          <Button variant="contained" color="primary" className="SignUpButtonLanding">
            {isAuthenticated ? 'DASHBOARD' : 'SIGN UP'}
          </Button>
        </Link>
      </Box>
    </Grid>

  </Grid>
</Box>

          {/* Key Features */}
        <Box className="KeyFeaturesSectionLanding" sx={{ mt: 10, mb: 8 }}>
          <Typography
            variant="h4"
            className="KeyFeaturesTitleLanding"
            sx={{ textAlign: 'center', fontWeight: 600, fontFamily: 'Roboto, Arial, sans-serif' }}
            component="h2"
          >
            Services
          </Typography>

          {/* Feature Cards */}
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Link to={isAuthenticated ? '/AppointmentForm' : '/LogIn'} style={{ textDecoration: 'none' }}>
                <Card className="FeatureItemLanding" sx={{ minHeight: 240, boxShadow: 3 }}>
                  <CardContent>
                    <Box display="flex" alignItems="center">
                      <CalendarTodayIcon className="FeatureIconLanding" sx={{ fontSize: 50, mr: 2 }} />
                      <Box>
                        <Typography variant="h6" className="FeatureTitleLanding" sx={{ fontWeight: 600 }}>
                          Book an Appointment
                        </Typography>
                        <Typography variant="body2" className="FeatureDescriptionLanding">
                          Schedule a slot online for birth, marriage, and death certificate applications. No more long waits!
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Link>
            </Grid>

            <Grid item xs={12} md={4}>
              <Link to={isAuthenticated ? '/ApplicationForm' : '/LogIn'} style={{ textDecoration: 'none' }}>
                <Card className="FeatureItemLanding" sx={{ minHeight: 240, boxShadow: 3 }}>
                  <CardContent>
                    <Box display="flex" alignItems="center">
                      <DescriptionIcon className="FeatureIconLanding" sx={{ fontSize: 50, mr: 2 }} />
                      <Box>
                        <Typography variant="h6" className="FeatureTitleLanding" sx={{ fontWeight: 600 }}>
                          Document Application
                        </Typography>
                        <Typography variant="body2" className="FeatureDescriptionLanding">
                          Apply for certificates online, upload documents, and track application status in real time.
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Link>
            </Grid>

            <Grid item xs={12} md={4}>
              <Link to={isAuthenticated ? '/WalkInForm' : '/LogIn'} style={{ textDecoration: 'none' }}>
                <Card className="FeatureItemLanding" sx={{ minHeight: 240, boxShadow: 3 }}>
                  <CardContent>
                    <Box display="flex" alignItems="center">
                      <DirectionsWalkOutlinedIcon className="FeatureIconLanding" sx={{ fontSize: 50, mr: 2 }} />
                      <Box>
                        <Typography variant="h6" className="FeatureTitleLanding" sx={{ fontWeight: 600 }}>
                          Smart Walk-In Queue
                        </Typography>
                        <Typography variant="body2" className="FeatureDescriptionLanding">
                          Get real-time queue updates and manage your time efficiently while waiting.
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          </Grid>
        </Box>

<Box className="AboutSectionLanding" sx={{ py: 8 }}>
  <Grid container spacing={4} alignItems="center" justifyContent="center">
    <Grid item xs={12} md={3} sx={{ textAlign: { xs: 'center', md: 'right' } }}>
      <img
        src={BulakLGULogo}
        alt="Municipal Civil Registrar Logo"
        className="AboutIconLanding"
      style={{ maxWidth: '100%', height: 'auto'  }}
      />
    </Grid>

    <Grid item xs={12} md={9}>
      <Card className="AboutCardLanding" sx={{
        backgroundColor: '#1c4d5a',
        color: 'white',
        borderRadius: 2,
        px: 4,
        py: 3,
        boxShadow: 2,
        maxWidth: 700
      }}>
        <CardContent>
          <Typography variant="h4" className="AboutTitleLanding" sx={{ fontWeight: 700, mb: 2 }}>
            About Us
          </Typography>
          <Typography variant="body1" className="AboutDescriptionLanding" sx={{ lineHeight: 1.7 }}>
            <b>Bulak LGU Smart Connect</b> is the official digital queue and information system for the Municipal Civil Registrar of San Ildefonso, Bulacan.
            <br /><br />
            Our mission is to provide fast, organized, and transparent public service. Residents can <b>secure queue numbers</b>, <b>track applications in real-time</b>, and <b>submit documents</b> online for birth, marriage, or death certificates, all from their computer or mobile device.
            <br /><br />
            <span style={{ color: "#d5dcdd", fontWeight: 500 }}>Enjoy efficient, hassle-free government service. Your time matters, make every visit smooth and stress-free!</span>
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  </Grid>
</Box>
        <Box className="AnnouncementButtonContainer">
          <FloatingAnnouncementButton />
          </Box>
      </Container>
      <Footer />
    </Box>
  );
};

export default LandingPage;
