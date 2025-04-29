import React, { useState, useEffect } from "react";
import { Box, Typography, Button, Paper, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import FileUpload from "../FileUpload";
import NavBar from "../../NavSide";
import BirthCertificateApplicationData from "./BirthCertificateApplicationData";
import "./CTCBirthcertificate.css";
import RequirementBirthList from "./RequirementBirthListSample";

const CTCBirthCertificate = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [formData, setFormData] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const navigate = useNavigate();
  const [showRequirements, setShowRequirements] = useState(true);

  useEffect(() => {
   
    try {
      const storedData = localStorage.getItem("birthCertificateApplication");
      if (storedData) {
        setFormData(JSON.parse(storedData));
      }
    } catch (err) {
      console.error("Error loading form data:", err);
    }
  }, []);

  const requiredDocuments = [
    "Valid ID",
    "Authorization Letter (if applicable)"
  ];

  const handleFileUpload = (label, isUploaded) => {
    setUploadedFiles(prevState => ({
      ...prevState,
      [label]: isUploaded
    }));
  };

  const isFormComplete = uploadedFiles["Valid ID"] || 
    (formData?.purpose === "Authorization Letter (if applicable)" && uploadedFiles["Authorization Letter (if applicable)"]);

  const handleSubmit = () => {
    if (isFormComplete) {
      try {

        const updatedFormData = {
          ...formData,
          uploadedFiles: uploadedFiles
        };


        const applicationId = BirthCertificateApplicationData(updatedFormData);
        localStorage.setItem("currentApplicationId", applicationId);

        setIsSubmitted(true);
        
      
        setTimeout(() => {
          navigate("/BirthApplicationSummary");
        }, 2000);
      } catch (error) {
        console.error("Error submitting application:", error);
        alert("Error submitting application. Please try again.");
      }
    } else {
      alert("Please upload the required documents before submitting.");
    }
  };

  const handleBack = () => {
    navigate("/RequestACopyBirthCertificate");
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
          <Typography variant="h6">
            Applicant Information
          </Typography>
          <Typography variant="body1">
            Name: {formData?.firstName || ''} {formData?.middleName || ''} {formData?.lastName || ''}
          </Typography>
          <Typography variant="body1">
            Date of Birth: {formData?.birthMonth || ''} {formData?.birthDay || ''}, {formData?.birthYear || ''}
          </Typography>
          <Typography variant="body1">
            Purpose: {formData?.purpose || 'Not specified'}
          </Typography>
        </Box>

        <Typography variant="h6" className="RequirementsHeaderCTCBirth">
          Required Documents
        </Typography>
        
        <Box className="DocumentsListCTCBirth">
          <FileUpload 
            label="Valid ID" 
            onUpload={(isUploaded) => handleFileUpload("Valid ID", isUploaded)} 
            required={true}
          />
          <Typography variant="caption" className="DocumentDescriptionCTCBirth">
            Please upload a clear copy of any valid government-issued ID (e.g., Driver's License, Passport, PhilSys ID)
          </Typography>
       

          <FileUpload 
            label="Authorization Letter (if applicable)" 
            onUpload={(isUploaded) => handleFileUpload("Authorization Letter (if applicable)", isUploaded)} 
            required={false}
          />
          <Typography variant="caption" className="DocumentDescriptionCTCBirth">
            If you are requesting on behalf of someone else, please upload a signed authorization letter and your valid ID
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