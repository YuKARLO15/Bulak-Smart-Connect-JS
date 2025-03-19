import React, { useState } from "react";
import { useNavigate } from "react-router-dom";  
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  Typography,
  Box,
  Paper,
  Button,
} from "@mui/material";
import "./BirthCertificateDashboard.css";
import NavBar from "../../UserDashboard/NavBar";

const BirthCertificateDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState("");
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const navigate = useNavigate();

  const handleNext = () => {
    if (!selectedOption) {
      alert("Please select an option before proceeding.");
      return;
    }
    localStorage.setItem("selectedBirthCertificateOption", selectedOption);

    navigate("/BirthCertificateForm");
  };

  return (
    <Box className={`BirthDashboardContainer ${isSidebarOpen ? "sidebar-open" : ""}`}>
      <NavBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <Typography variant="h4" className="FormTitle">
        Birth Certificate Application
      </Typography>
      <Paper className="FormPaper" elevation={3}>
        <Box className="Section">
          <Typography variant="h6" className="SectionTitle">
            Applying for:
          </Typography>
          <RadioGroup
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
            className="BirthDashRadioGroup"
          >
            <FormControlLabel
              value="Regular application"
              control={<Radio />}
              label="Regular application for birth certificate (0 - 1 month after birth)"
            />
            <FormControlLabel
              value="Request copy"
              control={<Radio />}
              label="Request a copy of birth certificate"
            />
            <Typography variant="subtitle1" className="SubTitleBirthCertificate">
              Delayed registration (More than 1 month after birth)
            </Typography>
            <FormControlLabel
              value="Above 18"
              control={<Radio />}
              label="Above 18 years old (marital / non-marital)"
            />
            <FormControlLabel
              value="Below 18"
              control={<Radio />}
              label="Below 18 years old (marital / non-marital)"
            />
            <FormControlLabel
              value="Foreign Parent"
              control={<Radio />}
              label="One of the parents is a foreigner"
            />
            <FormControlLabel
              value="Out of town"
              control={<Radio />}
              label="Out of town registration"
            /> 
          </RadioGroup>
          <Typography variant="subtitle1" className="SubTitleBirthCertificate">
            Correction for Birth Certificate
          </Typography>
          <RadioGroup
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
             className="BirthDashRadioGroup"
          > 
            <FormControlLabel
              value="Clerical Error"
              control={<Radio />}
              label="Correction of Clerical Errors"
            /> 
            <FormControlLabel
              value="Sex DOB"
              control={<Radio />}
              label="Correction of Child’s Sex / Date of Birth-Day & Month"
            />
            <FormControlLabel
              value="First Name"
              control={<Radio />}
              label="Correction of First Name"
            />
          </RadioGroup>
        </Box>

        <Box className="Section">
          <Typography variant="h6" className="SectionTitle">
            Data Privacy Notice
          </Typography>
          <FormControlLabel
            control={<Radio checked={agreedPrivacy} onChange={() => setAgreedPrivacy(!agreedPrivacy)} />}
            label="I agree to the Data Privacy Notice"
              className="BirthDashRadioGroup" 
          />
        </Box>

        <Box className="Section">
          <Typography variant="h6" className="SectionTitle">
            Terms and Conditions
          </Typography>
          <FormControlLabel 
            control={<Radio checked={agreedTerms} onChange={() => setAgreedTerms(!agreedTerms)} />}
            label="I agree to the terms and conditions"
             className="BirthDashRadioGroup"
          />
        </Box>

        <Box className="Section">
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={!selectedOption || !agreedPrivacy || !agreedTerms}
            className="BirthNextButton"
          >
            Next
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default BirthCertificateDashboard;
