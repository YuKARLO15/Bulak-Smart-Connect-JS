import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Radio, RadioGroup, FormControlLabel, Typography, Box, Paper, Button } from '@mui/material';
import './BirthCertificateDashboard.css';
import NavBar from '../../../NavigationComponents/NavSide';

const applicationTypeMap = {
  'Request copy': 'Copy',
  'Clerical Error': 'Clerical Error',
  'Sex DOB': 'Sex DOB',
  'First Name': 'First Name',
  // Add other mappings as needed
};

const BirthCertificateDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [selectedOption, setSelectedOption] = useState('');
  const [agreedPrivacy, setAgreedPrivacy] = useState(false);
  const [hasVisitedPrivacyPolicy, setHasVisitedPrivacyPolicy] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const visited = sessionStorage.getItem('visitedPrivacyPolicy');
    if (visited === 'true') {
      setHasVisitedPrivacyPolicy(true);
      setAgreedPrivacy(true);
    }
  }, []);

  const handlePrivacyPolicyClick = () => {
    const policyWindow = window.open('/PrivacyPolicy', '_blank');
    if (policyWindow) {
      const checkClosed = setInterval(() => {
        if (policyWindow.closed) {
          clearInterval(checkClosed);
          sessionStorage.setItem('visitedPrivacyPolicy', 'true');
          setHasVisitedPrivacyPolicy(true);
          setAgreedPrivacy(true);
        }
      }, 1000);
    }
  };

  const handleNext = () => {
    if (!selectedOption) {
      alert('Please select an option before proceeding.');
      return;
    }
    sessionStorage.setItem('selectedBirthCertificateOption', selectedOption);

    // Route all copy/correction actions to the same form, passing type in state
    if (applicationTypeMap[selectedOption]) {
      localStorage.removeItem('isEditingBirthApplication');
      localStorage.removeItem('editingApplicationId');
      localStorage.removeItem('birthCertificateApplication');
      localStorage.removeItem('editingApplication');
      localStorage.removeItem('currentApplicationStatus');
      navigate('/RequestACopyBirthCertificate', { 
        state: { correctionType: applicationTypeMap[selectedOption] } 
      });
      return;
    }

    // For other options (if any)
    localStorage.removeItem('isEditingBirthApplication');
    localStorage.removeItem('editingApplicationId');
    localStorage.removeItem('birthCertificateApplication');
    localStorage.removeItem('editingApplication');
    localStorage.removeItem('currentApplicationStatus');
    navigate('/BirthCertificateForm');
  };

  return (
    <Box className={`BirthDashboardContainer ${isSidebarOpen ? 'sidebar-open' : ''}`}>
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
            onChange={e => setSelectedOption(e.target.value)}
            className="BirthDashRadioGroup"
          >
            <FormControlLabel
              value="Request copy"
              control={<Radio />}
              label="Regular application (0 - 1 month after birth) or request a copy of birth certificate"
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
            onChange={e => setSelectedOption(e.target.value)}
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
              label="Correction of Child's Sex / Date of Birth-Day & Month"
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
          <Box sx={{ mb: 2 }} className="dataPrivacyNoticeContainer">
            <Typography variant="body2" sx={{ mb: 1 }} className="dataPrivacyNotice">
              Please <strong>click</strong> and <strong>read </strong> our{' '}
              <Button
                variant="text"
                color="primary"
                onClick={handlePrivacyPolicyClick}
                sx={{ p: 0, textTransform: 'none', textDecoration: 'underline' }}
                className="dataPrivacyNoticeLink"
              >
                Data Privacy Policy and Terms and Conditions
              </Button>{' '}
              before proceeding. |{' '}
              <span className="Privacy-TagalogNotice">
                Pindutin at basahin ang aming{' '}
                <Button
                  variant="text"
                  color="primary"
                  onClick={handlePrivacyPolicyClick}
                  sx={{ p: 0, textTransform: 'none', textDecoration: 'underline' }}
                  className="dataPrivacyNoticeLink"
                >
                  Patakaran sa Pagkapribado ng Data
                </Button>{' '}
                bago magpatuloy.
              </span>
            </Typography>
            {!hasVisitedPrivacyPolicy && (
              <Typography variant="body2" color="error">
                You must read the Privacy Policy before you can agree.
              </Typography>
            )}
          </Box>
          <FormControlLabel
            control={
              <Radio
                checked={agreedPrivacy}
                onChange={() => setAgreedPrivacy(!agreedPrivacy)}
                disabled={!hasVisitedPrivacyPolicy}
              />
            }
            label={
              <Typography
                variant="body1"
                color={!hasVisitedPrivacyPolicy ? 'text.disabled' : 'text.primary'}
              >
                I agree to the Data Privacy Notice and Terms and Conditions | Sumasang-ayon ako sa Data Privacy Notice at Terms and Conditions 
              </Typography>
            }
            className="BirthDashRadioGroup"
          />
        </Box>
        <Box className="Section">
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={!selectedOption || !agreedPrivacy}
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