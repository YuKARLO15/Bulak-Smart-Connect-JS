import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Checkbox, FormControlLabel, Typography, Alert } from '@mui/material';
import FileUpload from '../FileUpload';
import './DelayedAbove18.css';
import NavBar from '../../../NavigationComponents/NavSide';

const maritalDocuments = [
  'Negative Certification from PSA',
  'Affidavit of (2) Disinterested Persons with ID',
  'Certificate of Marriage, if married',
  'National ID or ePhil ID',
  'Barangay Certification of Residency',
  'Unedited front-facing photo 2x2, white background',
  'Documentary evidences of parents',
  'Certificate of Marriage of Parents',
  'Personal Appearance of Father or Affidavit of the document owner registrant stating why the document owner cannot appear personally; and death certificate in case the document owner is deceased',
];

const nonMaritalDocuments = maritalDocuments
  .filter(doc => doc !== 'Certificate of Marriage of Parents')
  .concat([
    'Personal Appearance of the Father or Affidavit of Admission of Paternity executed before a Notary Public',
  ]);

const Above18Registration = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [status, setStatus] = useState('');
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleFileUpload = (label, isUploaded) => {
    setUploadedFiles(prevState => ({
      ...prevState,
      [label]: isUploaded,
    }));
  };

  const isMandatoryComplete = () => {
    if (!status) return false;

    // Check all required documents based on status
    const requiredDocs = status === 'marital' ? maritalDocuments : nonMaritalDocuments;
    const allRequiredDocsUploaded = requiredDocs.every(doc => uploadedFiles[doc]);

    // Check documentary evidences
    const evidence1Uploaded = uploadedFiles['Documentary Evidence 1'];
    const evidence2Uploaded = uploadedFiles['Documentary Evidence 2'];

    return allRequiredDocsUploaded && evidence1Uploaded && evidence2Uploaded;
  };

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
    <div className={`DelayedAbove18Container ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <NavBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <Typography variant="h5" className="TitleDelayedAbove18">
        BIRTH CERTIFICATE APPLICATION
      </Typography>
      <Typography className="SubtitleDelayedAbove18">
        Application for Delayed Registration Above 18
      </Typography>

      <Typography className="SubtitleDelayedAbove18">Select One / Pumili ng Isa</Typography>
      <Box>
        <FormControlLabel
          control={
            <Checkbox checked={status === 'marital'} onChange={() => setStatus('marital')} />
          }
          label="Marital Child"
          className="CheckboxDelayedAbove18"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={status === 'non-marital'}
              onChange={() => setStatus('non-marital')}
            />
          }
          label="Non-Marital Child"
          className="CheckboxDelayedAbove18"
        />
      </Box>

      {status && (
        <Box>
          <Typography variant="body1" className="SectionTitleDelayedAbove18">
            Mandatory Documents:
          </Typography>
          {(status === 'marital' ? maritalDocuments : nonMaritalDocuments).map((doc, index) => (
            <FileUpload key={index} label={doc} onUpload={handleFileUpload} />
          ))}

          <Typography variant="body1" className="SectionTitleDelayedAbove18">
            Any two (2) of the following documentary evidence:
          </Typography>
          <Box>
            <FileUpload label="Documentary Evidence 1" onUpload={handleFileUpload} />
            <FileUpload label="Documentary Evidence 2" onUpload={handleFileUpload} />
          </Box>
        </Box>
      )}

      {status && (
        <Box className="ImportantNotes">
          <Typography variant="h6">IMPORTANT NOTES:</Typography>
          <Typography variant="body2">PAYMENT:</Typography>
          <Typography variant="body2">1. Filing Fee - PHP 300.00</Typography>
          <Typography variant="body2">
            2. Newspaper Publication - PHP 3,500.00 (or newspaper of your choice)
          </Typography>
          <Typography variant="body2">
            3. Other Fees - PHP 500.00 (notarized, new PSA corrected copy)
          </Typography>
          <Typography variant="body2">PROCESSING DURATION: 4-6 months</Typography>
          <Typography variant="body2">INQUIRY: 0936-541-0787 / slbncr@yahoo.com</Typography>
        </Box>
      )}

      {isSubmitted && (
        <Alert severity="success" sx={{ marginTop: '20px' }}>
          Your application has been submitted successfully! Redirecting...
        </Alert>
      )}

      {status && (
        <Button
          variant="contained"
          color="primary"
          disabled={!isMandatoryComplete()}
          sx={{ marginTop: '20px' }}
          onClick={handleSubmit}
          className="ButtonApplication"
        >
          Submit
        </Button>
      )}
    </div>
  );
};

export default Above18Registration;
