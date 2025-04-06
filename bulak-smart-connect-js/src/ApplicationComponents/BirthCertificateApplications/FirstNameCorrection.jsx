import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Router, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from "@mui/material";
import FileUpload from "../FileUpload";
import "./FirstNameCorrection.css";
import NavBar from "../../UserDashboard/NavBar";

const mandatoryDocuments = [
  "NBI Clearance",
  "PNP Clearance",
  "Employer’s Clearance / Business Records / Affidavit of Unemployment",
];

const supportingDocuments = [
  "School Records",
  "Church Records",
  "Birth and/or Church Certificates of Child/Children",
  "Voter’s Record",
  "Employment Records",
  "Identification Cards - National ID, Driver’s License, Senior’s ID, etc.",
  "Others - Passport, Insurance Documents, Member’s Data Record",
];

const FirstNameCorrection = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMarried, setIsMarried] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const navigate = useNavigate();

  const handleFileUpload = (label, isUploaded) => {
    setUploadedFiles((prevState) => ({
      ...prevState,
      [label]: isUploaded,
    }));
  };

  const isMandatoryComplete = mandatoryDocuments.every(
    (doc) => uploadedFiles[doc]
  );
  const isMarriageCertComplete =
    !isMarried || uploadedFiles["Marriage Certificate"];
  const isFormComplete = isMandatoryComplete && isMarriageCertComplete;

  const handleSubmit = () => {
    setOpenDialog(true);
  };

  const confirmSubmit = () => {
    setOpenDialog(false);
    setIsSubmitted(true);
    setTimeout(() => {
      navigate("/ApplicationForm");
    }, 2000);
  };

  return (
    <div
      className={`FirstNameContainer ${isSidebarOpen ? "sidebar-open" : ""}`}
    >
      <NavBar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <Typography variant="h5" className="TitleFirstName">
        BIRTH CERTIFICATE APPLICATION
      </Typography>
      <Typography className="SubtitleFirstName">
        Application for Correction of Child’s First Name
      </Typography>

      <Box>
        <Typography variant="body1" className="SectionTitleFirstName">
          Mandatory Documents:
        </Typography>
        {mandatoryDocuments.map((doc, index) => (
          <FileUpload key={index} label={doc} onUpload={handleFileUpload} />
        ))}
      </Box>

      <Box>
        <Typography variant="body1" className="SectionTitleFirstName">
          Supporting Documents:
        </Typography>
        <FormControlLabel
          control={
            <Checkbox
              checked={isMarried}
              onChange={(e) => setIsMarried(e.target.checked)}
            />
          }
          label="Married"
          className="MarriedCheckboxFirstName"
        />
        {isMarried && (
          <FileUpload
            label="Marriage Certificate"
            onUpload={handleFileUpload}
          />
        )}
        {supportingDocuments.map((doc, index) => (
          <FileUpload key={index} label={doc} onUpload={handleFileUpload} />
        ))}
      </Box>

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
        <Typography variant="body2">
          INQUIRY: 0936-541-0787 / slbncr@yahoo.com
        </Typography>
      </Box>

      {isSubmitted && (
        <Alert severity="success" sx={{ marginTop: "20px" }}>
          Your application has been submitted successfully! Redirecting...
        </Alert>
      )}

      <Button
        variant="contained"
        color="primary"
        disabled={!isFormComplete}
        sx={{ marginTop: "20px" }}
        onClick={handleSubmit}
        className="ButtonApplication"
      >
        Submit
      </Button>

      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} className="ApplicationDialogContainer">
        <DialogTitle  className="ApplicationDialogTitle"  >Confirm Submission</DialogTitle>
        <DialogContent>
          <DialogContentText  className="ApplicationDialogContent">
            Are you sure that all details are correct?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="secondary"  className="ApplicationDialogBtnC">
            Cancel
          </Button>

          <RouterLink to = '/BirthApplicationSummary'>
      <Button
        variant="contained"
        color="primary"
        disabled={!isFormComplete}
        
        onClick={handleSubmit}
         className="ApplicationDialogBtnS"
      >
        Submit
      </Button> </RouterLink>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default FirstNameCorrection;
