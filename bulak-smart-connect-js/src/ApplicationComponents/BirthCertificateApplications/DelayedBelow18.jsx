import React, { useState } from "react";

import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Typography,
  Alert,
} from "@mui/material";
import FileUpload from "../FileUpload";
import "./DelayedBelow18.css";
import NavBar from "../../UserDashboard/NavBar";

const mandatoryDocuments = [
  "Negative Certification from PSA",
  "Two (2) Documentary Evidences",
  "Affidavit of Two (2) Disinterested Persons (Not Related)",
    "Unedited Front-Facing Photo (2x2, White Background)",
    "Documentary Evidence/s of Parents",
  "Barangay Certification of Residency",
  "National ID or ePhil ID",
  "Affidavit of Whereabouts of the Mother",
];


const Below18Registration = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [motherNotPresent, setMotherNotPresent] = useState(false);
  const [maritalStatus, setMaritalStatus] = useState(""); // "marital" or "non-marital"
  const [uploadedFiles, setUploadedFiles] = useState({});
  const [isSubmitted, setIsSubmitted] = useState(false);
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
  const isMotherAffidavitComplete =
    !motherNotPresent || uploadedFiles["Affidavit of Whereabouts of the Mother"];
  const isMaritalComplete =
    maritalStatus !== "marital" || uploadedFiles["Certificate of Marriage of Parents"];

  const isFormComplete =
    isMandatoryComplete && isMotherAffidavitComplete && isMaritalComplete && maritalStatus;

  const handleSubmit = () => {
    if (isFormComplete) {
      setIsSubmitted(true);
      setTimeout(() => {
        navigate("/BirthApplicationSummary");
      }, 2000);
    }
  };

  return (
    <div
      className={`FormContainerBelow18 ${isSidebarOpen ? "SidebarOpenBelow18" : ""}`}
    >
      <NavBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <Typography variant="h5" className="FormTitleBelow18">
        Birth Certificate Application
      </Typography>
      <Typography className="FormSubtitleBelow18">
        Applying for Delayed Registration - Below 18 Years Old
          </Typography>
          <div className="checkboxBelow18top">
          <FormControlLabel
          control={
            <Checkbox
              checked={maritalStatus === "marital"}
              onChange={() => setMaritalStatus("marital")}
         
            />
          }
          label="Marital"
          className="CheckboxBelow18"
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={maritalStatus === "non-marital"}
              onChange={() => setMaritalStatus("non-marital")}
             
            />
          }
          label="Non-Marital"
          className="CheckboxBelow18"
              />
              </div>

      <Box>
        <Typography variant="body1" className="SectionTitleBelow18">
          Mandatory Documents:
        </Typography>
        {mandatoryDocuments.map((doc, index) => (
          <FileUpload key={index} label={doc} onUpload={handleFileUpload} />
        ))}
      </Box>

      <Box>


        {maritalStatus === "marital" && (
          <FileUpload
            label="Certificate of Marriage of Parents"
            onUpload={handleFileUpload}
          />
        )}
   
        <FormControlLabel
          control={
            <Checkbox
              checked={motherNotPresent}
              onChange={(e) => setMotherNotPresent(e.target.checked)}
            />
          }
          label="Mother Will Not Be Personally Present"
          className="CheckboxBelow18"
        />
        {motherNotPresent && (
          <FileUpload
            label="Affidavit of Whereabouts of the Mother"
            onUpload={handleFileUpload}
          />
        )}
              

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
    </div>
  );
};

export default Below18Registration;
