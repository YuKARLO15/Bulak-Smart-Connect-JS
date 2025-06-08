import React from 'react';
import { Box, Grid, Card, CardContent, Typography, Button } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import './ApplicationContent.css';

import BirthCertificateIcon from './ApplicationAssets/BirthCertificate.png';
import MarriageCertificateIcon from './ApplicationAssets/MarriageCertificate.png';
import DeathCertificateIcon from './ApplicationAssets/DeathCertificate.png';

const ApplicationContent = () => {
  const certificates = [
    {
      title: 'Birth Certificate',
      icon: BirthCertificateIcon,
      route: '/BirthCertificateDashboard',
      details: ['Easily request an official copy of your birth certificate online.'],
      requirementsRoute: '/RequirementBirthList'
    },
    {
      title: 'Marriage Certificate',
      icon: MarriageCertificateIcon,
      route: '/MarriageDashboard',
      details: 'Apply for a certified copy of your marriage certificate quickly and conveniently.',
      requirementsRoute: '/RequirementMarriageList'
    }
  ];

  return (
    <>
      <div className="OnlineApplicationTitleContainer">
        <Typography variant="h4" className="OnlineApplicationTitle">
          ONLINE APPLICATION
        </Typography>
      </div>
      <div className="ApplicationContentContainer">
        <Box sx={{ padding: 2}}>
          <Grid container spacing={2}>
            {certificates.map((cert, index) => (
              <Grid item xs={15} sm={6} key={index}>
                <Card className="CertificateCard"> 
                  <CardContent>
                    <Typography variant="h5" className="CardTitle">
                      <img src={cert.icon} alt={`${cert.title} Icon`} className="Icon" />
                      {cert.title}
                    </Typography>
                    <ul className="Details">
                    <li className='ApplicationDescription' >{cert.details}</li>
                    </ul>
                    <div className="Actions">
                      <RouterLink to={cert.requirementsRoute}>
                        <Button variant="text" className="RequirementsBtn">
                          Requirements
                        </Button>
                      </RouterLink>
                      <RouterLink to={cert.route} style={{ textDecoration: 'none' }}>
                        <Button variant="contained" className="RequestBtn">
                          Request Now
                        </Button>
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
