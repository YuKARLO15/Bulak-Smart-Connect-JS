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

// Import your function for storing application data
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
  
  // Load form data when component mounts
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
        // Get the existing application ID from formData or localStorage
        const existingApplicationId = formData.applicationId || localStorage.getItem('lastMarriageApplicationId');
        
        // Update the form data with uploaded files
        const updatedFormData = {
          ...formData,
          uploadedFiles: uploadedFiles,
        };
        
        let applicationId;
        
        // If we found an existing application, update it
        if (existingApplicationId) {
          // Update the existing application with documents
          updateApplication(existingApplicationId, {
            documents: Object.keys(uploadedFiles).filter(key => uploadedFiles[key]),
            status: 'Pending',
            formData: updatedFormData
          });
          applicationId = existingApplicationId;
        } else {
          // Create a new application
          applicationId = 'MC-' + Date.now().toString();
          
          const applicationData = {
            id: applicationId,
            type: 'Marriage Certificate',
            documents: Object.keys(uploadedFiles).filter(key => uploadedFiles[key]),
            dateSubmitted: new Date().toISOString(),
            status: 'Pending',
            formData: updatedFormData
          };
          
          addApplication(applicationData);
        }
        
        // Store the application ID for the summary page
        localStorage.setItem('currentApplicationId', applicationId);
        
        // Remove the separate marriage form data since it's now part of the application
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