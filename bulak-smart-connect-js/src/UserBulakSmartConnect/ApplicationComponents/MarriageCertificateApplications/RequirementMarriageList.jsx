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
import './RequirementMarriageList.css';

const RequirementMarriageList = () => {
  const navigate = useNavigate();
  const handleBack = () => {
    navigate(-1);
  };

  return (
    <Box className="marriage-requirement-container">
      <Paper elevation={3} className="marriage-requirement-paper">
        <Box className="marriage-requirement-main-title">
          <Button
            variant="contained"
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            className="marriage-back-button"
          >
            Back
          </Button>
          <Typography variant="h5">Requirements for Application of Marriage License</Typography>
        </Box>

        {/* General Requirements */}
        <Box className="marriage-requirement-section">
          <Typography variant="h6" className="marriage-requirement-section-title">
            Basic Requirements
          </Typography>
           
          <List dense className="marriage-requirement-list">
            <ListItem>
              <ListItemIcon>
                <CheckCircleOutlineIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="1. Birth or Baptismal certificate" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleOutlineIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="2. Seminar (DSWD- Wed. 8:00am)" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleOutlineIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="3. CENOMAR (PSA)" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleOutlineIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="4. Official Receipt" />
              <List dense className="marriage-requirement-nested-list">
                <ListItem>
                  <ListItemText 
                    primary="- Civil Wedding - P 650.00"
                    className="marriage-requirement-subitem" 
                  />
                </ListItem>
                <ListItem>
                  <ListItemText 
                    primary="- Church Wedding - P 400.00"
                    className="marriage-requirement-subitem" 
                  />
                </ListItem>
              </List>
            </ListItem>
          </List>
        </Box>

        <Divider />

        {/* Foreign National Requirements */}
        <Box className="marriage-requirement-section">
          <Typography variant="h6" className="marriage-requirement-section-title">
            For Foreign National
          </Typography>
           
          <List dense className="marriage-requirement-list">
            <ListItem>
              <ListItemIcon>
                <CheckCircleOutlineIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Legal Capacity from their embassy (Manila)" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleOutlineIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Decree of Divorce from court (if applicable)" />
            </ListItem>
          </List>
        </Box>

        <Divider />

        {/* Widow/Widower Requirements */}
        <Box className="marriage-requirement-section">
          <Typography variant="h6" className="marriage-requirement-section-title">
            For Widow/Widower
          </Typography>
           
          <List dense className="marriage-requirement-list">
            <ListItem>
              <ListItemIcon>
                <CheckCircleOutlineIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Registered Death certificate of previous spouse" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleOutlineIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="CEMAR / CENOMAR from NSO (PSA)" />
            </ListItem>
          </List>
        </Box>

        <Divider />

        {/* Annulled Requirements */}
        <Box className="marriage-requirement-section">
          <Typography variant="h6" className="marriage-requirement-section-title">
            For annulled
          </Typography>
           
          <List dense className="marriage-requirement-list">
            <ListItem>
              <ListItemIcon>
                <CheckCircleOutlineIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Decree of annulment from court with FINALITY" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleOutlineIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="CEMAR / CENOMAR from NSO (PSA)" />
            </ListItem>
          </List>
        </Box>
      </Paper>
    </Box>
  );
};

export default RequirementMarriageList;




