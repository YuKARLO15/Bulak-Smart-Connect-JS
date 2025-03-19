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
  DialogTitle
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./BirthApplicationSummary.css";

const BirthApplicationSummary = () => {
    const [formData, setFormData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [applicationId, setApplicationId] = useState("");
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
    useEffect(() => {
        try {
          
            const currentId = localStorage.getItem("currentApplicationId");
            
            if (currentId) {
                setApplicationId(currentId);
                
              
                const applications = JSON.parse(localStorage.getItem("applications")) || [];
                
                
                const application = applications.find(app => app.id === currentId);
                
                if (application && application.formData) {
                  
                    setFormData(application.formData);
                    console.log("Found application in applications list:", currentId);
                } else {
                  
                    const storedData = localStorage.getItem("birthCertificateApplication");
                    if (storedData) {
                        const parsedData = JSON.parse(storedData);
                        setFormData(parsedData);
                        console.log("Using fallback data for ID:", currentId);
                    } else {
                        setError("No application data found. Please complete the application form.");
                    }
                }
            } else {
            
                const storedData = localStorage.getItem("birthCertificateApplication");
                if (storedData) {
                    const parsedData = JSON.parse(storedData);
                    setFormData(parsedData);
                    
              
                    const timestamp = Date.now();
                    const randomString = Math.random().toString(10).slice(2);
                    const generatedId = `BA-${timestamp}-${randomString}`;
                    
                    setApplicationId(generatedId);
                    localStorage.setItem("currentApplicationId", generatedId);
                    
                
                    const existingApplications = JSON.parse(localStorage.getItem("applications")) || [];
                    const applicationData = {
                        id: generatedId,
                        type: "Birth Certificate",
                        date: new Date().toLocaleDateString(),
                        status: "Pending",
                        message: `Birth certificate application for ${parsedData.firstName || ''} ${parsedData.lastName || ''}`,
                        formData: parsedData
                    };
                    existingApplications.unshift(applicationData);
                    localStorage.setItem("applications", JSON.stringify(existingApplications));
                    console.log("Created new application entry with ID:", generatedId);
                } else {
                    setError("No application data found. Please complete the application form.");
                }
            }
        } catch (err) {
            console.error("Error loading application data:", err);
            setError("Error loading application data: " + err.message);
        } finally {
            setLoading(false);
        }
    }, []);

    const handleBackToApplications = () => {
        navigate("/ApplicationForm");
    };

    const handleDeleteApplication = () => {
        setDeleteDialogOpen(true);
    };
    
    const confirmDeleteApplication = () => {
        try {
          
            const existingApplications = JSON.parse(localStorage.getItem("applications")) || [];
            
        
            const updatedApplications = existingApplications.filter(app => app.id !== applicationId);
            
          
            localStorage.setItem("applications", JSON.stringify(updatedApplications));
            
           
            if (updatedApplications.length > 0) {
                localStorage.setItem("currentApplicationId", updatedApplications[0].id);
                localStorage.setItem("birthCertificateApplication", JSON.stringify(updatedApplications[0].formData));
            } else {
              
                localStorage.removeItem("currentApplicationId");
                localStorage.removeItem("birthCertificateApplication");
            }
            
            console.log("Application deleted:", applicationId);
            
        
            setDeleteDialogOpen(false);
            
        
            navigate("/ApplicationForm");
            
         
            window.dispatchEvent(new Event('storage'));
        } catch (err) {
            console.error("Error deleting application:", err);
            setError("Error deleting application: " + err.message);
            setDeleteDialogOpen(false);
        }
    };
    
    const cancelDeleteApplication = () => {
        setDeleteDialogOpen(false);
    };

    const formatDate = (month, day, year) => {
        if (!month || !day || !year) return "N/A";
        return `${month} ${day}, ${year}`;
    };

    if (loading) {
        return (
            <Box className="LoadingContainerSummaryBirth">
                <CircularProgress />
                <Typography>Loading application data...</Typography>
            </Box>
        );
    }

    if (error) {
        return (
            <Box className="ErrorContainerSummaryBirth">
                <Alert severity="error">{error}</Alert>
                <Button 
                    variant="contained" 
                    color="primary" 
                    onClick={handleBackToApplications}
                    className="BackButtonSummaryBirth"
                >
                    Back to Applications
                </Button>
            </Box>
        );
    }

    return (
        <Box className="MainContainerSummaryBirth">
            <Paper elevation={3} className="SummaryPaperSummaryBirth">
                <Box className="HeaderSummaryBirth">
                    <Typography variant="h4" className="TitleSummaryBirth">
                        Birth Certificate Application Summary
                    </Typography>
                    <Typography variant="body1" className="SubtitleSummaryBirth">
                        Application ID: {applicationId}
                    </Typography>
                </Box>
                
                <Divider className="DividerSummaryBirth" />
                
                {/* Child Information Section */}
                <Box className="SectionSummaryBirth">
                    <Typography variant="h6" className="SectionTitleSummaryBirth">
                        I. CHILD IDENTIFYING INFORMATION
                    </Typography>
                    
                    <Grid container spacing={2} className="InfoGridSummaryBirth">
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle1" className="LabelSummaryBirth">
                                Full Name:
                            </Typography>
                            <Typography variant="body1" className="ValueSummaryBirth">
                                {`${formData?.firstName || "N/A"} ${formData?.middleName || ""} ${formData?.lastName || ""} ${formData?.extension || ""}`}
                            </Typography>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle1" className="LabelSummaryBirth">
                                Birth Date:
                            </Typography>
                            <Typography variant="body1" className="ValueSummaryBirth">
                                {formatDate(formData?.birthMonth, formData?.birthDay, formData?.birthYear)}
                            </Typography>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle1" className="LabelSummaryBirth">
                                Sex:
                            </Typography>
                            <Typography variant="body1" className="ValueSummaryBirth">
                                {formData?.sex || "N/A"}
                            </Typography>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle1" className="LabelSummaryBirth">
                                Place of Birth:
                            </Typography>
                            <Typography variant="body1" className="ValueSummaryBirth">
                                {`${formData?.hospital || "N/A"}, ${formData?.city || ""}, ${formData?.province || ""}`}
                            </Typography>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle1" className="LabelSummaryBirth">
                                Type of Birth:
                            </Typography>
                            <Typography variant="body1" className="ValueSummaryBirth">
                                {formData?.typeOfBirth || "N/A"}
                            </Typography>
                            
                            <Typography variant="subtitle1" className="LabelSummaryBirth">
                                Birth Order:
                            </Typography>
                            <Typography variant="body1" className="ValueSummaryBirth">
                                {formData?.birthOrder || "N/A"}
                            </Typography>
                           
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle1" className="LabelSummaryBirth">
                                Multiple Birth Order:
                            </Typography>
                            <Typography variant="body1" className="ValueSummaryBirth">
                                {formData?.multipleBirthOrder || "N/A"}
                            </Typography>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle1" className="LabelSummaryBirth">
                                Weight at Birth:
                            </Typography>
                            <Typography variant="body1" className="ValueSummaryBirth">
                                {formData?.birthWeight ? `${formData.birthWeight} grams` : "N/A"}
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
                
                <Divider className="DividerSummaryBirth" />
                
                {/* Mother Information Section */}
                <Box className="SectionSummaryBirth">
                    <Typography variant="h6" className="SectionTitleSummaryBirth">
                        II. MOTHER IDENTIFYING INFORMATION
                    </Typography>
                    
                    <Grid container spacing={2} className="InfoGridSummaryBirth">
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle1" className="LabelSummaryBirth">
                                Full Maiden Name:
                            </Typography>
                            <Typography variant="body1" className="ValueSummaryBirth">
                                {`${formData?.motherFirstName || "N/A"} ${formData?.motherMiddleName || ""} ${formData?.motherLastName || ""} ${formData?.motherExtension || ""}`}
                            </Typography>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle1" className="LabelSummaryBirth">
                                Citizenship:
                            </Typography>
                            <Typography variant="body1" className="ValueSummaryBirth">
                                {formData?.motherCitizenship || "N/A"}
                            </Typography>
                        </Grid>

                        <Grid container spacing={4} className="GridGroupBirth">
                            <Grid item xs={12} md={4}>
                                <Typography variant="subtitle1" className="LabelSummaryBirth">
                                    Religion:
                                </Typography>
                                <Typography variant="body1" className="ValueSummaryBirth">
                                    {formData?.motherReligion || "N/A"}
                                </Typography>
                            </Grid>
                             
                            <Grid item xs={12} md={4}>
                                <Typography variant="subtitle1" className="LabelSummaryBirth">
                                    Occupation:
                                </Typography>
                                <Typography variant="body1" className="ValueSummaryBirth">
                                    {formData?.motherOccupation || "N/A"}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Typography variant="subtitle1" className="LabelSummaryBirth">
                                    Age at Time of Birth:
                                </Typography>
                                <Typography variant="body1" className="ValueSummaryBirth">
                                    {formData?.motherAge || "N/A"}
                                </Typography>
                            </Grid>
                        </Grid>
                        
                        <Grid container spacing={4} className="GridGroupBirth">
                            <Grid item xs={12} md={4}>
                                <Typography variant="subtitle1" className="LabelSummaryBirth">
                                    Total number of mother's children born alive:
                                </Typography>
                                <Typography variant="body1" className="ValueSummaryBirth">
                                    {formData?.motherTotalChildren || "N/A"}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Typography variant="subtitle1" className="LabelSummaryBirth">
                                    No. of children still living including this birth:
                                </Typography>
                                <Typography variant="body1" className="ValueSummaryBirth">
                                    {formData?.motherLivingChildren || "N/A"}
                                </Typography>
                            </Grid>
                            <Grid item xs={12} md={4}>
                                <Typography variant="subtitle1" className="LabelSummaryBirth">
                                    No. of children born alive but are now dead:
                                </Typography>
                                <Typography variant="body1" className="ValueSummaryBirth">
                                    {formData?.motherDeceasedChildren || "N/A"}
                                </Typography>
                            </Grid>
                        </Grid>
                     
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" className="LabelSummaryBirth">
                                Residence:
                            </Typography>
                            <Typography variant="body1" className="ValueSummaryBirth">
                                {`${formData?.motherStreet || "N/A"}, ${formData?.motherBarangay || ""}, ${formData?.motherCity || ""}, ${formData?.motherProvince || ""}, ${formData?.motherCountry || ""}`}
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
                
                <Divider className="DividerSummaryBirth" />
                
                {/* Father Information Section */}
                <Box className="SectionSummaryBirth">
                    <Typography variant="h6" className="SectionTitleSummaryBirth">
                        III. FATHER IDENTIFYING INFORMATION
                    </Typography>
                    
                    <Grid container spacing={2} className="InfoGridSummaryBirth">
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle1" className="LabelSummaryBirth">
                                Full Name:
                            </Typography>
                            <Typography variant="body1" className="ValueSummaryBirth">
                                {`${formData?.fatherFirstName || "N/A"} ${formData?.fatherMiddleName || ""} ${formData?.fatherLastName || ""} ${formData?.fatherExtension || ""}`}
                            </Typography>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle1" className="LabelSummaryBirth">
                                Citizenship:
                            </Typography>
                            <Typography variant="body1" className="ValueSummaryBirth">
                                {formData?.fatherCitizenship || "N/A"}
                            </Typography>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle1" className="LabelSummaryBirth">
                                Religion:
                            </Typography>
                            <Typography variant="body1" className="ValueSummaryBirth">
                                {formData?.fatherReligion || "N/A"}
                            </Typography>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle1" className="LabelSummaryBirth">
                                Occupation:
                            </Typography>
                            <Typography variant="body1" className="ValueSummaryBirth">
                                {formData?.fatherOccupation || "N/A"}
                            </Typography>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle1" className="LabelSummaryBirth">
                                Age at Time of Birth:
                            </Typography>
                            <Typography variant="body1" className="ValueSummaryBirth">
                                {formData?.fatherAge || "N/A"}
                            </Typography>
                        </Grid>
                        
                        <Grid item xs={12}>
                            <Typography variant="subtitle1" className="LabelSummaryBirth">
                                Residence:
                            </Typography>
                            <Typography variant="body1" className="ValueSummaryBirth">
                                {`${formData?.fatherStreet || "N/A"}, ${formData?.fatherBarangay || ""}, ${formData?.fatherCity || ""}, ${formData?.fatherProvince || ""}, ${formData?.fatherCountry || ""}`}
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
                
                <Divider className="DividerSummaryBirth" />
                
                {/* Marriage Information Section */}
                <Box className="SectionSummaryBirth">
                    <Typography variant="h6" className="SectionTitleSummaryBirth">
                        IV. MARRIAGE OF PARENTS
                    </Typography>
                    
                    <Grid container spacing={2} className="InfoGridSummaryBirth">
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle1" className="LabelSummaryBirth">
                                Marriage Date:
                            </Typography>
                            <Typography variant="body1" className="ValueSummaryBirth">
                                {formatDate(formData?.marriageMonth, formData?.marriageDay, formData?.marriageYear)}
                            </Typography>
                        </Grid>
                        
                        <Grid item xs={12} md={6}>
                            <Typography variant="subtitle1" className="LabelSummaryBirth">
                                Marriage Place:
                            </Typography>
                            <Typography variant="body1" className="ValueSummaryBirth">
                                {`${formData?.marriageCity || "N/A"}, ${formData?.marriageProvince || ""}, ${formData?.marriageCountry || ""}`}
                            </Typography>
                        </Grid>
                    </Grid>
                </Box>
                
                <Box className="StatusSectionSummaryBirth">
                    <Typography variant="h6" className="StatusTitleSummaryBirth">
                        Application Status:
                    </Typography>
                    <Typography variant="body1" className="StatusValueSummaryBirth">
                        Pending
                    </Typography>
                    <Typography variant="body2" className="StatusMessageSummaryBirth">
                        Your application has been submitted and is awaiting review.
                    </Typography>
                </Box>
                
                <Box className="ButtonsSectionSummaryBirth">
                    <Button 
                        variant="contained" 
                        
                        onClick={handleBackToApplications}
                        className="BackButtonSummaryBirth"
                    >
                        Back to Applications
                    </Button>
                
                    <Button 
                        variant="contained" 
                        color="error" 
                        onClick={handleDeleteApplication}
                        className="DeleteButtonSummaryBirth"
                    >
                        Cancel Application
                    </Button>
                </Box>
            </Paper>
            
            
            <Dialog
                open={deleteDialogOpen}
                onClose={cancelDeleteApplication}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Cancel Birth Certificate Application?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Are you sure you want to cancel this application? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={cancelDeleteApplication} color="primary">No, Keep Application</Button>
                    <Button onClick={confirmDeleteApplication} color="error" autoFocus>
                        Yes, Cancel Application
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default BirthApplicationSummary;