import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Router, Link as RouterLink } from "react-router-dom";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Grid,
  Typography,
  Alert,
} from "@mui/material";
import FileUpload from "../FileUpload";
import NavBar from "../../UserDashboard/NavBar";
import "./CorrectionClericalError.css";

const fileCategories = [
  "PSA copy of wrong document",
  "MCA copy of wrong document",
  "Church record document owner & relatives",
  "School record document owner & relatives",
  "Marriage certificate document owner (if married) & relatives",
  "Birth certificate document owner & relatives",
  "Comelec record document owner & relatives",
  "Identification cards",
  "Others",
];

const CorrectionClericalError = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedOptions, setSelectedOptions] = useState({
    firstName: false,
    lastName: false,
    middleName: false,
    others: false,
  });
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleCheckboxChange = (event) => {
    setSelectedOptions({
      ...selectedOptions,
      [event.target.name]: event.target.checked,
    });
  };

  const handleFileUpload = (label, isUploaded) => {
    setUploadedFiles((prevState) => ({
      ...prevState,
      [label]: isUploaded,
    }));
  };

  const isAnyOptionSelected = Object.values(selectedOptions).some((val) => val);

  const isFilesComplete = fileCategories.every((cat) => uploadedFiles[cat]);

  const isFormComplete = isAnyOptionSelected && isFilesComplete;

  const handleSubmit = () => {
    if (isFormComplete) {
      setIsSubmitted(true);
      setTimeout(() => {
        navigate("/ApplicationForm");
      }, 2000);
    }
  };

  return (
    <div
      className={`ClericalErrorContainer ${
        isSidebarOpen ? "sidebar-open" : ""
      }`}
    >
      <NavBar
        isSidebarOpen={isSidebarOpen}
        setIsSidebarOpen={setIsSidebarOpen}
      />
      <Typography variant="h5" className="TitleClerical">
        BIRTH CERTIFICATE APPLICATION
      </Typography>
      <Typography variant="subtitle1" className="SubtitleClerical">
        Application for Correction of Clerical Errors
      </Typography>

      <Box sx={{ marginBottom: 3 }}>
        <Typography className="SectionTitleClerical" variant="body1">
          Select the applicable:
        </Typography>
        <Grid container spacing={2}>
          {Object.keys(selectedOptions).map((option) => (
            <Grid item xs="auto" key={option} className="ClericalCB">
              <FormControlLabel
                control={
                  <Checkbox
                    checked={selectedOptions[option]}
                    onChange={handleCheckboxChange}
                    name={option}
                  />
                }
                label={option.replace(/([A-Z])/g, " $1").trim()}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
      <Box sx={{ marginBottom: 3 }}>
        {fileCategories.map((category, index) => (
          <FileUpload
            key={index}
            label={category}
            onUpload={(status) => handleFileUpload(category, status)}
          />
        ))}
      </Box>

      <Box className="ImpotantNotesClerical">
        <Typography variant="h6" className="ImportantNote">
          IMPORTANT NOTES:
        </Typography>
        <Typography variant="body2">PAYMENT:</Typography>
        <Typography variant="body2">1. Filing Fee - PHP 1000.00</Typography>
        <Typography variant="body2">2. MISC, EXPENSES - P600</Typography>
        <Typography variant="body2">
          3. Other Fees - PHP 500.00 (notarized, new PSA corrected copy)
        </Typography>
        <Typography variant="body2">PROCESSING DURATION: 4-6 months</Typography>
        <Typography variant="body2">FOR INQUIRY (text only)</Typography>
        <Typography variant="body2">MCR LANI - 0928-551-0767</Typography>
      </Box>
      {isSubmitted && (
        <Alert severity="success" sx={{ marginBottom: 2 }}>
          Your application has been submitted successfully! Redirecting...
        </Alert>
      )}

<RouterLink to = '/BirthApplicationSummary'>
      <Button
        variant="contained"
        color="primary"
        disabled={!isFormComplete}
        sx={{ marginTop: "20px" }}
        onClick={handleSubmit}
         className="ButtonApplication"
      >
        Submit
      </Button> </RouterLink>
    </div>
  );
};

export default CorrectionClericalError;
