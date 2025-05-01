import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Typography, Alert } from '@mui/material';
import FileUpload from '../FileUpload';
import NavBar from '../../../NavigationComponents/NavSide';
import './DelayedOneParentForeigner.css';

const requiredDocuments = [
  'Negative Certification from PSA',
  'Affidavit of two (2) disinterested persons (with ID) / Affidavit of Out of Town Registration',
  'Barangay Certification issued by the Punong Barangay as proof of residency and with statement on facts of birth',
  'National ID (if not registered, register first)',
  'Unedited 2x2 front-facing photo taken within 3 months, white background:',
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
];

const additionalDocuments = [
  'Certificate of Marriage of Parents (Marital Child)',
  'Birth Certificate of Parent/s',
  'Valid Passport or BI Clearance or ACR I-CARD of the Foreign Parent',
];

const DelayedOneParentForeignerRegistration = () => {
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
    <div className={`DelayedOneParentForeignerContainer ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <NavBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      <Typography variant="h5" className="TitleDelayedOneParentForeigner">
        Delayed Registration of Birth (One Parent is a Foreigner)
      </Typography>

      <Typography variant="body1" className="SectionTitleDelayedOneParentForeigner">
        Mandatory Requirements:
      </Typography>
      <Box>
        {requiredDocuments.map((doc, index) => (
          <FileUpload key={index} label={doc} onUpload={handleFileUpload} />
        ))}
      </Box>

      <Typography variant="body1" className="SectionTitleForeigner">
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

      <Typography variant="body1" className="SectionTitleForeigner">
        Any two (2) of the following documentary evidence which may show the name of the child, date
        and palce of birth, and name of the mother (and anme of father, if the child has been
        acknowledge)
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

      <Box>
        {additionalDocuments.map((doc, index) => (
          <FileUpload key={index} label={doc} onUpload={handleFileUpload} />
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

export default DelayedOneParentForeignerRegistration;
