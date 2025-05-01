import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Router, Link as RouterLink } from 'react-router-dom';
import { Box, Button, Typography, Alert } from '@mui/material';
import FileUpload from '../FileUpload';
import './DelayedOutOfTown.css';
import NavBar from '../../../NavigationComponents/NavSide';

const requiredDocuments = [
  'Negative Certification from PSA',
  'Self-Affidavit of Out of Town Registration attested by 2 witnesses with ID',
  'Barangay Certification issued by the Punong Barangay as proof of residency and with statement on facts of birth',
  'National ID (if not registered, register first)',
  'Unedited 2x2 front-facing photo (2 pcs) taken within 3 months, white background',
  'Transmittal through the PSO',
];

const parentDocuments = [
  'Certificate of Live Birth (COLB)',
  'Government Issued ID',
  'Marriage Certificate',
  'Certificate of Death (if deceased)',
];

const documentaryEvidence = [
  'Baptismal Certificate',
  'Marriage Certificate',
  'School Records',
  'Income Tax Return',
  'PhilHealth MDR',
  "Voter's Registration Record (COMELEC)",
];

const DelayedOutOfTownRegistration = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleFileUpload = (label, isUploaded) => {
    setUploadedFiles(prevState => ({
      ...prevState,
      [label]: isUploaded,
    }));
  };

  const isMandatoryComplete = requiredDocuments.every(doc => uploadedFiles[doc]);

  const handleSubmit = () => {
    if (isMandatoryComplete) {
      setIsSubmitted(true);
      setTimeout(() => {
        navigate('/BirthApplicationSummary');
      }, 2000);
    }
  };

  return (
    <div className={`DelayedOutOfTownContainer ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <NavBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      <Typography variant="h5" className="TitleDelayedOutOfTown">
        Delayed Registration of Birth (Out of Town)
      </Typography>

      <Typography variant="body1" className="SectionTitleDelayedOutOfTown">
        Mandatory Requirements:
      </Typography>

      <Typography variant="body1" className="PersonalAppearance">
        Personal Appearance of the Document Owner
      </Typography>

      <Box>
        {requiredDocuments.map((doc, index) => (
          <FileUpload key={index} label={doc} onUpload={handleFileUpload} />
        ))}
      </Box>

      <Typography variant="body1" className="SectionTitleDelayedOutOfTown">
        Any two (2) of the following documents of parents:
      </Typography>

      <Box>
        {[...Array(2)].map((_, index) => (
          <FileUpload
            key={index}
            label={`Parent Document ${index + 1}`}
            onUpload={handleFileUpload}
          />
        ))}
      </Box>

      <Typography variant="body1" className="SectionTitleDelayedOutOfTown">
        Any two (2) of the following documentary evidence:
      </Typography>

      <Box>
        {[...Array(2)].map((_, index) => (
          <FileUpload
            key={index}
            label={`Documentary Evidence ${index + 1}`}
            onUpload={handleFileUpload}
          />
        ))}
      </Box>

      {isSubmitted && (
        <Alert severity="success" sx={{ marginTop: '20px' }}>
          Your application has been submitted successfully! Redirecting...
        </Alert>
      )}

      <Button
        variant="contained"
        color="primary"
        disabled={!isMandatoryComplete}
        sx={{ marginTop: '20px' }}
        onClick={handleSubmit}
        className="ButtonApplication"
      >
        Submit
      </Button>
    </div>
  );
};

export default DelayedOutOfTownRegistration;
