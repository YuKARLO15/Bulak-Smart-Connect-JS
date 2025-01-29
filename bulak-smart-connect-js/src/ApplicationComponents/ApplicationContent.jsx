import React, { useEffect, useState } from 'react';
import { Box, Grid, Card, CardContent, Typography, Button, List, ListItem } from '@mui/material';
import { fetchApplications } from './RecentApplications'; // Import the mock fetch function
import './ApplicationContent.css';

// Import images
import BirthCertificateIcon from './ApplicationAssets/BirthCertificate.png';
import MarriageCertificateIcon from './ApplicationAssets/MarriageCertificate.png';
import DeathCertificateIcon from './ApplicationAssets/DeathCertificate.png';
import CenomarIcon from './ApplicationAssets/CenomarIcon.png';

const ApplicationContent = () => {
  const [applications, setApplications] = useState([]);
  const certificates = [
    { title: 'Birth Certificate', icon: BirthCertificateIcon },
    { title: 'Marriage Certificate', icon: MarriageCertificateIcon },
    { title: 'Death Certificate', icon: DeathCertificateIcon },
    { title: 'Cenomar', icon: CenomarIcon },
  ];

  // Use mock data
  useEffect(() => {
    const getApplications = async () => {
      const appList = await fetchApplications();  // Fetch mock data
      setApplications(appList);
    };

    getApplications(); // Call the async function to get data
  }, []);
  const StatusColor = (status) => {
    switch (status) {
      case "Approved":
        return "green";
      case "Pending":
        return "darkorange";
      case "Declined":
        return "red";
      default:
        return "#184a5b";
    }
  }

  return (
    <div className="ApplicationContentContainer">
      <Box sx={{ padding: 3 }}>
        <Typography variant="h4" className="OnlineApplicationTitle">
          ONLINE APPLICATION
        </Typography>
        <Grid container spacing={3}>
          {certificates.map((cert, index) => (
            <Grid item xs={12} sm={6} key={index}>
              <Card className="CertificateCard">
                <CardContent>
                  <Typography variant="h6" className="CardTitle">  <img src={cert.icon} alt={`${cert.title} Icon`} className="Icon" />
                    {cert.title}</Typography>
                  <ul className="Details">
                    <li>Lorem ipsum dolor sit amet</li>
                    <li>Consectetur adipiscing elit</li>
                    <li>Pellentesque vitae leo in metus</li>
                    <li>Proin ipsum velit, placerat a</li>
                  </ul>
                  <div className="Actions">
                    <Button variant="text" className="RequirementsBtn">Requirements</Button>
                    <Button variant="contained" className="RequestBtn">Request Now</Button>
                  </div>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
      <div className="RecentApplicationsDivider" />
      <Typography variant="h5" className="RecentApplicationsTitle">
        RECENT APPLICATIONS
      </Typography>
      <List>
        {applications.map((app, index) => (
          <ListItem key={index}>
            <Card className="ApplicationCard">
              <CardContent>
                <Grid container justifyContent="space-between" alignItems="center">
                  <Typography className="ApplicationCardTitle">{app.type}</Typography>
                  <Typography
                    className="ApplicationStatus"
                    sx={{ color:StatusColor(app.status) }} >
                    {app.status}  </Typography>

                  <Typography className="ApplicationDate">{app.date}</Typography>
                  <Typography className="ApplicationDescription">{app.message}</Typography>
                </Grid>
                <Button size="small">See More</Button>
              </CardContent>
            </Card>
          </ListItem>
        ))}
      </List>
    </div>
  );
};

export default ApplicationContent;
