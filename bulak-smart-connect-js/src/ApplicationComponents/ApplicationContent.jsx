import React from 'react';
import { Box, Grid, Card, CardContent, Typography, Button } from '@mui/material';
import './ApplicationContent.css'; // Import your CSS file here

// Import images
import BirthCertificateIcon from './ApplicationAssets/BirthCertificate.png';
import MarriageCertificateIcon from './ApplicationAssets/MarriageCertificate.png';
import DeathCertificateIcon from './ApplicationAssets/DeathCertificate.png';
import CenomarIcon from './ApplicationAssets/CenomarIcon.png';

const ApplicationContent = () => {
  const certificates = [
    { title: 'Birth Certificate', icon: BirthCertificateIcon },
    { title: 'Marriage Certificate', icon: MarriageCertificateIcon },
    { title: 'Death Certificate', icon: DeathCertificateIcon },
    { title: 'Cenomar', icon: CenomarIcon },
  ];

    return (
    <div className="ApplicationContentContainer">
    <Box sx={{ padding: 3 }}>
      <Typography variant="h4" className='OnlineApplicationTitle' gutterBottom>
        ONLINE APPLICATION
      </Typography>
      <Grid container spacing={3}>
        {certificates.map((cert, index) => (
                <Grid item xs={12} sm={6} key={index}>
                <Card className="certificate-card">
              <CardContent>
               
                <Typography variant="h6" className="title">
                  <img src={cert.icon} alt={`${cert.title} Icon`} className="icon" /> {cert.title}
                </Typography>
                <ul className="details">
                  <li>Lorem ipsum dolor sit amet</li>
                  <li>Consectetur adipiscing elit</li>
                  <li>Pellentesque vitae leo in metus</li>
                  <li>Proin ipsum velit, placerat a</li>
                </ul>
                <div className="actions">
                  <Button variant="text" className="requirements-btn">
                    Requirements
                  </Button>
                  <Button variant="contained" className="request-btn">
                    Request Now
                  </Button>
                </div>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
            </Box>
            </div>
  );
};

export default ApplicationContent;
