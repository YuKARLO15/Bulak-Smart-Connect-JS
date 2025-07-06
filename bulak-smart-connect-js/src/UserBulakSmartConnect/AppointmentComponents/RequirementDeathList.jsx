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
import './RequirementDeathList.css';

const RequirementDeathList = () => {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Box className="requirement-container-death">
      <Paper elevation={3} className="requirement-paper-death">
        <Box className="requirement-main-title-death">
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            className="back-button-death"
          >
            Back
          </Button>
          <Typography variant="h5">Requirements for Registration of Death Certificate</Typography>
        </Box>

        {/* Death Registration */}
        <Box className="requirement-section-death">
          <Typography variant="h6" className="requirement-section-title-death">
            For Registration of Death (at the Local Civil Registry Office - LCRO)
          </Typography>

          <Box className="requirement-subsection-death">
            <Typography variant="subtitle1" className="requirement-subsection-title-death">
              Deadline: Must be registered within 30 days from the date of death.
            </Typography>
            <List dense className="requirement-list-death">
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Duly accomplished Certificate of Death (COD) – issued by:" />
              </ListItem>
              <ListItem className="requirement-subitem-death">
                <ListItemText primary="• Attending physician (for hospital deaths), or" />
              </ListItem>
              <ListItem className="requirement-subitem-death">
                <ListItemText primary="• Municipal Health Officer (for non-hospital deaths, e.g., at home)" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Valid ID of the informant (usually a family member)" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Barangay Certification (if death occurred at home)" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Funeral Contract (from the funeral service provider)" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Marriage Certificate (if the deceased is married)" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Valid ID of the deceased (if available)" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Affidavit of Delayed Registration (if registering after 30 days)" />
              </ListItem>
              
            </List>
          </Box>
        </Box>

        <Divider className="requirement-divider-death" />

        {/* Important Notes */}
        <Box className="requirement-section-death">
          <Typography variant="h6" className="requirement-section-title-death">
            Important Notes and Guidelines
          </Typography>

          <Box className="requirement-subsection-death">
            <Typography variant="subtitle1" className="requirement-subsection-title-death">
              I. General Guidelines
            </Typography>
            <List dense className="requirement-list-death">
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Death must be registered within 30 days from the date of death" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Registration beyond 30 days requires additional documentation" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Only immediate family members or authorized representatives can request copies" />
              </ListItem>
             
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Processing time may vary depending on the complexity of the case" />
              </ListItem>
            </List>
          </Box>

          <Box className="requirement-subsection-death">
            <Typography variant="subtitle1" className="requirement-subsection-title-death">
              II. Who Can Register Death
            </Typography>
            <List dense className="requirement-list-death">
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Spouse of the deceased" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Child, parent, or sibling of the deceased" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Person in charge of the burial" />
              </ListItem>
              <ListItem>
                <ListItemIcon>
                  <CheckCircleOutlineIcon fontSize="small" />
                </ListItemIcon>
                <ListItemText primary="Authorized representative with proper documentation" />
              </ListItem>
            </List>
          </Box>
        </Box>
      </Paper>
    </Box>
  );
};

export default RequirementDeathList;