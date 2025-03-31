import React from "react";
import {
  Box,
  Button,
  Container,
  Grid,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import "./LandingPage.css";
import { Link } from "react-router-dom"; 
import Footer from "../footer";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import DescriptionIcon from "@mui/icons-material/Description";
import QrCodeScannerIcon from "@mui/icons-material/QrCodeScanner";
import DirectionsWalkOutlinedIcon from "@mui/icons-material/DirectionsWalkOutlined";
import NavBar from "../LogInComponents/NavBar";
import DeviceMockUp from "./LandingPageAssets/DeviceMockUp.png";
import BulakLGULogo from "./LandingPageAssets/BulakLGULogo.png";
import PhTimeComponent from "./PhTimeComponent";

const LandingPage = () => {
  return (
    <Box className="LandingContainer">
      <NavBar />
      <div className="PhTimeComponent">
        <PhTimeComponent />{" "}
      </div>
      <Container className="">
        <Box className="HeroLanding">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={6}>
              <Box className="HeroContentLanding">
                <Typography variant="h3" className="HeroTitleLanding">
                  Fast Queues, Simple Transactions, Better Service
                </Typography>
                <Typography variant="body1" className="HeroDescriptionLanding">
                  <strong className="LandingTitle">
                    {" "}
                    Bulak LGU Smart Connect
                  </strong>{" "}
                  for the civil registrar office of San Ildefonso Bulacan,
                  offers fast queuing, simplified transactions, and improved
                  government services by allowing residents to manage their
                  queues and applications online, enhancing service efficiency
                  and convenience.
                </Typography>
                <Button
                  variant="contained"
                  color="primary"
                  className="SignUpButtonLanding"
                >
                  SIGN UP
                </Button>
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box className="HeroImageLanding">
                <img
                  src={DeviceMockUp}
                  alt="Device Mockups"
                  className="DeviceMockupsLanding"
                />
              </Box>
            </Grid>
          </Grid>
        </Box>

        <Box className="AboutSectionLanding">
          <Grid container spacing={4} alignItems="center">
            <Grid item xs={12} md={3}>
              <Box className="AboutIconLanding">
                <img src={BulakLGULogo} alt="Smart Connect Icon" />
              </Box>
            </Grid>
            <Grid item xs={12} md={9}>
              <Card className="AboutCardLanding">
                <CardContent>
                  <Typography variant="h5" className="AboutTitleLanding">
                    ABOUT US:
                  </Typography>
                  <Typography
                    variant="body1"
                    className="AboutDescriptionLanding"
                  >
                    Skip the long lines and handle your municipal transactions
                    with ease! Bulak LGU Smart Connect is the official queuing
                    and information system of the Municipal Civil Registrar of
                    San Ildefonso, Bulacan. Secure your queue number online,
                    track real-time queue number, schedule appointments, and
                    submit documents for birth, marriage, and death certificates
                    all from your phone or computer. Get real-time updates and
                    enjoy a hassle-free, efficient government service. Your time
                    matters make every visit smooth and stress-free!
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>

        <Box className="KeyFeaturesSectionLanding">
          <Typography variant="h5" className="KeyFeaturesTitleLanding">
            KEY FEATURES
          </Typography>
         <Link    to="/LogIn" >
          <Box className="FeatureItemLanding">
         
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={3}>
                <Box className="FeatureIconContainerLanding">
                  <CalendarTodayIcon className="FeatureIconLanding" />
                </Box>
              </Grid>
              <Grid item xs={12} md={9}>
                <Box className="FeatureContentLanding">
                  <Typography variant="h6" className="FeatureTitleLanding">
                    BOOK AN APPOINTMENT
                  </Typography>
                  <Typography
                    variant="body1"
                    className="FeatureDescriptionLanding"
                  >
                    Book a slot online for birth, marriage, and death
                    certificate applications, eliminating the need for long
                    waits.
                  </Typography>
                </Box>
              </Grid>
              </Grid>
            
            </Box>
          </Link>

          <Link    to="/LogIn" >
          <Box className="FeatureItemLanding">
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={9}>
                <Box className="FeatureContentLanding">
                  <Typography variant="h6" className="FeatureTitleLanding">
                    DOCUMENT APPLICATION
                  </Typography>
                  <Typography
                    variant="body1"
                    className="FeatureDescriptionLanding"
                  >
                    Apply for important documents with ease through Bulak LGU
                    Smart Connect! Submit your birth, marriage, or death
                    certificate application online, upload the required
                    documents, and track your request in real time. Get notified
                    once your application is processed and ready for pickup no
                    more unnecessary visits or long waits. Convenient,
                    efficient, and hassle-free!
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box className="FeatureIconContainerLanding">
                  <DescriptionIcon className="FeatureIconLanding" />
                </Box>
              </Grid>
            </Grid>
          </Box>
          </Link>
          <Link    to="/LogIn" >
          <Box className="FeatureItemLanding">
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={3}>
                <Box className="FeatureIconContainerLanding">
                  <QrCodeScannerIcon className="FeatureIconLanding" />
                </Box>
              </Grid>
              <Grid item xs={12} md={9}>
                <Box className="FeatureContentLanding">
                  <Typography variant="h6" className="FeatureTitleLanding">
                    QR SCANNING
                  </Typography>
                  <Typography
                    variant="body1"
                    className="FeatureDescriptionLanding"
                  >
                    Fast-track your transaction with QR scanning! Municipal
                    staff will scan your QR code to quickly retrieve your queue
                    number, appointment details, or document application status.
                    This ensures faster processing, reduces wait times, and
                    provides a smooth and efficient experience at the Municipal
                    Civil Registrar of San Ildefonso Bulacan
                  </Typography>
                </Box>
              </Grid>
            </Grid>
            </Box>
            </Link>
            <Link    to="/LogIn" >
          <Box className="FeatureItemLanding">
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} md={9}>
                <Box className="FeatureContentLanding">
                  <Typography variant="h6" className="FeatureTitleLanding">
                    SMART WALK-IN QUEUE
                  </Typography>
                  <Typography
                    variant="body1"
                    className="FeatureDescriptionLanding"
                  >
                    The Smart Walk-In feature of Bulak LGU Smart Connect
                    provides you real-time updates on the queue status, allowing
                    you to see how many numbers are ahead of you. This ensures
                    transparency, reduces waiting uncertainty, For you to manage
                    your time efficiently while waiting for their turn.
                  </Typography>
                </Box>
              </Grid>
              <Grid item xs={12} md={3}>
                <Box className="FeatureIconContainerLanding">
                  <DirectionsWalkOutlinedIcon className="FeatureIconLanding" />
                </Box>
              </Grid>
            </Grid>
            </Box>
          </Link>
        </Box>
      </Container>
      <Footer />
    </Box>
  );
};

export default LandingPage;