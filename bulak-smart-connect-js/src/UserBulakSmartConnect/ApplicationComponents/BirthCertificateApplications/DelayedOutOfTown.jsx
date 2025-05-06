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
    if (isMandatoryComplete()) {
      try {
  
        const currentId = localStorage.getItem('currentApplicationId');
        if (!currentId) {
          console.error('No application ID found');
          return;
        }
        
 
        const applications = JSON.parse(localStorage.getItem('applications') || '[]');
        const applicationIndex = applications.findIndex(app => app.id === currentId);
        
        if (applicationIndex === -1) {
          console.error('Application not found:', currentId);
          return;
        }
        
      
        applications[applicationIndex] = {
          ...applications[applicationIndex],
          uploadedFiles: uploadedFiles,
          documentStatus: status,
          lastUpdated: new Date().toISOString()
        };
        
   
        const currentFormData = JSON.parse(localStorage.getItem('birthCertificateApplication') || '{}');
        const updatedFormData = {
          ...currentFormData,
          uploadedFiles: uploadedFiles,
          documentStatus: status
        };
        
  
        localStorage.setItem('applications', JSON.stringify(applications));
        localStorage.setItem('birthCertificateApplication', JSON.stringify(updatedFormData));
        

        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new CustomEvent('customStorageUpdate'));
        
 
        setIsSubmitted(true);
        setTimeout(() => {
          navigate('/BirthApplicationSummary');
        }, 2000);
      } catch (err) {
        console.error('Error saving uploaded documents:', err);
        alert('There was a problem saving your documents. Please try again.');
      }
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
