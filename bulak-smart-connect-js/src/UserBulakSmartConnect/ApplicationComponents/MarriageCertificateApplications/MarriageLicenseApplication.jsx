import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Alert,
  Radio,
  RadioGroup,
  FormControl,
} from '@mui/material';
import NavBar from '../../../NavigationComponents/NavSide';
import FileUpload from '../FileUpload';  // Add this import
import './MarriageLicenseApplication.css';
import { documentApplicationService } from '../../../services/documentApplicationService';

const mandatoryDocuments = [
  'Birth / Baptismal Certificate',
  'Seminar Certificate (CSDW)',
  'Cenomar (PSA)',
  'Official Receipt',
];

const MarriageLicenseApplication = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [foreignNational, setForeignNational] = useState(false);
  const [widowWidower, setWidowWidower] = useState(false);
  const [annulled, setAnnulled] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [fileData, setFileData] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [foreignNationalType, setForeignNationalType] = useState('');

  const [widowWidowerType, setWidowWidowerType] = useState('');
  const [annulledType, setAnnulledType] = useState('');

  const navigate = useNavigate();

  // Helper function to convert data URL to File object
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

  // Update the handleFileUpload function
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

      // Upload to backend
      try {
        const applicationId = localStorage.getItem('currentApplicationId');
        if (!applicationId) {
          alert("Application ID is missing. Please refresh the page and try again.");
          return;
        }
        
        console.log("Application ID:", applicationId);
        console.log("Uploading file:", fileDataObj.name);
        
        // Check if application exists before uploading
        try {
          // Optional: check if application exists first
          const appCheck = await documentApplicationService.getApplication(applicationId);
          console.log("Application exists:", appCheck);
        } catch (appError) {
          console.error("Application doesn't exist:", appError);
          
          try {
            // Create application if it doesn't exist
            const newApp = await documentApplicationService.createApplication({
              applicationType: 'Marriage License',
              formData: {
                applicantName: 'Applicant Name',
                applicationDate: new Date().toISOString()
              }
            });
            
            // Log the full response to debug
            console.log("Create application response:", newApp);
            
            // Handle different response structures
            const newAppId = newApp.id || (newApp.data && newApp.data.id);
            
            if (!newAppId) {
              throw new Error('Failed to get application ID from response');
            }
            
            localStorage.setItem('currentApplicationId', newAppId);
            console.log("Created new application with ID:", newAppId);
          } catch (createError) {
            console.error("Failed to create application:", createError);
            alert("Failed to create application. Please refresh and try again.");
            return;
          }
        }
        
        const file = dataURLtoFile(fileDataObj.data, fileDataObj.name, fileDataObj.type);
        
        const response = await documentApplicationService.uploadFile(applicationId, file, label);
        console.log("Upload response:", response);
        
        alert(`"${label}" uploaded successfully!`);
        
      } catch (error) {
        console.error(`Failed to upload "${label}":`, error);
        
        if (error.response) {
          console.error("Server response:", error.response.status, error.response.data);
          alert(`Failed to upload "${label}": ${error.response.data?.message || error.message}`);
        } else {
          alert(`Failed to upload "${label}": ${error.message}`);
        }
        
        // Revert the upload state on error
        setUploadedFiles(prevState => ({
          ...prevState,
          [label]: false,
        }));
      }
    } else {
      setFileData(prevState => {
        const newState = { ...prevState };
        delete newState[label];
        return newState;
      });
    }
  };

  const isMandatoryComplete = mandatoryDocuments.every(doc => uploadedFiles[doc]);

  const isFormComplete =
    isMandatoryComplete &&
    (!foreignNational || foreignNationalType) &&
    (!widowWidower || widowWidowerType) &&
    (!annulled || annulledType);

  const handleSubmit = async () => {
    if (isFormComplete) {
      setIsSubmitted(true);
      
      try {
        const applicationId = localStorage.getItem('currentApplicationId');
        if (!applicationId) {
          throw new Error('Application ID is missing');
        }
        
        console.log('Attempting to update application with ID:', applicationId);
        
        try {
          // First verify the application exists
          const appCheck = await documentApplicationService.getApplication(applicationId);
          console.log("Verified application exists:", appCheck);
          
          // Instead of using updateApplication, try using a different endpoint
          // This is a workaround based on how your backend is structured
          const updateResponse = await documentApplicationService.updateApplicationStatus(applicationId, {
            status: 'Pending',
            statusMessage: 'Marriage license application submitted with all required documents'
          });
          
          console.log('Application status updated successfully:', updateResponse);
          
          setTimeout(() => {
            navigate('/MarriageLicenseSummary');
          }, 2000);
        } catch (error) {
          console.error('Error updating application:', error);
          
          // If the application cannot be updated, we'll still navigate to the summary page
          // since the files were uploaded successfully
          alert('Your application was processed, but there was an issue updating its status. Your files have been uploaded successfully.');
          
          setTimeout(() => {
            navigate('/MarriageLicenseSummary');
          }, 2000);
        }
      } catch (error) {
        console.error('Error submitting application:', error);
        alert(`Error submitting application: ${error.message}`);
        setIsSubmitted(false);
      }
    }
  };

  // Add this useEffect to create the application when component mounts
  useEffect(() => {
    const createApplication = async () => {
      try {
        // Check if we already have an application ID
        let applicationId = localStorage.getItem('currentApplicationId');
        
        if (!applicationId) {
          // Create a new application
          const response = await documentApplicationService.createApplication({
            applicationType: 'Marriage License',  // Changed from type to applicationType
            formData: {  // Changed from applicantInfo to formData
              applicantName: 'Applicant Name',
              applicationDate: new Date().toISOString()
            }
          });
          
          // Check the response structure
          console.log('Create application response:', response);
          
          // Handle different response structures
          applicationId = response.id || (response.data && response.data.id);
          
          if (!applicationId) {
            throw new Error('Failed to get application ID from response');
          }
          
          localStorage.setItem('currentApplicationId', applicationId);
          console.log('Created new application with ID:', applicationId);
        } else {
          console.log('Using existing application ID:', applicationId);
        }
      } catch (error) {
        console.error('Error creating application:', error);
        alert('Failed to initialize application. Please try again.');
      }
    };
    
    createApplication();
  }, []);
  
  return (
    <div className={`MarriageLicenseContainer ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <NavBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <Typography variant="h5" className="TitleMarriageLicense">
        MARRIAGE CERTIFICATE APPLICATION
      </Typography>
      <Typography className="SubtitleMarriageLicense">Application for Marriage License</Typography>

      <Box className="ApplicantTypeSectionMarriageLicense">
        <FormControlLabel
          control={
            <Checkbox
              checked={foreignNational}
              onChange={() => setForeignNational(!foreignNational)}
            />
          }
          label="Foreign National"
        />
        <FormControlLabel
          control={
            <Checkbox checked={widowWidower} onChange={() => setWidowWidower(!widowWidower)} />
          }
          label="Widow / Widower"
        />
        <FormControlLabel
          control={<Checkbox checked={annulled} onChange={() => setAnnulled(!annulled)} />}
          label="Annulled"
        />
      </Box>

      <Box className="MandatoryDocumentsMarriageLicense">
        <Typography variant="body1" className="SectionTitleMarriageLicense">
          Mandatory Documents:
        </Typography>
        {mandatoryDocuments.map((doc, index) => (
          <FileUpload 
            key={index} 
            label={doc} 
            onUpload={(isUploaded, fileDataObj) => handleFileUpload(doc, isUploaded, fileDataObj)} 
          />
        ))}
      </Box>

      {foreignNational && (
        <Box className="AdditionalDocumentsMarriageLicense">
          <Typography variant="body1" className="SectionTitleMarriageLicense">
            For Foreign Nationals:
          </Typography>
          <FormControl className="RadioGroupMarriageLicense">
            <Typography>Who is a foreign national?</Typography>
            <RadioGroup
              row
              value={foreignNationalType}
              onChange={e => setForeignNationalType(e.target.value)}
            >
              <FormControlLabel value="Groom" control={<Radio />} label="Groom" />
              <FormControlLabel value="Bride" control={<Radio />} label="Bride" />
            </RadioGroup>
          </FormControl>

          <FileUpload
            label="Legal Capacity from their embassy (Manila)"
            onUpload={(isUploaded, fileDataObj) => 
              handleFileUpload("Legal Capacity from their embassy (Manila)", isUploaded, fileDataObj)
            }
          />
          <FileUpload 
            label="Decree of Divorce from Court" 
            onUpload={(isUploaded, fileDataObj) => 
              handleFileUpload("Decree of Divorce from Court", isUploaded, fileDataObj)
            } 
          />
        </Box>
      )}

      {widowWidower && (
        <Box className="AdditionalDocumentsMarriageLicense">
          <Typography variant="body1" className="SectionTitleMarriageLicense">
            For Widow / Widower:
          </Typography>

          <FormControl className="RadioGroupMarriageLicense">
            <Typography>Who is a widow / widower?</Typography>
            <RadioGroup
              row
              value={widowWidowerType}
              onChange={e => setWidowWidowerType(e.target.value)}
            >
              <FormControlLabel value="Groom" control={<Radio />} label="Groom" />
              <FormControlLabel value="Bride" control={<Radio />} label="Bride" />
            </RadioGroup>
          </FormControl>

          <FileUpload
            label="Registered Death Certificate of Previous Spouse"
            onUpload={(isUploaded, fileDataObj) => 
              handleFileUpload("Registered Death Certificate of Previous Spouse", isUploaded, fileDataObj)
            }
          />
        </Box>
      )}

      {annulled && (
        <Box className="AdditionalDocumentsMarriageLicense">
          <Typography variant="body1" className="SectionTitleMarriageLicense">
            For Annulled Applicants:
          </Typography>

          <FormControl className="RadioGroupMarriageLicense">
            <Typography>Who is annulled?</Typography>
            <RadioGroup row value={annulledType} onChange={e => setAnnulledType(e.target.value)}>
              <FormControlLabel value="Groom" control={<Radio />} label="Groom" />
              <FormControlLabel value="Bride" control={<Radio />} label="Bride" />
            </RadioGroup>
          </FormControl>

          <FileUpload
            label="Decree of Annulment from Court with FINALITY"
            onUpload={(isUploaded, fileDataObj) => 
              handleFileUpload("Decree of Annulment from Court with FINALITY", isUploaded, fileDataObj)
            }
          />
        </Box>
      )}

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
        className="SubmitButtonMarriageLicense"
      >
        Submit
      </Button>
    </div>
  );
};

export default MarriageLicenseApplication;
