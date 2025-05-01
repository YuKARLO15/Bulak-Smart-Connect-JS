import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Paper, Typography, FormControlLabel, Radio, RadioGroup, Button } from '@mui/material';
import './MarriageDashboard.css';
import NavBar from '../../../NavigationComponents/NavSide';

const MarriageDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);
  const [agreedTerms, setAgreedTerms] = useState(false);
  const navigate = useNavigate();

  const handleNext = () => {
    if (!selectedOption) {
      alert('Please select an application type before proceeding.');
      return;
    }

    if (!agreedPrivacy || !agreedTerms) {
      alert('You must agree to the Data Privacy Notice and Terms and Conditions to proceed.');
      return;
    }
    localStorage.setItem('selectedMarriageOption', selectedOption);
    navigate('/MarriageForm');
  };

  return (
    <Box className={`ContainerMDashboard ${isSidebarOpen ? 'sidebar-openMDashboard' : ''}`}>
      <NavBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      
      <Typography variant="h4" className="TitleMDashboard">
        Marriage Application
      </Typography>
      
      <Paper className="PaperMDashboard" elevation={3}>
        <Box className="SectionMDashboard">
          <Typography variant="h6" className="SectionTitleMDashboard">
            Applying for:
          </Typography>
          
          <RadioGroup
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
            className="RadioGroupMDashboard"
          >
            <FormControlLabel
              value="Marriage License"
              control={<Radio />}
              label="Application for Marriage License"
              className="RadioMDashboard"
            />
            
            <FormControlLabel
              value="Marriage Certificate"
              control={<Radio />}
              label="Application for Marriage Certificate"
              className="RadioMDashboard"
            />
          </RadioGroup>
        </Box>

        <Box className="SectionMDashboard">
          <Typography variant="h6" className="SectionTitleMDashboard">
            Data Privacy Notice
          </Typography>
          
          <FormControlLabel
            control={
              <Radio 
                checked={agreedPrivacy}
                onChange={() => setAgreedPrivacy(!agreedPrivacy)}
              />
            }
            label={
              <Box>
                <Typography>I agree to the Data Privacy Notice</Typography>
                <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
                  sumasang-ayon ako sa Patakaran ukol sa Pagkapribado ng Datos
                </Typography>
              </Box>
            }
            className="RadioMDashboard"
          />
        </Box>

        <Box className="SectionMDashboard">
          <Typography variant="h6" className="SectionTitleMDashboard">
            Terms and Condition
          </Typography>
          
          <FormControlLabel
            control={
              <Radio
                checked={agreedTerms}
                onChange={() => setAgreedTerms(!agreedTerms)}
              />
            }
            label={
              <Box>
                <Typography>I agree to the terms and conditions</Typography>
                <Typography variant="caption" sx={{ fontStyle: 'italic' }}>
                  sumasang-ayon ako sa mga termino at kondition
                </Typography>
              </Box>
            }
            className="RadioMDashboard"
          />
        </Box>

        <Box className="SectionMDashboard">
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={!selectedOption || !agreedPrivacy || !agreedTerms}
            className="NextButtonMDashboard"
          >
            Next
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};

export default MarriageDashboard;