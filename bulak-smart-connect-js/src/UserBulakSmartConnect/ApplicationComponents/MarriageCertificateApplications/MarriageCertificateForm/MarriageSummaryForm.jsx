import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './MarriageSummaryForm.css';
import { 
  Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, 
  Button, TextField, Typography, Box
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';

const MarriageSummaryForm = () => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [applicationId, setApplicationId] = useState('');
  const [confirmCancelDialog, setConfirmCancelDialog] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const navigate = useNavigate();

  // Load form data and application ID from localStorage when component mounts
  useEffect(() => {
    try {
      // Get the current application ID
      const currentApplicationId = localStorage.getItem('currentApplicationId');
      if (currentApplicationId) {
        setApplicationId(currentApplicationId);
      }
      
      // Get the marriage form data
      const savedCertificateData = localStorage.getItem('marriageFormData');
      if (savedCertificateData) {
        setFormData(JSON.parse(savedCertificateData));
      }
    } catch (err) {
      console.error('Error loading form data:', err);
    } finally {
      setLoading(false);
    }
  }, []);`MC-924447`
  const handleCancelApplication = () => {
    try {
 
      setConfirmCancelDialog(false);
      
      if (!applicationId) {
        alert('No application ID found. Cannot cancel application.');
        return;
      }
      
      console.log("Attempting to cancel application with ID:", applicationId);

      const applications = JSON.parse(localStorage.getItem('applications') || '[]');
      console.log("Current applications:", applications);
      
     
      const applicationExists = applications.some(app => app.id === applicationId);
      
      if (!applicationExists) {
        console.log("Application not found with ID:", applicationId);
        alert('Application not found. Cannot cancel application.');
        return;
      }
      
  
      const filteredApplications = applications.filter(app => app.id !== applicationId);
      console.log("Applications after filtering:", filteredApplications);
      
   
      localStorage.setItem('applications', JSON.stringify(filteredApplications));
      
      
      localStorage.removeItem('marriageFormData');
      localStorage.removeItem('currentApplicationId');
      localStorage.removeItem(`uploadedFiles_${applicationId}`);
      
  
      const cancelEvent = new CustomEvent('applicationCancelled', { 
        detail: { id: applicationId } 
      });
      
      
      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(cancelEvent);
      
      console.log("Application cancelled event dispatched for ID:", applicationId);
      

      setStatusMessage('');
      

      alert('Your application has been cancelled and removed successfully.');
      
      
      navigate('/ApplicationForm');
      
    } catch (error) {
      console.error('Error cancelling application:', error);
      alert('An error occurred while cancelling the application. Please try again.');
    }
  };
  const handleMessageChange = (e) => {
    setStatusMessage(e.target.value);
  };
 
  const handleBackToForm = () => {
    navigate('/MarriageForm');
  };

  const handleSubmit = () => {
    navigate('/ApplicationForm');
  };

 const handleModify = () => {
  try {
    console.log('Current formData:', formData);

    const applicationId = formData.applicationId || formData.id;
    console.log('Application ID for editing:', applicationId);
    
    // Make sure we save formData with the application ID
    if (applicationId) {
      const updatedFormData = {
        ...formData,
        applicationId: applicationId // Ensure ID is preserved
      };
      
      localStorage.setItem('marriageFormData', JSON.stringify(updatedFormData));
    } else {
      console.warn('No application ID found for editing');
      localStorage.setItem('marriageFormData', JSON.stringify(formData));
    }
    
    // Set the editing flags
   localStorage.setItem('isEditingMarriageForm', 'true');
    localStorage.setItem('editingMarriageType', 'Marriage Certificate'); 
    localStorage.setItem('currentEditingApplicationId', applicationId);
    localStorage.setItem('selectedMarriageOption', 'Marriage Certificate'); 
    
    // Navigate to the form
    navigate('/MarriageForm');
  } catch (err) {
    console.error('Error setting up modification:', err);
    alert('There was a problem preparing the form for editing. Please try again.');
  }
};
  if (loading) {
    return <div className="MarriageSummaryContainerMSummary">Loading...</div>;
  }
  return (
    <div className="MarriageSummaryContainer">
      {formData.lastUpdated && (
  <Box 
    sx={{ 
      backgroundColor: '#e3f2fd', 
      padding: '10px 15px', 
      borderRadius: '8px',
      margin: '0 auto 20px auto',
      maxWidth: '80%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px'
    }}
  >
    <EditIcon fontSize="small" sx={{ color: '#184a5b' }} />
    <Typography variant="body2" sx={{ color: '#184a5b' }}>
      This application was last modified on {new Date(formData.lastUpdated).toLocaleString()}
    </Typography>
  </Box>
)}
    <div className="MarriageSummaryContainerMSummary">
      <div className="FormHeaderMSummary">Municipal Form No. 97<br/>(Revised August 2016)</div>
      <div className="RegistryNoMSummary">Registry No. _________</div>
      
      <div className="MarriageHeaderMSummary">
        <p className="RepublicTextMSummary">Republic of the Philippines</p>
        <p className="OfficeTextMSummary">OFFICE OF THE CIVIL REGISTRAR GENERAL</p>
        <p className="CertificateTitleMSummary">CERTIFICATE OF MARRIAGE</p>
      </div>

      <table className="SummarySectionMSummary">
        <tbody>
          <tr className="SummaryRowMSummary">
            <td className="SummaryLabelMSummary">Province</td>
            <td className="SummaryValueMSummary">{"Bulacan"|| ''}</td>
            <td className="SummaryLabelMSummary" style={{ borderLeft: '1px solid #d14747' }}>Registry No.</td>
          </tr>
          <tr className="SummaryRowMSummary">
            <td className="SummaryLabelMSummary">City/Municipality</td>
            <td className="SummaryValueMSummary" colSpan="2">{ "San Ildefonso" || ''}</td>
          </tr>
        </tbody>
      </table>

      <table className="HusbandWifeTableMSummary">
        <tbody>
          <tr>
            <td className="HusbandWifeHeaderMSummary">HUSBAND</td>
            <td className="HusbandWifeHeaderMSummary">WIFE</td>
          </tr>
          <tr className="SummaryRowMSummary">
            <td className="SummaryValueMSummary">
              <div>1. Name of Contracting Parties</div>
            </td>
            <td className="SummaryValueMSummary">
              <div>1. Name of Contracting Parties</div>
            </td>
          </tr>
          <tr className="SummaryRowMSummary">
            <td className="SummaryValueMSummary">{formData.husbandFirstName || ''}</td>
            <td className="SummaryValueMSummary">{formData.wifeFirstName || ''}</td>
          </tr>
          <tr className="SummaryRowMSummary">
            <td className="SummaryValueMSummary">{formData.husbandMiddleName || ''}</td>
            <td className="SummaryValueMSummary">{formData.wifeMiddleName || ''}</td>
          </tr>
          <tr className="SummaryRowMSummary">
            <td className="SummaryValueMSummary">{formData.husbandLastName || ''}</td>
            <td className="SummaryValueMSummary">{formData.wifeLastName || ''}</td>
          </tr>
          <tr className="SummaryRowMSummary">
            <td colSpan="2">
              <table className="DateTableMSummary">
                <thead>
                  <tr>
                    <th colSpan="3">2a. Date of Birth</th>
                    <th colSpan="3">2a. Date of Birth</th>
                  </tr>
                  <tr>
                    <th>Day</th>
                    <th>Month</th>
                    <th>Year</th>
                    <th>Day</th>
                    <th>Month</th>
                    <th>Year</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{formData.husbandBirthDay || ''}</td>
                    <td>{formData.husbandBirthMonth || ''}</td>
                    <td>{formData.husbandBirthYear || ''}</td>
                    <td>{formData.wifeBirthDay || ''}</td>
                    <td>{formData.wifeBirthMonth || ''}</td>
                    <td>{formData.wifeBirthYear || ''}</td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
          <tr className="SummaryRowMSummary">
            <td className="SummaryValueMSummary">
              <div>2b. Age</div>
              <div>{formData.husbandAge || ''}</div>
            </td>
            <td className="SummaryValueMSummary">
              <div>2b. Age</div>
              <div>{formData.wifeAge || ''}</div>
            </td>
          </tr>
          <tr className="SummaryRowMSummary">
            <td className="SummaryValueMSummary">
              <div>3. Place of Birth</div>
            </td>
            <td className="SummaryValueMSummary">
              <div>3. Place of Birth</div>
            </td>
          </tr>
          <tr className="SummaryRowMSummary">
            <td className="SummaryValueMSummary">{formData.husbandBirthCity || ''}</td>
            <td className="SummaryValueMSummary">{formData.wifeBirthCity || ''}</td>
          </tr>
          <tr className="SummaryRowMSummary">
            <td className="SummaryValueMSummary">{formData.husbandBirthProvince || ''}</td>
            <td className="SummaryValueMSummary">{formData.wifeBirthProvince || ''}</td>
          </tr>
          <tr className="SummaryRowMSummary">
            <td className="SummaryValueMSummary">{formData.husbandBirthCountry || 'Philippines'}</td>
            <td className="SummaryValueMSummary">{formData.wifeBirthCountry || 'Philippines'}</td>
          </tr>
          <tr className="SummaryRowMSummary">
            <td className="SummaryValueMSummary">
              <div>4a. Sex</div>
              <div>Male</div>
            </td>
            <td className="SummaryValueMSummary">
              <div>4a. Sex</div>
              <div>Female</div>
            </td>
          </tr>
          <tr className="SummaryRowMSummary">
            <td className="SummaryValueMSummary">
              <div>4b. Citizenship</div>
              <div>{formData.husbandCitizenship || 'Filipino'}</div>
            </td>
            <td className="SummaryValueMSummary">
              <div>4b. Citizenship</div>
              <div>{formData.wifeCitizenship || 'Filipino'}</div>
            </td>
          </tr>
          <tr className="SummaryRowMSummary">
            <td className="SummaryValueMSummary">
              <div>5. Residence</div>
              <div>{formData.husbandStreet || ''}, {formData.husbandBarangay || ''}, {formData.husbandCity || ''}, {formData.husbandProvince || ''}</div>
            </td>
            <td className="SummaryValueMSummary">
              <div>5. Residence</div>
              <div>{formData.wifeStreet || ''}, {formData.wifeBarangay || ''}, {formData.wifeCity || ''}, {formData.wifeProvince || ''}</div>
            </td>
          </tr>
          <tr className="SummaryRowMSummary">
            <td className="SummaryValueMSummary">
              <div>6. Religion/Religious Sect</div>
              <div>{formData.husbandReligion || ''}</div>
            </td>
            <td className="SummaryValueMSummary">
              <div>6. Religion/Religious Sect</div>
              <div>{formData.wifeReligion || ''}</div>
            </td>
          </tr>
          <tr className="SummaryRowMSummary">
            <td className="SummaryValueMSummary">
              <div>7. Civil Status</div>
              <div>{formData.husbandCivilStatus || 'Single'}</div>
            </td>
            <td className="SummaryValueMSummary">
              <div>7. Civil Status</div>
              <div>{formData.wifeCivilStatus || 'Single'}</div>
            </td>
          </tr>
        </tbody>
      </table>

      <table className="SummarySectionMSummary">
        <tbody>
          <tr>
            <td className="SummarySectionTitleMSummary" colSpan="2">MARRIAGE DETAILS</td>
          </tr>
          <tr className="SummaryRowMSummary">
            <td className="SummaryLabelMSummary">15. Place of Marriage</td>
            <td className="SummaryValueMSummary">
              <div>{formData.ceremonyType || ''}</div>
              <div>{formData.marriageCity || ''}, {formData.marriageProvince || ''}</div>
            </td>
          </tr>
          <tr className="SummaryRowMSummary">
            <td className="SummaryLabelMSummary">16. Date of Marriage</td>
            <td className="SummaryValueMSummary">
              <div>
                <table className="DateTableMSummary" style={{ borderWidth: 0 }}>
                  <thead>
                    <tr>
                      <th>Day</th>
                      <th>Month</th>
                      <th>Year</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>{formData.marriageDay || ''}</td>
                      <td>{formData.marriageMonth || ''}</td>
                      <td>{formData.marriageYear || ''}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </td>
          </tr>
          <tr className="SummaryRowMSummary">
            <td className="SummaryLabelMSummary">17. Time of Marriage</td>
            <td className="SummaryValueMSummary">{formData.marriageTime || ''}</td>
          </tr>
        </tbody>
      </table>

      <table className="SummarySectionMSummary">
        <tbody>
          <tr>
            <td className="SummarySectionTitleMSummary" colSpan="2">WITNESSES</td>
          </tr>
          <tr className="SummaryRowMSummary">
            <td>
              <table className="WitnessesTableMSummary" style={{ borderWidth: 0 }}>
                <thead>
                  <tr>
                    <th>Witness 1:</th>
                    <th>Witness 2:</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{formData.witness1Name || 'N/A'}</td>
                    <td>{formData.witness2Name || 'N/A'}</td>
                  </tr>
                  <tr>
                    <td>{formData.witness1Address || 'N/A'}</td>
                    <td>{formData.witness2Address || 'N/A'}</td>
                  </tr>
                </tbody>
              </table>
            </td>
          </tr>
        </tbody>
      </table>

      <div className="ActionsContainerMSummary">
        <button onClick={handleBackToForm} className="BackButtonMSummary">
          Back to Form
          </button>
<Button 
  variant="contained" 
  onClick={handleModify}
  className="ModifyButtonMSummary"
  startIcon={<EditIcon />}
  sx={{
    backgroundColor: '#8aacb5',
    color: 'white',
    marginLeft: '10px',
    marginRight: '10px',
    padding: '6px 16px',
    '&:hover': {
      backgroundColor: '#6d8a91',
    }
  }}
>
  Modify
</Button>
    
        <button onClick={handleSubmit} className="BackButtonMSummary" >
         Done
          </button>
          <Button
    variant="contained"
    color="error"
    onClick={() => setConfirmCancelDialog(true)}
    className="CancelApplicationButtonAdminAppForm"
  >
    Cancel Application
          </Button>
          </div>
          
          <Dialog open={confirmCancelDialog} onClose={() => setConfirmCancelDialog(false)}>
          <DialogTitle>Cancel Application</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to cancel this application? 
              This action cannot be undone.
            </DialogContentText>
            <TextField
              margin="normal"
              label="Reason for Cancellation"
              fullWidth
              multiline
              rows={4}
              value={statusMessage}
              onChange={handleMessageChange}
              placeholder="Please provide a reason for cancellation..."
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmCancelDialog(false)} color="primary">
              No, Keep Application
            </Button>
            <Button 
              onClick={handleCancelApplication} 
              color="error" 
              variant="contained"
            >
              Yes, Cancel Application
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default MarriageSummaryForm;