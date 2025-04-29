import React, { useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Accordion, 
  AccordionSummary, 
  AccordionDetails,
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText,
  Divider,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Grid
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import InfoIcon from '@mui/icons-material/Info';
import DescriptionIcon from '@mui/icons-material/Description';
import './RequirementBirthListSample.css';

const birthCertificateRequirements = {
  regular: {
    type: "Regular application (0-1 month after birth)",
    requirements: [
      {
        title: "Valid ID",
        sampleImage: "./sample-images/valid-id-sample.jpg"
      },
      {
        title: "Marriage Certificate of Parents (if married)",
        description: "Copy of parents' marriage certificate from PSA/NSO or Local Civil Registry",
        sampleImage: "/sample-images/marriage-cert-sample.jpg"
      }
    ],
    fees: [
      { item: "Application Fee", amount: "₱150.00" },
      { item: "Documentary Stamp", amount: "₱30.00" }
    ],
    processingTime: "3-5 working days"
  },
  copy: {
    type: "Request a copy of birth certificate",
    requirements: [
      {
        title: "Valid ID of the applicant",
        description: "Photocopy of any government-issued ID (e.g. Driver's License, Passport, UMID, PhilSys ID)",
        sampleImage: "/sample-images/valid-id-sample.jpg"
      },
      {
        title: "Authorization Letter (if not the owner)",
        description: "If you're requesting for someone else, provide an authorization letter with valid IDs of both parties",
        sampleImage: "/sample-images/authorization-letter-sample.jpg"
      }
    ],
    fees: [
      { item: "Copy Issuance Fee", amount: "₱140.00 per copy" }
    ],
    processingTime: "1-2 working days"
  },
  above18Marital: {
    type: "Delayed registration (Above 18 years old - marital)",
    requirements: [
      {
        title: "Negative Certification from PSA",
        description: "Certification that no previous birth record exists in PSA database",
        sampleImage: "/sample-images/psa-negative-cert.jpg"
      },
      {
        title: "Affidavit of (2) Disinterested Persons with ID",
        description: "Notarized affidavit from two individuals not related to the applicant",
        sampleImage: "/sample-images/affidavit-disinterested.jpg"
      },
      {
        title: "Certificate of Marriage (if married)",
        description: "Marriage certificate of the applicant if applicable",
        sampleImage: "/sample-images/marriage-cert-sample.jpg"
      },
      {
        title: "National ID or ePhil ID",
        description: "Photocopy of the applicant's valid National ID or ePhil ID",
        sampleImage: "/sample-images/national-id-sample.jpg"
      },
      {
        title: "Barangay Certification of Residency",
        description: "Certification from local barangay confirming the applicant's residency",
        sampleImage: "/sample-images/barangay-cert-sample.jpg"
      },
      {
        title: "Unedited front-facing photo 2x2, white background",
        description: "Recent 2x2 photograph of the applicant",
        sampleImage: "/sample-images/2x2-photo-sample.jpg"
      },
      {
        title: "Documentary evidences of parents",
        description: "Documents proving the identity and relationship of parents",
        sampleImage: "/sample-images/documentary-evidence.jpg"
      },
      {
        title: "Certificate of Marriage of Parents",
        description: "Marriage certificate of the parents from PSA/NSO",
        sampleImage: "/sample-images/parents-marriage-cert.jpg"
      },
      {
        title: "Personal Appearance of Father or Affidavit",
        description: "Personal appearance or notarized affidavit explaining why personal appearance is not possible",
        sampleImage: "/sample-images/affidavit-appearance.jpg"
      }
    ],
    additionalEvidences: [
      "Baptismal Certificate with date of issue",
      "School records (Form 137 or Form 138)",
      "Medical records",
      "Employment records",
      "Insurance policy",
      "Voter's ID/Voter's registration record"
    ],
    fees: [
      { item: "Filing Fee", amount: "₱300.00" },
      { item: "Newspaper Publication", amount: "₱3,500.00" },
      { item: "Other Fees (notarized, PSA copy)", amount: "₱500.00" }
    ],
    processingTime: "4-6 months"
  },
  above18NonMarital: {
    type: "Delayed registration (Above 18 years old - non-marital)",
    requirements: [
      {
        title: "Negative Certification from PSA",
        description: "Certification that no previous birth record exists in PSA database",
        sampleImage: "/sample-images/psa-negative-cert.jpg"
      },
      {
        title: "Affidavit of (2) Disinterested Persons with ID",
        description: "Notarized affidavit from two individuals not related to the applicant",
        sampleImage: "/sample-images/affidavit-disinterested.jpg"
      },
      {
        title: "Certificate of Marriage (if married)",
        description: "Marriage certificate of the applicant if applicable",
        sampleImage: "/sample-images/marriage-cert-sample.jpg"
      },
      {
        title: "National ID or ePhil ID",
        description: "Photocopy of the applicant's valid National ID or ePhil ID",
        sampleImage: "/sample-images/national-id-sample.jpg"
      },
      {
        title: "Barangay Certification of Residency",
        description: "Certification from local barangay confirming the applicant's residency",
        sampleImage: "/sample-images/barangay-cert-sample.jpg"
      },
      {
        title: "Unedited front-facing photo 2x2, white background",
        description: "Recent 2x2 photograph of the applicant",
        sampleImage: "/sample-images/2x2-photo-sample.jpg"
      },
      {
        title: "Documentary evidences of parents",
        description: "Documents proving the identity and relationship of parents",
        sampleImage: "/sample-images/documentary-evidence.jpg"
      },
      {
        title: "Personal Appearance of the Father or Affidavit of Admission of Paternity",
        description: "Notarized affidavit from father acknowledging paternity",
        sampleImage: "/sample-images/paternity-affidavit.jpg"
      }
    ],
    additionalEvidences: [
      "Baptismal Certificate with date of issue",
      "School records (Form 137 or Form 138)",
      "Medical records",
      "Employment records",
      "Insurance policy",
      "Voter's ID/Voter's registration record"
    ],
    fees: [
      { item: "Filing Fee", amount: "₱300.00" },
      { item: "Newspaper Publication", amount: "₱3,500.00" },
      { item: "Other Fees (notarized, PSA copy)", amount: "₱500.00" }
    ],
    processingTime: "4-6 months"
  },
  below18Marital: {
    type: "Delayed registration (Below 18 years old - marital)",
    requirements: [
      {
        title: "Negative Certification from PSA",
        description: "Certification that no previous birth record exists in PSA database",
        sampleImage: "/sample-images/psa-negative-cert.jpg"
      },
      {
        title: "Certificate of Live Birth (COLB)",
        description: "Original copy duly signed by the attendant at birth",
        sampleImage: "/sample-images/colb-sample.jpg"
      },
      {
        title: "Baptismal Certificate or Certification",
        description: "Certificate from church showing baptism record",
        sampleImage: "/sample-images/baptismal-cert.jpg"
      },
      {
        title: "Valid ID of the Parent/Guardian",
        description: "Photocopy of government-issued ID of the parent or guardian",
        sampleImage: "/sample-images/valid-id-sample.jpg"
      },
      {
        title: "Certificate of Marriage of Parents",
        description: "Marriage certificate of the parents from PSA/NSO",
        sampleImage: "/sample-images/parents-marriage-cert.jpg"
      }
    ],
    fees: [
      { item: "Registration Fee", amount: "₱250.00" },
      { item: "Documentary Stamp", amount: "₱30.00" }
    ],
    processingTime: "15-30 working days"
  },
  below18NonMarital: {
    type: "Delayed registration (Below 18 years old - non-marital)",
    requirements: [
      {
        title: "Negative Certification from PSA",
        description: "Certification that no previous birth record exists in PSA database",
        sampleImage: "/sample-images/psa-negative-cert.jpg"
      },
      {
        title: "Certificate of Live Birth (COLB)",
        description: "Original copy duly signed by the attendant at birth",
        sampleImage: "/sample-images/colb-sample.jpg"
      },
      {
        title: "Baptismal Certificate or Certification",
        description: "Certificate from church showing baptism record",
        sampleImage: "/sample-images/baptismal-cert.jpg"
      },
      {
        title: "Valid ID of the Mother/Guardian",
        description: "Photocopy of government-issued ID of the mother or guardian",
        sampleImage: "/sample-images/valid-id-sample.jpg"
      },
      {
        title: "Affidavit of Admission of Paternity",
        description: "Notarized document from the father acknowledging paternity (if applicable)",
        sampleImage: "/sample-images/paternity-affidavit.jpg"
      }
    ],
    fees: [
      { item: "Registration Fee", amount: "₱250.00" },
      { item: "Documentary Stamp", amount: "₱30.00" }
    ],
    processingTime: "15-30 working days"
  },
  foreignParent: {
    type: "Delayed registration (One of the parents is a foreigner)",
    requirements: [
      {
        title: "Negative Certification from PSA",
        description: "Certification that no previous birth record exists in PSA database",
        sampleImage: "/sample-images/psa-negative-cert.jpg"
      },
      {
        title: "Certificate of Live Birth (COLB)",
        description: "Original copy duly signed by the attendant at birth",
        sampleImage: "/sample-images/colb-sample.jpg"
      },
      {
        title: "Valid Passport of Foreign Parent",
        description: "Copy of the foreign parent's valid passport",
        sampleImage: "/sample-images/passport-sample.jpg"
      },
      {
        title: "Report of Birth at Embassy",
        description: "If applicable, report of birth filed at the embassy/consulate",
        sampleImage: "/sample-images/report-birth-embassy.jpg"
      },
      {
        title: "Certificate of Marriage of Parents",
        description: "If married, marriage certificate of the parents",
        sampleImage: "/sample-images/parents-marriage-cert.jpg"
      },
      {
        title: "Valid ID of Filipino Parent",
        description: "Photocopy of government-issued ID of the Filipino parent",
        sampleImage: "/sample-images/valid-id-sample.jpg"
      }
    ],
    fees: [
      { item: "Registration Fee", amount: "₱300.00" },
      { item: "Documentary Stamp", amount: "₱30.00" }
    ],
    processingTime: "30-60 working days"
  },
  outOfTown: {
    type: "Out of town registration",
    requirements: [
      {
        title: "Certificate of Live Birth (COLB)",
        description: "Original copy duly signed by the attendant at birth",
        sampleImage: "/sample-images/colb-sample.jpg"
      },
      {
        title: "Valid ID of the applicant",
        description: "Photocopy of government-issued ID of the applicant",
        sampleImage: "/sample-images/valid-id-sample.jpg"
      },
      {
        title: "Barangay Certification",
        description: "Certification from barangay indicating residence",
        sampleImage: "/sample-images/barangay-cert-sample.jpg"
      },
      {
        title: "Special Power of Attorney (if applicable)",
        description: "If representative is filing on behalf of the document owner",
        sampleImage: "/sample-images/spa-sample.jpg"
      }
    ],
    fees: [
      { item: "Registration Fee", amount: "₱300.00" },
      { item: "Documentary Stamp", amount: "₱30.00" },
      { item: "Processing Fee", amount: "₱100.00" }
    ],
    processingTime: "15-30 working days"
  },
  corrections: {
    type: "Corrections for Birth Certificate",
    requirements: [
      {
        title: "Original PSA Birth Certificate",
        description: "Authenticated copy to be corrected",
        sampleImage: "/sample-images/psa-birth-cert.jpg"
      },
      {
        title: "Valid ID of the applicant",
        description: "Photocopy of government-issued ID of the applicant",
        sampleImage: "/sample-images/valid-id-sample.jpg"
      },
      {
        title: "Supporting documents proving correct information",
        description: "Documents that support the correction being requested",
        sampleImage: "/sample-images/supporting-docs.jpg"
      },
      {
        title: "Affidavit of Correction",
        description: "Notarized affidavit explaining the correction needed",
        sampleImage: "/sample-images/affidavit-correction.jpg"
      }
    ],
    fees: [
      { item: "Filing Fee", amount: "₱1,000.00 to ₱3,000.00 (varies by correction type)" },
      { item: "Processing Fee", amount: "₱200.00" }
    ],
    processingTime: "3-6 months"
  }
};

// The main requirements component that can be reused across application types
const RequirementBirthList = ({ applicationType }) => {
  const [open, setOpen] = useState(false);
  const [currentSample, setCurrentSample] = useState({
    title: '',
    image: '',
    description: ''
  });

  // Get the requirements based on application type
  const requirementData = birthCertificateRequirements[applicationType] || {};

  const handleSampleClick = (title, image, description) => {
    setCurrentSample({
      title,
      image,
      description
    });
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  if (!requirementData.type) {
    return (
      <Box className="RequirementContainer">
        <Typography variant="body1" color="error">
          Requirements for this application type are not available.
        </Typography>
      </Box>
    );
  }

  return (
    <Box className="RequirementContainer">
      <Paper elevation={3} className="RequirementPaper">
        <Typography variant="h5" className="RequirementTitle">
          {requirementData.type}
        </Typography>
        
        <Divider className="RequirementDivider" />
        
        <Typography variant="h6" className="RequirementSubtitle">
          Required Documents
        </Typography>
        
        <List>
          {requirementData.requirements.map((req, index) => (
            <ListItem key={index} className="RequirementListItem">
              <ListItemIcon>
                <CheckCircleOutlineIcon color="primary" />
              </ListItemIcon>
              <ListItemText 
                primary={req.title} 
                secondary={req.description} 
                className="RequirementText"
              />
              <Button 
                variant="outlined" 
                size="small" 
                onClick={() => handleSampleClick(req.title, req.sampleImage, req.description)}
                className="SampleButton"
              >
                Sample
              </Button>
            </ListItem>
          ))}
        </List>
        
        {requirementData.additionalEvidences && (
          <>
            <Accordion className="AdditionalDocumentsAccordion">
              <AccordionSummary 
                expandIcon={<ExpandMoreIcon />}
                className="AccordionSummary"
              >
                <Typography variant="subtitle1" className="AccordionTitle">
                  <InfoIcon fontSize="small" style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                  Additional Documentary Evidence (Any two of the following)
                </Typography>
              </AccordionSummary>
              <AccordionDetails>
                <List dense>
                  {requirementData.additionalEvidences.map((evidence, index) => (
                    <ListItem key={index}>
                      <ListItemIcon>
                        <DescriptionIcon fontSize="small" color="action" />
                      </ListItemIcon>
                      <ListItemText primary={evidence} />
                    </ListItem>
                  ))}
                </List>
              </AccordionDetails>
            </Accordion>
          </>
        )}
        
        <Box className="FeesAndTimeSection">
          <Typography variant="h6" className="RequirementSubtitle">
            Fees and Processing Time
          </Typography>
          
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" className="FeesTitle">
                Fees:
              </Typography>
              <List dense>
                {requirementData.fees.map((fee, index) => (
                  <ListItem key={index} className="FeeItem">
                    <ListItemText primary={`${fee.item}: ${fee.amount}`} />
                  </ListItem>
                ))}
              </List>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <Typography variant="subtitle1" className="ProcessingTimeTitle">
                Processing Time:
              </Typography>
              <Typography variant="body1" className="ProcessingTimeText">
                {requirementData.processingTime}
              </Typography>
            </Grid>
          </Grid>
        </Box>
      </Paper>
      
      {/* Sample Document Dialog */}
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        className="SampleDialog"
      >
        <DialogTitle className="SampleDialogTitle">
          {currentSample.title}
        </DialogTitle>
        <DialogContent className="SampleDialogContent">
          <img 
            src={currentSample.image} 
            alt={currentSample.title}
            className="SampleImage" 
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = '/sample-images/placeholder.jpg';
              e.target.style.opacity = 0.5;
            }}
          />
          <Typography variant="body1" className="SampleDescription">
            {currentSample.description}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default RequirementBirthList;
export { birthCertificateRequirements };