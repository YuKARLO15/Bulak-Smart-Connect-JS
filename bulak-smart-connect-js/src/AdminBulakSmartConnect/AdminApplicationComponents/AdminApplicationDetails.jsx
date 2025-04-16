import React, { useState, useEffect } from "react";
import { 
  Box, 
  Typography, 
  Paper, 
  Grid, 
  Button, 
  Divider, 
  CircularProgress, 
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom"; 
import "./AdminApplicationDetails.css";

const AdminBirthApplicationView = () => {
  const { id } = useParams(); 
  const navigate = useNavigate(); 
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusUpdateDialog, setStatusUpdateDialog] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [statusMessage, setStatusMessage] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");

  useEffect(() => {
    try {
   
      const storedApplications = JSON.parse(localStorage.getItem("applications")) || [];
      const birthApplications = storedApplications.filter(app => app.type === "Birth Certificate");
      setApplications(birthApplications);

      let targetApp;
      

      if (id) {
        targetApp = birthApplications.find(app => app.id === id);
      } else {
   
        const currentAppId = localStorage.getItem("currentApplicationId");
        if (currentAppId) {
          targetApp = birthApplications.find(app => app.id === currentAppId);
        }
      }
      
    
      if (targetApp) {
        setSelectedApplication(targetApp);
      } else if (birthApplications.length > 0) {
        setSelectedApplication(birthApplications[0]);
      }
    } catch (err) {
      console.error("Error loading applications:", err);
      setError("Error loading applications: " + err.message);
    } finally {
      setLoading(false);
    }

   
    window.addEventListener('storage', handleStorageUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageUpdate);
    };
  }, [id]);

  const handleStorageUpdate = () => {
    try {
      const storedApplications = JSON.parse(localStorage.getItem("applications")) || [];
      const birthApplications = storedApplications.filter(app => app.type === "Birth Certificate");
      setApplications(birthApplications);
      
    
      if (selectedApplication) {
        const updatedSelectedApp = birthApplications.find(app => app.id === selectedApplication.id);
        if (updatedSelectedApp) {
          setSelectedApplication(updatedSelectedApp);
        }
      }
    } catch (err) {
      console.error("Error updating applications from storage:", err);
    }
  };

  const handleApplicationClick = (application) => {
    setSelectedApplication(application);

    navigate(`/ApplicationDetails/${application.id}`, { replace: true });
  };

  const handleOpenStatusDialog = () => {
    setNewStatus(selectedApplication.status);
    setStatusMessage(selectedApplication.statusMessage || "");
    setStatusUpdateDialog(true);
  };

  const handleStatusChange = (event) => {
    setNewStatus(event.target.value);
  };

  const handleMessageChange = (event) => {
    setStatusMessage(event.target.value);
  };

  const handleFilterChange = (event) => {
    setFilterStatus(event.target.value);
  };

  const handleUpdateStatus = () => {
    try {
    
      const allApplications = JSON.parse(localStorage.getItem("applications")) || [];
      
   
      const updatedApplications = allApplications.map(app => {
        if (app.id === selectedApplication.id) {
          return {
            ...app,
            status: newStatus,
            statusMessage: statusMessage,
            lastUpdated: new Date().toLocaleDateString()
          };
        }
        return app;
      });
      
      
      localStorage.setItem("applications", JSON.stringify(updatedApplications));
      
     
      const updatedBirthApplications = updatedApplications.filter(app => app.type === "Birth Certificate");
      setApplications(updatedBirthApplications);
      

      const updated = updatedBirthApplications.find(app => app.id === selectedApplication.id);
      setSelectedApplication(updated);
      
      setStatusUpdateDialog(false);
      
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      console.error("Error updating application status:", err);
      setError("Error updating application status: " + err.message);
    }
  };



  const formatDate = (month, day, year) => {
    if (!month || !day || !year) return "N/A";
    return `${month} ${day}, ${year}`;
  };

  const filteredApplications = applications.filter(app => {
    if (filterStatus === "All") return true;
    return app.status === filterStatus;
  });

  if (loading) {
    return (
      <Box className="LoadingContainerAdminAppForm">
        <CircularProgress />
        <Typography>Loading applications...</Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Box className="ErrorContainerAdminAppForm">
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }



      
  return (
    <Box className="AdminMainContainerAdminAppForm">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h4" className="AdminTitleAdminAppForm">
            Document Application Details
          </Typography>
        </Grid>
        
      
        <Grid item xs={12} md={4}>
          <Paper elevation={3} className="ApplicationsListPaperAdminAppForm">
            <Box className="FilterContainerAdminAppForm">
              <Typography variant="h6">Filter Applications</Typography>
              <FormControl fullWidth margin="normal">
                <InputLabel>Status</InputLabel>
                <Select
                  value={filterStatus}
                  onChange={handleFilterChange}
                  label="Status"
                >
                  <MenuItem value="All">All</MenuItem>
                  <MenuItem value="Pending">Pending</MenuItem>
                  <MenuItem value="Approved">Approved</MenuItem>
                  <MenuItem value="Decline">Decline</MenuItem>
                  <MenuItem value="Requires Additional Info">Requires Additional Info</MenuItem>
                </Select>
              </FormControl>
            </Box>
            
            <Typography variant="h6" className="ApplicationsListTitleAdminAppForm">
              Applications ({filteredApplications.length})
            </Typography>
            
            {filteredApplications.length === 0 ? (
              <Box className="NoApplicationsMessageAdminAppForm">
                <Typography>No applications found</Typography>
              </Box>
            ) : (
              <Box className="ApplicationsListAdminAppForm">
                {filteredApplications.map((app) => (
                  <Paper 
                    key={app.id}
                    elevation={2}
                    className={`ApplicationListItemAdminAppForm ${selectedApplication && selectedApplication.id === app.id ? 'selectedAdminAppForm' : ''}`}
                    onClick={() => handleApplicationClick(app)}
                  >
                    <Typography variant="subtitle1" className="ApplicationNameAdminAppForm">
                      {app.formData.firstName} {app.formData.lastName}
                    </Typography>
                    <Typography variant="body2" className="ApplicationIdAdminAppForm">
                      ID: {app.id}
                    </Typography>
                    <Typography variant="body2" className="ApplicationDateAdminAppForm">
                      Submitted: {app.date}
                    </Typography>
                    <Typography variant="body2" className={`ApplicationStatusAdminAppForm status-${app.status.toLowerCase().replace(/\s+/g, '-')}AdminAppForm`}>
                      Status: {app.status}
                    </Typography>
                  </Paper>
                ))}
              </Box>
            )}
          </Paper>
        </Grid>
        
       
        <Grid item xs={12} md={8}>
          {selectedApplication ? (
            <Paper elevation={3} className="ApplicationDetailsPaperAdminAppForm">
              <Box className="ApplicationHeaderAdminAppForm">
                <Box>
                  <Typography variant="h5" className="ApplicationDetailsTitleAdminAppForm">
                    Birth Certificate Application Details
                  </Typography>
                  <Typography variant="subtitle1" className="ApplicationDetailsIdAdminAppForm">
                    Application ID: {selectedApplication.id}
                  </Typography>
                </Box>
                
                <Box className="StatusSectionAdminAppForm">
                  <Typography variant="subtitle1" className={`StatusDisplayAdminAppForm status-${selectedApplication.status.toLowerCase().replace(/\s+/g, '-')}AdminAppForm`}>
                    Status: {selectedApplication.status}
                  </Typography>
                  {selectedApplication.statusMessage && (
                    <Typography variant="body2" className="StatusMessageAdminAppForm">
                      {selectedApplication.statusMessage}
                    </Typography>
                  )}
                  {selectedApplication.lastUpdated && (
                    <Typography variant="body2" className="LastUpdatedAdminAppForm">
                      Last Updated: {selectedApplication.lastUpdated}
                    </Typography>
                  )}
                  <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleOpenStatusDialog}
                    className="UpdateStatusButtonAdminAppForm"
                  >
                    Update Status
                  </Button>
                </Box>
              </Box>
              
              <Divider className="DetailsDividerAdminAppForm" />
              
           
              <Box className="DetailsSectionAdminAppForm">
                <Typography variant="h6" className="SectionTitleAdminAppForm">
                  I. CHILD IDENTIFYING INFORMATION
                </Typography>
                
                <Grid container spacing={2} className="DetailsGridAdminAppForm">
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" className="DetailsLabelAdminAppForm">
                      Full Name:
                    </Typography>
                    <Typography variant="body1" className="DetailsValueAdminAppForm">
                      {`${selectedApplication.formData.firstName || "N/A"} ${selectedApplication.formData.middleName || ""} ${selectedApplication.formData.lastName || ""} ${selectedApplication.formData.extension || ""}`}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" className="DetailsLabelAdminAppForm">
                      Birth Date:
                    </Typography>
                    <Typography variant="body1" className="DetailsValueAdminAppForm">
                      {formatDate(
                        selectedApplication.formData.birthMonth, 
                        selectedApplication.formData.birthDay, 
                        selectedApplication.formData.birthYear
                      )}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" className="DetailsLabelAdminAppForm">
                      Sex:
                    </Typography>
                    <Typography variant="body1" className="DetailsValueAdminAppForm">
                      {selectedApplication.formData.sex || "N/A"}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" className="DetailsLabelAdminAppForm">
                      Place of Birth:
                    </Typography>
                    <Typography variant="body1" className="DetailsValueAdminAppForm">
                      {`${selectedApplication.formData.hospital || "N/A"}, ${selectedApplication.formData.city || ""}, ${selectedApplication.formData.province || ""}`}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" className="DetailsLabelAdminAppForm">
                      Type of Birth:
                    </Typography>
                    <Typography variant="body1" className="DetailsValueAdminAppForm">
                      {selectedApplication.formData.typeOfBirth || "N/A"}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" className="DetailsLabelAdminAppForm">
                      Birth Order:
                    </Typography>
                    <Typography variant="body1" className="DetailsValueAdminAppForm">
                      {selectedApplication.formData.birthOrder || "N/A"}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" className="DetailsLabelAdminAppForm">
                      Multiple Birth Order:
                    </Typography>
                    <Typography variant="body1" className="DetailsValueAdminAppForm">
                      {selectedApplication.formData.multipleBirthOrder || "N/A"}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" className="DetailsLabelAdminAppForm">
                      Weight at Birth:
                    </Typography>
                    <Typography variant="body1" className="DetailsValueAdminAppForm">
                      {selectedApplication.formData.birthWeight ? `${selectedApplication.formData.birthWeight} grams` : "N/A"}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              
              <Divider className="DetailsDividerAdminAppForm" />
              
              <Box className="DetailsSectionAdminAppForm">
                <Typography variant="h6" className="SectionTitleAdminAppForm">
                  II. MOTHER IDENTIFYING INFORMATION
                </Typography>
                
                <Grid container spacing={2} className="DetailsGridAdminAppForm">
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" className="DetailsLabelAdminAppForm">
                      Full Maiden Name:
                    </Typography>
                    <Typography variant="body1" className="DetailsValueAdminAppForm">
                      {`${selectedApplication.formData.motherFirstName || "N/A"} ${selectedApplication.formData.motherMiddleName || ""} ${selectedApplication.formData.motherLastName || ""} ${selectedApplication.formData.motherExtension || ""}`}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" className="DetailsLabelAdminAppForm">
                      Citizenship:
                    </Typography>
                    <Typography variant="body1" className="DetailsValueAdminAppForm">
                      {selectedApplication.formData.motherCitizenship || "N/A"}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle1" className="DetailsLabelAdminAppForm">
                      Religion:
                    </Typography>
                    <Typography variant="body1" className="DetailsValueAdminAppForm">
                      {selectedApplication.formData.motherReligion || "N/A"}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle1" className="DetailsLabelAdminAppForm">
                      Occupation:
                    </Typography>
                    <Typography variant="body1" className="DetailsValueAdminAppForm">
                      {selectedApplication.formData.motherOccupation || "N/A"}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle1" className="DetailsLabelAdminAppForm">
                      Age at Time of Birth:
                    </Typography>
                    <Typography variant="body1" className="DetailsValueAdminAppForm">
                      {selectedApplication.formData.motherAge || "N/A"}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" className="DetailsLabelAdminAppForm">
                      Residence:
                    </Typography>
                    <Typography variant="body1" className="DetailsValueAdminAppForm">
                      {`${selectedApplication.formData.motherStreet || "N/A"}, ${selectedApplication.formData.motherBarangay || ""}, ${selectedApplication.formData.motherCity || ""}, ${selectedApplication.formData.motherProvince || ""}, ${selectedApplication.formData.motherCountry || ""}`}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              
              <Divider className="DetailsDividerAdminAppForm" />
              
              <Box className="DetailsSectionAdminAppForm">
                <Typography variant="h6" className="SectionTitleAdminAppForm">
                  III. FATHER IDENTIFYING INFORMATION
                </Typography>
                
                <Grid container spacing={2} className="DetailsGridAdminAppForm">
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" className="DetailsLabelAdminAppForm">
                      Full Name:
                    </Typography>
                    <Typography variant="body1" className="DetailsValueAdminAppForm">
                      {`${selectedApplication.formData.fatherFirstName || "N/A"} ${selectedApplication.formData.fatherMiddleName || ""} ${selectedApplication.formData.fatherLastName || ""} ${selectedApplication.formData.fatherExtension || ""}`}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" className="DetailsLabelAdminAppForm">
                      Citizenship:
                    </Typography>
                    <Typography variant="body1" className="DetailsValueAdminAppForm">
                      {selectedApplication.formData.fatherCitizenship || "N/A"}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle1" className="DetailsLabelAdminAppForm">
                      Religion:
                    </Typography>
                    <Typography variant="body1" className="DetailsValueAdminAppForm">
                      {selectedApplication.formData.fatherReligion || "N/A"}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle1" className="DetailsLabelAdminAppForm">
                      Occupation:
                    </Typography>
                    <Typography variant="body1" className="DetailsValueAdminAppForm">
                      {selectedApplication.formData.fatherOccupation || "N/A"}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={4}>
                    <Typography variant="subtitle1" className="DetailsLabelAdminAppForm">
                      Age at Time of Birth:
                    </Typography>
                    <Typography variant="body1" className="DetailsValueAdminAppForm">
                      {selectedApplication.formData.fatherAge || "N/A"}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12}>
                    <Typography variant="subtitle1" className="DetailsLabelAdminAppForm">
                      Residence:
                    </Typography>
                    <Typography variant="body1" className="DetailsValueAdminAppForm">
                      {`${selectedApplication.formData.fatherStreet || "N/A"}, ${selectedApplication.formData.fatherBarangay || ""}, ${selectedApplication.formData.fatherCity || ""}, ${selectedApplication.formData.fatherProvince || ""}, ${selectedApplication.formData.fatherCountry || ""}`}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              
              <Divider className="DetailsDividerAdminAppForm" />
              
    
              <Box className="DetailsSectionAdminAppForm">
                <Typography variant="h6" className="SectionTitleAdminAppForm">
                  IV. MARRIAGE OF PARENTS
                </Typography>
                
                <Grid container spacing={2} className="DetailsGridAdminAppForm">
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" className="DetailsLabelAdminAppForm">
                      Marriage Date:
                    </Typography>
                    <Typography variant="body1" className="DetailsValueAdminAppForm">
                      {formatDate(
                        selectedApplication.formData.marriageMonth, 
                        selectedApplication.formData.marriageDay, 
                        selectedApplication.formData.marriageYear
                      )}
                    </Typography>
                  </Grid>
                  
                  <Grid item xs={12} md={6}>
                    <Typography variant="subtitle1" className="DetailsLabelAdminAppForm">
                      Marriage Place:
                    </Typography>
                    <Typography variant="body1" className="DetailsValueAdminAppForm">
                      {`${selectedApplication.formData.marriageCity || "N/A"}, ${selectedApplication.formData.marriageProvince || ""}, ${selectedApplication.formData.marriageCountry || ""}`}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              
              <Divider className="DetailsDividerAdminAppForm" />
              

            
              
              <Box className="AdminActionButtonsAdminAppForm">
        
             
              </Box>
            </Paper>
          ) : (
            <Paper elevation={3} className="NoApplicationSelectedPaperAdminAppForm">
              <Typography variant="h6">
                No application selected
              </Typography>
              <Typography variant="body1">
                Please select an application from the list to view details
              </Typography>
            </Paper>
          )}
        </Grid>
      </Grid>
      
      <Dialog open={statusUpdateDialog} onClose={() => setStatusUpdateDialog(false)}>
        <DialogTitle>Update Application Status</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Update the status for application ID: {selectedApplication?.id}
          </DialogContentText>
          <FormControl fullWidth margin="normal">
            <InputLabel>Status</InputLabel>
            <Select
              value={newStatus}
              onChange={handleStatusChange}
              label="Status"
            >
              <MenuItem value="Pending">Pending</MenuItem>
              <MenuItem value="Approved">Approved</MenuItem>
              <MenuItem value="Decline">Decline</MenuItem>
              <MenuItem value="Requires Additional Info">Requires Additional Info</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="normal"
            label="Status Message/Notes"
            fullWidth
            multiline
            rows={4}
            value={statusMessage}
            onChange={handleMessageChange}
            placeholder="Enter any notes or messages for the applicant..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setStatusUpdateDialog(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdateStatus} color="primary" variant="contained">
            Update Status
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminBirthApplicationView;