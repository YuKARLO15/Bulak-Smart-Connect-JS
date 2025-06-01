
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Paper, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import FileUpload from '../FileUpload';
import NavBar from '../../../NavigationComponents/NavSide';
import BirthCertificateApplicationData from './BirthCertificateApplicationData';
import './CTCBirthCertificate.css';
import { documentApplicationService } from '../../../services/documentApplicationService';

const CTCBirthCertificate = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [formData, setFormData] = useState({});
  const [fileData, setFileData] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();
  const [showRequirements, setShowRequirements] = useState(true);
  const isFormComplete = 
    uploadedFiles['Valid ID'] === true && 
    (formData?.purpose !== 'On behalf of someone' || 
     uploadedFiles['Authorization Letter (if applicable)'] === true);

  useEffect(() => {
    try {
      const storedData = localStorage.getItem('birthCertificateApplication');
      if (storedData) {
        setFormData(JSON.parse(storedData));
      }
    } catch (err) {
      console.error('Error loading form data:', err);
    }
  }, []);

  const requiredDocuments = ['Valid ID', 'Authorization Letter (if applicable)'];


  function dataURLtoFile(dataurl, filename, type) {
  try {
    const arr = dataurl.split(',');
    const mimeMatch = arr[0].match(/:(.*?);/);
    const mime = mimeMatch ? mimeMatch[1] : type;
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) u8arr[n] = bstr.charCodeAt(n);
    return new File([u8arr], filename, { type: mime });
  } catch (error) {
    console.error('Error converting data URL to file:', error);
    throw new Error('Invalid file format');
  }
}



const handleFileUpload = async (label, isUploaded, fileDataObj) => {
  setUploadedFiles(prevState => ({
    ...prevState,
    [label]: isUploaded,
  }));

  if (isUploaded && fileDataObj) {
    setFileData(prevState => ({
      ...prevState,
      [label]: fileDataObj,
    }));

    // === Upload to backend ===
    try {
      const applicationId = localStorage.getItem('currentApplicationId');
      if (!applicationId) {
        alert("Application ID is missing. Cannot upload file.");
        return;
      }
      
      console.log("Application ID:", applicationId);
      console.log("Uploading file:", fileDataObj.name);
      
      const file = dataURLtoFile(fileDataObj.data, fileDataObj.name, fileDataObj.type);
      
      // Log the URL that will be called
      const uploadUrl = `/document-applications/${applicationId}/files`;
      console.log("Uploading to URL:", uploadUrl);
      
      const response = await documentApplicationService.uploadFile(applicationId, file, label);
      console.log("Upload response:", response);
      
    } catch (error) {
      console.error(`Failed to upload "${label}":`, error);
      
      // Show more detailed error information
      if (error.response) {
        console.error("Server response:", error.response.status, error.response.data);
      }
      
      alert(`Failed to upload "${label}": ${error.message}`);
    }
  } else {
    setFileData(prevState => {
      const newState = { ...prevState };
      delete newState[label];
      return newState;
    });
  }
};
  const handleSubmit = () => {
    if (isFormComplete) {
      try {
        const applicationId = localStorage.getItem('currentApplicationId');
        if (!applicationId) {
          console.error("No application ID found");
          alert("Application ID is missing. Cannot proceed.");
          return;
        }
        const updatedFormData = {
          ...formData,
          uploadedFiles: fileData,
        };

        const applications = JSON.parse(localStorage.getItem('applications') || '[]');
        const appIndex = applications.findIndex(app => app.id === applicationId);

        if (appIndex >= 0) {
          applications[appIndex] = {
            ...applications[appIndex],
            formData: {
              ...applications[appIndex].formData,
              ...updatedFormData
            },
            lastUpdated: new Date().toISOString()
          };
        } else {
          console.error(`Application ID ${applicationId} not found in applications array`);
          alert("Could not find your application. Please try again.");
          return;
        }

        localStorage.setItem('applications', JSON.stringify(applications));
        localStorage.setItem('birthCertificateApplication', JSON.stringify(updatedFormData));

        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new CustomEvent('customStorageUpdate', {
          detail: {
            id: applicationId,
            action: 'updated',
            type: 'Birth Certificate'
          }
        }));

        setIsSubmitted(true);
        setTimeout(() => {
          navigate('/BirthApplicationSummary');
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
    navigate('/RequestACopyBirthCertificate');
  };

  return (
    <Box className={`MainContainerCTCBirth ${isSidebarOpen ? 'SidebarOpenCTCBirth' : ''}`}>
      <NavBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />

      <Typography variant="h4" className="TitleCTCBirth">
        Upload Required Documents
      </Typography>

      <Typography variant="subtitle1" className="SubtitleCTCBirth">
        Please upload the following documents to complete your birth certificate copy request
      </Typography>

      <Paper elevation={3} className="DocumentsPaperCTCBirth">
        <Box className="ApplicantInfoCTCBirth">
          <Typography variant="h6">Applicant Information</Typography>
          <Typography variant="body1">
            Name: {formData?.firstName || ''} {formData?.middleName || ''}{' '}
            {formData?.lastName || ''}
          </Typography>
          <Typography variant="body1">
            Date of Birth: {formData?.birthMonth || ''} {formData?.birthDay || ''},{' '}
            {formData?.birthYear || ''}
          </Typography>
          <Typography variant="body1">Purpose: {formData?.purpose || 'Not specified'}</Typography>
        </Box>

        <Typography variant="h6" className="RequirementsHeaderCTCBirth">
          Required Documents
        </Typography>

        <Box className="DocumentsListCTCBirth">
          <FileUpload
            label="Valid ID"
            onUpload={(isUploaded, fileDataObj) => 
              handleFileUpload('Valid ID', isUploaded, fileDataObj)
            }
            required={true}
          />
          <Typography variant="caption" className="DocumentDescriptionCTCBirth">
            Please upload a clear copy of any valid government-issued ID (e.g., Driver's License,
            Passport, PhilSys ID)
          </Typography>

          <FileUpload
            label="Authorization Letter (if applicable)"
            onUpload={(isUploaded, fileDataObj) => 
              handleFileUpload('Authorization Letter (if applicable)', isUploaded, fileDataObj)
            }
            required={false}
          />
          <Typography variant="caption" className="DocumentDescriptionCTCBirth">
            If you are requesting on behalf of someone else, please upload a signed authorization
            letter and your valid ID
          </Typography>
        </Box>

        {isSubmitted && (
          <Alert severity="success" className="SuccessAlertCTCBirth">
            Your application has been submitted successfully! Redirecting to summary...
          </Alert>
        )}

        <Box className="ButtonContainerCTCBirth">
          <Button
            variant="outlined"
            color="primary"
            onClick={handleBack}
            className="BackButtonCTCBirth"
          >
            Back
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={handleSubmit}
            className="SubmitButtonCTCBirth"
            disabled={!isFormComplete || isSubmitted}
          >
            Submit Application
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default CTCBirthCertificate;