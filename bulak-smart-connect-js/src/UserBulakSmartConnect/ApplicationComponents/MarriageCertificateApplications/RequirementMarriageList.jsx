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
          <Typography variant="h5">Requirements for Application of Marriage </Typography>
        </Box>

        {/* General Requirements */}
        <Box className="marriage-requirement-section">
          <Typography variant="h6" className="marriage-requirement-section-title1">
            For Marriage License Registration 
          </Typography>
           <Typography variant="h6" className="marriage-requirement-section-title3">
          Mandatory Requirements
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
              
            </ListItem>
             <ListItem  className="marriage-requirement-nested-list">
                  <ListItemText 
                    primary="- Civil Wedding - P 650.00"
                    className="marriage-requirement-subitem" 
                  />
                </ListItem>
                <ListItem className="marriage-requirement-nested-list">
                  <ListItemText 
                    primary="- Church Wedding - P 400.00"
                    className="marriage-requirement-subitem" 
                  />
                </ListItem>
          </List>
          
       <Typography variant="h6" className="marriage-requirement-section-title3">
           Additional Requirements
          </Typography>
        </Box>


        {/* Foreign National Requirements */}
        <Box className="marriage-requirement-section2">
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

      

        {/* Widow/Widower Requirements */}
        <Box className="marriage-requirement-section2">
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



        {/* Annulled Requirements */}
        <Box className="marriage-requirement-section2">
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
          {/* Marriage Certificate Requirements */}
        <Box className="marriage-requirement-section">
          <Typography variant="h6" className="marriage-requirement-section-title1">
            For Marriage Certificate Registration
          </Typography>
           
          <List dense className="marriage-requirement-list">
            <ListItem>
              <ListItemIcon>
                <CheckCircleOutlineIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Marriage License" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleOutlineIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Valid ID of Bride" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleOutlineIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Valid ID of Groom" />
            </ListItem>
            <ListItem>
              <ListItemIcon>
                <CheckCircleOutlineIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText primary="Certificate of Marriage from the Officiant" />
            </ListItem>
          </List>
        </Box>
      </Paper>
    </Box>
  );
};

export default RequirementMarriageList;