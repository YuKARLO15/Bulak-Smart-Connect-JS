import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Typography,
  Alert,
} from '@mui/material';
import FileUpload from '../FileUpload';
import NavBar from '../../../NavigationComponents/NavSide';
import './MarriageCertificateApplication.css';


import { addApplication, updateApplication } from '../ApplicationData';

const requiredDocuments = [
  'Marriage License',
  'Valid ID of Bride', 
  'Valid ID of Groom',
  'Certificate of Marriage from the Officiant'
];

const MarriageCertificateApplication = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({});
  const navigate = useNavigate();
  

  useEffect(() => {
    const storedFormData = JSON.parse(localStorage.getItem('marriageFormData') || '{}');
    setFormData(storedFormData);
  }, []);

  const handleFileUpload = (label, isUploaded) => {
    setUploadedFiles(prevState => ({
      ...prevState,
      [label]: isUploaded,
    }));
  };

  const isFormComplete = requiredDocuments.every(doc => uploadedFiles[doc]);

  const handleSubmit = () => {
    if (isFormComplete) {
      try {
        const applicationId = formData.applicationId || localStorage.getItem('currentApplicationId');
        
        if (!applicationId) {
          console.error('No application ID found');
          alert('Error submitting application: No application ID found. Please start over.');
          navigate('/MarriageDashboard');
          return;
        }
        
        const updatedFormData = {
          ...formData,
          uploadedFiles: uploadedFiles,
        };
        
        updateApplication(applicationId, {
          documents: Object.keys(uploadedFiles).filter(key => uploadedFiles[key]),
          status: 'Pending',
          formData: updatedFormData
        });
        
        localStorage.setItem('currentApplicationId', applicationId);
        
        localStorage.removeItem('marriageFormData');
        
        setIsSubmitted(true);
        
        setTimeout(() => {
          navigate('/MarriageSummaryForm');
        }, 2000);
      } catch (error) {
        console.error('Error submitting application:', error);
        alert('Error submitting application. Please try again.');
      }
    } else {
      alert('Please upload the required documents before submitting.');
    }
  };
  
  const handleBack = () => {
    navigate('/MarriageCertificateForm');
  };

  return (
    <div className={`MarriageCertificateContainer ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <NavBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <Typography variant="h5" className="TitleMarriageCertificate">
        MARRIAGE CERTIFICATE APPLICATION
      </Typography>
      <Typography className="SubtitleMarriageCertificate">
        Request for Marriage Certificate
      </Typography>

      <Box className="DocumentsSectionMarriageCertificate">
        <Typography variant="body1" className="SectionTitleMarriageCertificate">
          Required Documents:
        </Typography>
        
        {requiredDocuments.map((doc, index) => (
          <FileUpload key={index} label={doc} onUpload={handleFileUpload} />
        ))}
      </Box>

      {isSubmitted && (
        <Alert severity="success" sx={{ marginTop: '20px' }}>
          Your application has been submitted successfully! Redirecting...
        </Alert>
      )}

      <div className="ButtonContainerMarriageCertificate">
        <Button
          variant="contained"
          color="secondary"
          sx={{ marginTop: '20px', marginRight: '10px' }}
          onClick={handleBack}
          className="BackButtonMarriageCertificate"
        >
          Back
        </Button>
        
        <Button
          variant="contained"
          color="primary"
          disabled={!isFormComplete}
          sx={{ marginTop: '20px' }}
          onClick={handleSubmit}
          className="SubmitButtonMarriageCertificate"
        >
          Submit
        </Button>
      </div>
    </div>
  );
};

export default MarriageCertificateApplication;