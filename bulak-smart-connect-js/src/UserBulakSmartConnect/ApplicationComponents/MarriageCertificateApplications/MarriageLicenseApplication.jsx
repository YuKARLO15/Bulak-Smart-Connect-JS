import React, { useState } from 'react';
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
import FileUpload from '../FileUpload';
import NavBar from '../../../NavigationComponents/NavSide';
import './MarriageLicenseApplication.css';

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
  const [isSubmitted, setIsSubmitted] = useState(false);

  const [foreignNationalType, setForeignNationalType] = useState('');

  const [widowWidowerType, setWidowWidowerType] = useState('');
  const [annulledType, setAnnulledType] = useState('');

  const navigate = useNavigate();

  const handleFileUpload = (label, isUploaded) => {
    setUploadedFiles(prevState => ({
      ...prevState,
      [label]: isUploaded,
    }));
  };

  const isMandatoryComplete = mandatoryDocuments.every(doc => uploadedFiles[doc]);

  const isFormComplete =
    isMandatoryComplete &&
    (!foreignNational || foreignNationalType) &&
    (!widowWidower || widowWidowerType) &&
    (!annulled || annulledType);

  const handleSubmit = () => {
    if (isFormComplete) {
      setIsSubmitted(true);
      setTimeout(() => {
        navigate('/MarriageLicenseSummary');
      }, 2000);
    }
  };

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
          <FileUpload key={index} label={doc} onUpload={handleFileUpload} />
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
            onUpload={handleFileUpload}
          />
          <FileUpload label="Decree of Divorce from Court" onUpload={handleFileUpload} />
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
            onUpload={handleFileUpload}
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
            onUpload={handleFileUpload}
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
