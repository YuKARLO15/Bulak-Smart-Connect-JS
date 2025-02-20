import React, { useState } from "react";
import { Box, Button, Checkbox, FormControlLabel, Grid, Typography } from "@mui/material";
import FileUpload from "./FileUpload";
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

const ClericalErrorApplication= () => {
  const [selectedOptions, setSelectedOptions] = useState({
    firstName: false,
    lastName: false,
    middleName: false,
    others: false,
  });

  const handleCheckboxChange = (event) => {
    setSelectedOptions({ ...selectedOptions, [event.target.name]: event.target.checked });
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "auto", padding: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: "bold", textAlign: "center", marginBottom: 2, color: "#184a5b" }}>
        BIRTH CERTIFICATE APPLICATION
      </Typography>
      <Typography variant="subtitle1" sx={{ textAlign: "center", marginBottom: 2,  color: "#184a5b" }}>
        Application for Correction of Clerical Errors
      </Typography>
      <Box>
        <Typography variant="body1" sx={{ fontWeight: "bold", marginBottom: 1,  color: "#184a5b" }}>
          Select the applicable:
        </Typography>
        <Grid container spacing={1}>
          {Object.keys(selectedOptions).map((option) => (
            <Grid item xs={6} key={option}className="ClericalCB">
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
      {fileCategories.map((category, index) => (
        <FileUpload key={index} label={category} />
      ))}
    </Box>
  );
};

export default ClericalErrorApplication;
