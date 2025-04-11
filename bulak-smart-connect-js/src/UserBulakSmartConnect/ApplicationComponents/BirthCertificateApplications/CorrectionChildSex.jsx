import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Router, Link as RouterLink } from 'react-router-dom';
import { Box, Button, Checkbox, FormControlLabel, Grid, Typography, Alert } from '@mui/material';
import FileUpload from '../FileUpload';
import './CorrectionChildSex.css';
import NavBar from '../../NavSide';

const mandatoryDocuments = [
  'NBI Clearance',
  'PNP Clearance',
  'Employer’s Clearance (no pending case) OR business records or affidavid of unempployment with no pending case',
  'Earliest church record/s or certificate of no church record/s available and affidavid of no church record/s available',
  'Eariest school record (form 137A) OR certificate of no school record/s available AND affidavid of no school record available',
  'Medical record/s OR affidavid of no medical record/s available',
];

const supportingDocuments = [
  'Other school records-transcript, dimploma, certificates',
  'Birth and/or Church Certificates of Child/Children',
  'Voter’s Record',
  'Employment Records',
  'Identification Cards - National ID, Driver’s License, Senior’s ID, etc.',
  'Others - Passport, Insurance Documents, Member’s Data Record',
];

const addiotionalDocuments = [
  'Certification from Dr. Reginell Nuñez or Dr. Jeanette Dela Cruz-that the document owner is MALE or FEMALE and has not underwent sex transplant ',
];

const SexDobCorrection = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({
    Sex: false,
    BirthDay: false,
    BirthMonth: false,
  });
  const [isMarried, setIsMarried] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();

  const handleCheckboxChange = event => {
    const { name, checked } = event.target;
    setSelectedOptions(prevState => ({
      ...prevState,
      [name]: checked,
    }));
  };

  const handleFileUpload = (label, isUploaded) => {
    setUploadedFiles(prevState => ({
      ...prevState,
      [label]: isUploaded,
    }));
  };

  const isMandatoryComplete = mandatoryDocuments.every(doc => uploadedFiles[doc]);
  const isMarriageCertComplete = !isMarried || uploadedFiles['Marriage Certificate'];
  const isFormComplete = isMandatoryComplete && isMarriageCertComplete;

  const handleSubmit = () => {
    if (isFormComplete) {
      setIsSubmitted(true);
      setTimeout(() => {
        navigate('/BirthApplicationSummary');
      }, 2000);
    }
  };

  return (
    <div className={`CorrectionContainer ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <NavBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <Typography variant="h5" className="TitleCorrection">
        BIRTH CERTIFICATE APPLICATION
      </Typography>
      <Typography className="SubTitleCorrection">
        Application for Correction of Child’s Sex / Date of Birth-Day & Month
      </Typography>
      <Box sx={{ marginBottom: 3 }}>
        <Typography variant="body1">Select the correction :</Typography>
        <Grid container spacing={2}>
          {Object.keys(selectedOptions).map(option => (
            <Grid item xs="auto" key={option} className="CorrectionCB">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedOptions[option]}
                    onChange={handleCheckboxChange}
                    name={option}
                  />
                }
                label={option.replace(/([A-Z])/g, ' $1').trim()}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box>
        <Typography variant="body1" className="SectionTitleDOBCorrection">
          Mandatory Documents:
        </Typography>
        {mandatoryDocuments.map((doc, index) => (
          <FileUpload key={index} label={doc} onUpload={handleFileUpload} />
        ))}
      </Box>

      <Box>
        <Typography variant="body1" className="SectionTitleDOBCorrection">
          Supporting Documents:
        </Typography>
        <FormControlLabel
          control={<Checkbox checked={isMarried} onChange={e => setIsMarried(e.target.checked)} />}
          label="Married"
          className="MarriedCheckbox"
        />
        {isMarried && <FileUpload label="Marriage Certificate" onUpload={handleFileUpload} />}
        {supportingDocuments.map((doc, index) => (
          <FileUpload key={index} label={doc} onUpload={handleFileUpload} />
        ))}
      </Box>

      <Box>
        <Typography variant="body1" className="SectionTitleCorrection">
          Additional Requirements For Document Correction Of Sex:
        </Typography>
        {addiotionalDocuments.map((doc, index) => (
          <FileUpload key={index} label={doc} onUpload={handleFileUpload} />
        ))}
      </Box>

      <Box className="ImportantNotesCorection">
        <Typography variant="h6" className="ImportantNote">
          IMPORTANT NOTES:
        </Typography>
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

      {isSubmitted && (
        <Alert severity="success" sx={{ marginTop: '20px' }}>
          Your application has been submitted successfully! Redirecting...
        </Alert>
      )}

      <Button
        variant="contained"
        color="primary"
        disabled={!isFormComplete}
        sx={{ marginTop: '20px' }}
        onClick={handleSubmit}
        className="ButtonApplication"
      >
        Submit
      </Button>
    </div>
  );
};

export default SexDobCorrection;
