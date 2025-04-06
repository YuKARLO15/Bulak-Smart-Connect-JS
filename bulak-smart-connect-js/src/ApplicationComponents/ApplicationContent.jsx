import React from 'react';
import { Box, Grid, Card, CardContent, Typography, Button } from '@mui/material';
import { Link as RouterLink } from "react-router-dom";
import './ApplicationContent.css';


import BirthCertificateIcon from './ApplicationAssets/BirthCertificate.png';
import MarriageCertificateIcon from './ApplicationAssets/MarriageCertificate.png';
import DeathCertificateIcon from './ApplicationAssets/DeathCertificate.png';

const ApplicationContent = () => {
  
  const certificates = [
    { title: 'Birth Certificate', icon: BirthCertificateIcon, route: '/BirthCertificateDashboard' },
    { title: 'Marriage Certificate', icon: MarriageCertificateIcon, route: '/MarriageCertificateForm' },
    { title: 'Death Certificate', icon: DeathCertificateIcon, route: '/DeathDashboard' },
  ];

  return (
    <>
      <div className='OnlineApplicationTitleContainer'>
        <Typography variant="h4" className="OnlineApplicationTitle">
          ONLINE APPLICATION
        </Typography>
      </div>
      <div className="ApplicationContentContainer">
        <Box sx={{ padding: 1 }}>
          <Grid container spacing={3}>
            {certificates.map((cert, index) => (
              <Grid item xs={10} sm={4} key={index}>
                <Card className="CertificateCard">
                  <CardContent>
                    <Typography variant="h5" className="CardTitle">
                      <img src={cert.icon} alt={`${cert.title} Icon`} className="Icon" />
                      {cert.title}
                    </Typography>
                    <ul className="Details">
                      <li>Lorem ipsum dolor sit amet</li>
                      <li>Consectetur adipiscing elit</li>
                      <li>Pellentesque vitae leo</li>
                      <li>Proin ipsum velit, placerat a</li>
                    </ul>
                    <div className="Actions">
                      <Button variant="text" className="RequirementsBtn">Requirements</Button>
                      <RouterLink to={cert.route} style={{ textDecoration: 'none' }}>
                        <Button variant="contained" className="RequestBtn">Request Now</Button>
                      </RouterLink>
                    </div>
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        </Box>
      </div>
    </>
  );
};

export default ApplicationContent;
