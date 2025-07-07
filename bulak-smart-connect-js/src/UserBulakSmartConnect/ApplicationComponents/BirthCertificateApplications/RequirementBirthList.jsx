import React from 'react';
import {
  Box,
  Typography,
  Paper,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
} from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useNavigate } from 'react-router-dom';
import './RequirementBirthList.css';

const RequirementBirthList = () => {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };
  return (
    <Box className="requirement-container">
      <Paper elevation={3} className="requirement-paper">
        <Box className="requirement-main-title">
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            className="back-button"
          >
            Back
          </Button>
          <Typography variant="h5">Requirements for Application of Birth Certificate</Typography>
        </Box>

        {/* Regular Birth Certificate */}
        <Box className="requirement-section">
          <Typography variant="h6" className="requirement-section-title">
            Application for Regular Birth Certificate
          </Typography>

          <Box className="requirement-subsection">
            <Typography variant="subtitle1" className="requirement-subsection-title">
              I. Regular application (0 - 1 month after birth) or request a copy of birth
              certificate
            </Typography>
            <List dense className="requirement-list">
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Valid ID of parent or document owner" />
              </ListItem>
              <ListItem className="requirement-subitem">
                <ListItemText primary="• Philippine Passport (issued by DFA)" />
              </ListItem>
              <ListItem className="requirement-subitem">
                <ListItemText primary="• Driver's License (issued by LTO) — includes Student Permit, Non-Professional, and Professional" />
              </ListItem>
              <ListItem className="requirement-subitem">
                <ListItemText primary="• Unified Multi-Purpose ID (UMID) — SSS, GSIS, Pag-IBIG" />
              </ListItem>
              <ListItem className="requirement-subitem">
                <ListItemText primary="• Philippine National ID (PhilSys ID)" />
              </ListItem>
              <ListItem className="requirement-subitem">
                <ListItemText primary="• Social Security System (SSS) Card (with photo and signature)" />
              </ListItem>
              <ListItem className="requirement-subitem">
                <ListItemText primary="• Professional Regulation Commission (PRC) ID" />
              </ListItem>
              <ListItem className="requirement-subitem">
                <ListItemText primary="• Government Service Insurance System (GSIS) eCard" />
              </ListItem>
              <ListItem className="requirement-subitem">
                <ListItemText primary="• Voter's ID or Voter's Certification (issued by COMELEC)" />
              </ListItem>
              <ListItem className="requirement-subitem">
                <ListItemText primary="• Postal ID (newer, improved version with QR code and biometrics)" />
              </ListItem>
              <ListItem className="requirement-subitem">
                <ListItemText primary="• Senior Citizen ID (issued by the Office of Senior Citizen Affairs [OSCA])" />
              </ListItem>
              <ListItem className="requirement-subitem">
                <ListItemText primary="• Persons with Disability (PWD) ID (issued by LGU)" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Authorization Letter (If Parent or document owner is not physically present)" />
              </ListItem>
            </List>
          </Box>
        </Box>

        <Divider className="requirement-divider" />

        {/* Delayed Registration */}
        <Box className="requirement-section">
          <Typography variant="h6" className="requirement-section-title">
            Application for Delayed Registration Birth Certificate (more than a month after birth)
          </Typography>

          <Box className="requirement-subsection">
            <Typography variant="subtitle1" className="requirement-subsection-title">
              I. Above 18 years old (marital / non-marital)
            </Typography>
            <List dense className="requirement-list">
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Negative Certification from PSA" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Affidavit of (2) Disinterested Persons with ID" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Certificate of Marriage, if married" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="National ID or ePhil ID" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Barangay Certification of Residency" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Unedited front-facing photo 2x2, white background" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Documentary evidences of parents" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Certificate of Marriage of Parents" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Personal Appearance of Father or Affidavit of the document owner registrant stating why the document owner cannot appear personally; and death certificate in case the document owner is deceased" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Personal Appearance of the Father or Affidavit of Admission of Paternity executed before a Notary Public (for non-marital)" />
              </ListItem>
            </List>
          </Box>

          <Box className="requirement-subsection">
            <Typography variant="subtitle1" className="requirement-subsection-title">
              II. Below 18 years old (marital / non-marital)
            </Typography>
            <List dense className="requirement-list">
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Negative Certification from PSA" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Two (2) Documentary Evidence" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Affidavit of (2) Disinterested Persons with ID" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Certificate of Marriage or parents, if married" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="National ID or ePhil ID" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Barangay Certification of Residency" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Unedited front-facing photo 2x2, white background" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Documentary evidences of parents" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Affidavit of Whereabouts of the Mother" />
              </ListItem>
            </List>
          </Box>

          <Box className="requirement-subsection">
            <Typography variant="subtitle1" className="requirement-subsection-title">
              III. Out of town registration
            </Typography>
            <List dense className="requirement-list">
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Negative Certification from PSA" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Self-Affidavit of Out of Town Registration attested by 2 witnesses with ID" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Barangay Certification issued by the Punong Barangay as proof of residency and with statement on facts of birth" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="National ID (if not registered, register first)" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Unedited 2x2 front-facing photo (2 pcs) taken within 3 months, white background" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Barangay Certification of Residency" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Transmittal through the PSO" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Documentary evidences of parents" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Certificate of Live Birth (COLB)" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Government Issued ID" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Marriage Certificate" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Certificate of Death (if deceased)" />
              </ListItem>
            </List>

            <Typography variant="subtitle2" className="requirement-subheading">
              Documentary evidence of child / applicant:
            </Typography>
            <List dense className="requirement-list">
              <ListItem className="requirement-subitem">
                <ListItemText primary="• Baptismal Certificate" />
              </ListItem>
              <ListItem className="requirement-subitem">
                <ListItemText primary="• Marriage Certificate" />
              </ListItem>
              <ListItem className="requirement-subitem">
                <ListItemText primary="• School Records" />
              </ListItem>
              <ListItem className="requirement-subitem">
                <ListItemText primary="• Income Tax Return" />
              </ListItem>
              <ListItem className="requirement-subitem">
                <ListItemText primary="• PhilHealth MDR" />
              </ListItem>
              <ListItem className="requirement-subitem">
                <ListItemText primary="• Voter's Registration Record (COMELEC)" />
              </ListItem>
            </List>
          </Box>

          <Box className="requirement-subsection">
            <Typography variant="subtitle1" className="requirement-subsection-title">
              IV. One parent is foreigner
            </Typography>
            <List dense className="requirement-list">
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Negative Certification from PSA" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Self-Affidavit of Out of Town Registration attested by 2 witnesses with ID" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Barangay Certification issued by the Punong Barangay as proof of residency and with statement on facts of birth" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="National ID (if not registered, register first)" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Unedited 2x2 front-facing photo (2 pcs) taken within 3 months, white background" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Barangay Certification of Residency" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Transmittal through the PSO" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Documentary evidences of parents" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Certificate of Live Birth (COLB)" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Government Issued ID" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Marriage Certificate" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Certificate of Death (if deceased)" />
              </ListItem>
            </List>

            <Typography variant="subtitle2" className="requirement-subheading">
              Documentary evidence of child / applicant:
            </Typography>
            <List dense className="requirement-list">
              <ListItem className="requirement-subitem">
                <ListItemText primary="• Baptismal Certificate" />
              </ListItem>
              <ListItem className="requirement-subitem">
                <ListItemText primary="• Marriage Certificate" />
              </ListItem>
              <ListItem className="requirement-subitem">
                <ListItemText primary="• School Records" />
              </ListItem>
              <ListItem className="requirement-subitem">
                <ListItemText primary="• Income Tax Return" />
              </ListItem>
              <ListItem className="requirement-subitem">
                <ListItemText primary="• PhilHealth MDR" />
              </ListItem>
              <ListItem className="requirement-subitem">
                <ListItemText primary="• Voter's Registration Record (COMELEC)" />
              </ListItem>
            </List>

            <Typography variant="subtitle2" className="requirement-subheading">
              Additional Supporting Documents:
            </Typography>
            <List dense className="requirement-list">
              <ListItem className="requirement-subitem">
                <ListItemText primary="• Valid Passport or BI Clearance or ACR I-CARD of the Foreign Parent" />
              </ListItem>
            </List>
          </Box>
        </Box>

        <Divider className="requirement-divider" />

        {/* Correction for Birth Certificate */}
        <Box className="requirement-section">
          <Typography variant="h6" className="requirement-section-title">
            Application for Correction for Birth Certificate
          </Typography>

          <Box className="requirement-subsection">
            <Typography variant="subtitle1" className="requirement-subsection-title">
              I. Correction of First Name
            </Typography>

            <Typography variant="subtitle2" className="requirement-subheading">
              MANDATORY DOCUMENTS:
            </Typography>
            <List dense className="requirement-list">
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="NBI Clearance" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="PNP Clearance" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Employer's Clearance / Business Records / Affidavit of Unemployment" />
              </ListItem>
            </List>

            <Typography variant="subtitle2" className="requirement-subheading">
              SUPPORTING DOCUMENTS:
            </Typography>
            <List dense className="requirement-list">
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="School Records" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Church Records" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Birth and/or Church Certificates of Child/Children" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Voter's Record" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Employment Records" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Identification Cards - National ID, Driver's License, Senior's ID, etc." />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Others - Passport, Insurance Documents, Member's Data Record" />
              </ListItem>
            </List>
          </Box>

          <Box className="requirement-subsection">
            <Typography variant="subtitle1" className="requirement-subsection-title">
              II. Correction of Child's Sex / Date of Birth-Day & Month
            </Typography>

            <Typography variant="subtitle2" className="requirement-subheading">
              MANDATORY DOCUMENTS:
            </Typography>
            <List dense className="requirement-list">
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="NBI Clearance" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="PNP Clearance" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Employer's Clearance / Business Records / Affidavit of Unemployment" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Earliest church record/s or certificate of no church record/s available and affidavit of no church record/s available" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Earnest school record (form 137A) OR certificate of no school record/s available and affidavit of no school record available" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Medical record/s OR affidavit of no medical record/s available" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Certification from Dr. Reginell Nuñez or Dr. Jeanette Dela Cruz - that the document owner is MALE or FEMALE and has not underwent sex transplant" />
              </ListItem>
            </List>

            <Typography variant="subtitle2" className="requirement-subheading">
              SUPPORTING DOCUMENTS:
            </Typography>
            <List dense className="requirement-list">
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Other School Records" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Other Church Records" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Birth and/or Church Certificates of Child/Children" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Voter's Record" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Employment Records" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Identification Cards - National ID, Driver's License, Senior's ID, etc." />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Others - Passport, Insurance Documents, Member's Data Record" />
              </ListItem>
            </List>
          </Box>

          <Box className="requirement-subsection">
            <Typography variant="subtitle1" className="requirement-subsection-title">
              III. Correction of Clerical Errors
            </Typography>
            <List dense className="requirement-list">
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="PSA copy of wrong document" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="MCA copy of wrong document" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Church record document owner & relatives" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="School record document owner & relatives" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Marriage certificate document owner (if married) & relatives" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Birth certificate document owner & relatives" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Comelec record document owner & relatives" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Identification cards" />
              </ListItem>
            </List>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default RequirementBirthList;
