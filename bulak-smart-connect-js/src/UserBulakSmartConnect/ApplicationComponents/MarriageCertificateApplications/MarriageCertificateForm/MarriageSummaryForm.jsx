import React, { useState, useEffect } from 'react';
import logger from '../../../../utils/logger';
import { useNavigate } from 'react-router-dom';
import './MarriageSummaryForm.css';
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  TextField,
  Typography,
  Box,
  SpeedDial,
  SpeedDialAction,
  SpeedDialIcon,
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CancelIcon from '@mui/icons-material/Cancel';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { documentApplicationService } from '../../../../services/documentApplicationService';

const MarriageSummaryForm = () => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [applicationId, setApplicationId] = useState('');
  const [confirmCancelDialog, setConfirmCancelDialog] = useState(false);
  const [statusMessage, setStatusMessage] = useState('');
  const navigate = useNavigate();
  const [applicationStatus, setApplicationStatus] = useState('Pending');
  
  const getStatusColor = (status) => {
    const statusLower = status.toLowerCase();
    if (statusLower === 'approved') return 'green';
    if (statusLower === 'ready for pickup') return '#4caf50';
    if (statusLower === 'pending') return '#ff9800';
    if (statusLower === 'processing' || statusLower === 'submitted') return '#2196f3';
    if (statusLower === 'declined' || statusLower === 'rejected') return 'red';
    if (statusLower === 'requires additional info') return '#ff8c00';
    if (statusLower === 'cancelled') return '#d32f2f';
    return '#1c4d5a';
  };
useEffect(() => {
  try {
    const currentApplicationId = localStorage.getItem('currentApplicationId');
    if (currentApplicationId) {
      setApplicationId(currentApplicationId);
      
      const allApplications = JSON.parse(localStorage.getItem('applications') || '[]');
      const currentApp = allApplications.find(app => app.id === currentApplicationId);
      
      if (currentApp) {
        if (currentApp.status) {
          setApplicationStatus(currentApp.status);
          console.log("Found status in applications array:", currentApp.status);
        }
        
        if (currentApp.statusMessage) {
          setStatusMessage(currentApp.statusMessage);
          console.log("Found message in applications array:", currentApp.statusMessage);
        }
      }
    }

    const savedCertificateData = localStorage.getItem('marriageFormData');
    if (savedCertificateData) {
      const parsedData = JSON.parse(savedCertificateData);
      setFormData(parsedData);
      
      if (parsedData.status) {
        setApplicationStatus(parsedData.status);
        console.log("Setting application status from formData.status:", parsedData.status);
      } else if (parsedData.applicationStatus) {
        setApplicationStatus(parsedData.applicationStatus);
        console.log("Setting application status from formData.applicationStatus:", parsedData.applicationStatus);
      } else if (parsedData.metadata && parsedData.metadata.status) {
        setApplicationStatus(parsedData.metadata.status);
        console.log("Setting application status from formData.metadata.status:", parsedData.metadata.status);
      }
      
      if (parsedData.statusMessage) {
        setStatusMessage(parsedData.statusMessage);
        console.log("Setting status message from formData.statusMessage:", parsedData.statusMessage);
      } else if (parsedData.message) {
        setStatusMessage(parsedData.message);
        console.log("Setting status message from formData.message:", parsedData.message);
      } else if (parsedData.metadata && parsedData.metadata.message) {
        setStatusMessage(parsedData.metadata.message);
        console.log("Setting status message from formData.metadata.message:", parsedData.metadata.message);
      }
    }
    

    
  } catch (err) {
    logger.error('Error loading form data:', err);
  } finally {
    setLoading(false);
  }
}, []);

  const handleCancelApplication = async () => {
    try {
      logger.log('=== Attempting to cancel marriage certificate application ===');
      logger.log('applicationId state:', applicationId);
      logger.log('formData:', formData);

      let idToDelete = applicationId || formData.applicationId || formData.id || formData.appId;

      if (!idToDelete) {
        const applications = JSON.parse(localStorage.getItem('applications') || '[]');
        const marriageApps = applications.filter(
          app =>
            app.type === 'Marriage Certificate' || app.applicationType === 'MARRIAGE_CERTIFICATE'
        );

        if (marriageApps.length > 0) {
          idToDelete = marriageApps[0].id;
          logger.log('Found ID from applications array:', idToDelete);
        }
      }

      logger.log('Final ID to delete:', idToDelete);

      if (!idToDelete) {
        logger.error('No application ID found to delete');
        setConfirmCancelDialog(false);
        return;
      }

      try {
        await documentApplicationService.deleteApplication(idToDelete);
        logger.log('Marriage certificate application deleted from database:', idToDelete);
      } catch (dbError) {
        logger.error('Error deleting from database:', dbError);
        setConfirmCancelDialog(false);
        return;
      }

      const existingApplications = JSON.parse(localStorage.getItem('applications') || '[]');
      logger.log('Current applications count:', existingApplications.length);

      const updatedApplications = existingApplications.filter(
        app => String(app.id) !== String(idToDelete)
      );
      logger.log('Updated applications count:', updatedApplications.length);

      localStorage.setItem('applications', JSON.stringify(updatedApplications));

      localStorage.removeItem('marriageFormData');
      localStorage.removeItem('currentApplicationId');
      localStorage.removeItem(`uploadedFiles_${idToDelete}`);
      localStorage.removeItem('isEditingMarriageForm');
      localStorage.removeItem('editingMarriageType');
      localStorage.removeItem('currentEditingApplicationId');
      localStorage.removeItem('selectedMarriageOption');

      if (updatedApplications.length > 0) {
        const nextApp = updatedApplications[0];
        localStorage.setItem('currentApplicationId', nextApp.id);

        if (nextApp.type === 'Marriage Certificate') {
          localStorage.setItem('marriageFormData', JSON.stringify(nextApp.formData));
        } else {
          localStorage.removeItem('marriageFormData');
        }
      } else {
        localStorage.removeItem('currentApplicationId');
        localStorage.removeItem('marriageFormData');
      }

      logger.log(
        'Marriage certificate application deleted successfully from both database and localStorage:',
        idToDelete
      );
      setConfirmCancelDialog(false);

      window.dispatchEvent(new Event('storage'));
      window.dispatchEvent(
        new CustomEvent('applicationCancelled', {
          detail: { id: idToDelete, reason: statusMessage },
        })
      );
      
      setTimeout(() => {
        navigate('/ApplicationForm');
      }, 100);
    } catch (error) {
      logger.error('Error deleting marriage certificate application:', error);
      setConfirmCancelDialog(false);
    }
  };

  const handleMessageChange = e => {
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
      logger.log('Current formData:', formData);

      const appId = applicationId || formData.applicationId || formData.id;
      logger.log('Application ID for editing:', appId);

      if (appId) {
        const updatedFormData = {
          ...formData,
          applicationId: appId,
        };

        localStorage.setItem('marriageFormData', JSON.stringify(updatedFormData));
      } else {
        logger.warn('No application ID found for editing');
        localStorage.setItem('marriageFormData', JSON.stringify(formData));
      }

      localStorage.setItem('isEditingMarriageForm', 'true');
      localStorage.setItem('editingMarriageType', 'Marriage Certificate');
      localStorage.setItem('currentEditingApplicationId', appId);
      localStorage.setItem('selectedMarriageOption', 'Marriage Certificate');

      navigate('/MarriageForm');
    } catch (err) {
      logger.error('Error setting up modification:', err);
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
            gap: '8px',
          }}
        >
          <EditIcon fontSize="small" sx={{ color: '#184a5b' }} />
          <Typography variant="body2" sx={{ color: '#184a5b' }}>
            This application was last modified on {new Date(formData.lastUpdated).toLocaleString()}
          </Typography>
        </Box>
      )}

<div className="ApplicationDetails">
  <Box className="StatusSection" sx={{ marginTop: '15px', marginBottom: '15px' }}>
    <Typography
      className="ApplicationStatus"
      sx={{
        fontWeight: 'bold',
        color: getStatusColor(applicationStatus || 'Pending'),
      }}
    >
      Status: {applicationStatus || 'Pending'}
    </Typography>

    <Typography
      className="ApplicationStatusMessage"
      sx={{
        fontSize: '0.9rem',
        marginTop: '8px',
        padding: '8px',
        backgroundColor: '#f5f5f5',
        borderLeft: '3px solid #1c4d5a',
      }}
    >
      {statusMessage 
        ? `Message from Administrator: ${statusMessage}`
        : "No messages from administrator yet. Your application is being processed."}
          </Typography>
              {(applicationStatus?.toLowerCase() === 'ready for pickup' ||
                applicationStatus?.toLowerCase() === 'ready for pickup') && (
                <Box sx={{ marginTop: '20px', borderTop: '1px solid #ccc', paddingTop: '10px' }}>
                  <Typography
                    variant="body2"
                    sx={{
                      fontSize: '0.9rem',
                      marginBottom: '8px',
                      color: '#1c4d5a',
                    }}
                  >
                    You may book an appointment to pick up your document for faster transaction.
                  </Typography>
                  <Button
                    variant="contained"
                    color="primary"
                    size="small"
                    onClick={() => navigate('/AppointmentForm')}
                    sx={{
                      backgroundColor: '#f5f5f5',
                      color: '#1c4d5a',
                      fontWeight: '600 !important',
                      border: '1px solid #1c4d5a',
                      '&:hover': {
                        backgroundColor: '#0f3a47',
                        color: '#f5f5f5',
                      },
                    }}
                  >
                    Book Appointment
                  </Button>
                </Box>
              )}
            </Box>
        </div>          
          

      
 
      <div className="MarriageSummaryContainerMSummary">
        <div className="FormHeaderMSummary">
          Municipal Form No. 97
          <br />
          (Revised August 2016)
        </div>
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
              <td className="SummaryValueMSummary">{'Bulacan' || ''}</td>
              <td className="SummaryLabelMSummary" style={{ borderLeft: '1px solid #d14747' }}>
                Registry No.
              </td>
            </tr>
            <tr className="SummaryRowMSummary">
              <td className="SummaryLabelMSummary">City/Municipality</td>
              <td className="SummaryValueMSummary" colSpan="2">
                {'San Ildefonso' || ''}
              </td>
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
              <td className="SummaryValueMSummary">
                {formData.husbandBirthCountry || 'Philippines'}
              </td>
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
                <div>
                  {formData.husbandStreet || ''}, {formData.husbandBarangay || ''},{' '}
                  {formData.husbandCity || ''}, {formData.husbandProvince || ''}
                </div>
              </td>
              <td className="SummaryValueMSummary">
                <div>5. Residence</div>
                <div>
                  {formData.wifeStreet || ''}, {formData.wifeBarangay || ''},{' '}
                  {formData.wifeCity || ''}, {formData.wifeProvince || ''}
                </div>
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
              <td className="SummarySectionTitleMSummary" colSpan="2">
                MARRIAGE DETAILS
              </td>
            </tr>
            <tr className="SummaryRowMSummary">
              <td className="SummaryLabelMSummary">15. Place of Marriage</td>
              <td className="SummaryValueMSummary">
                <div>{formData.ceremonyType || ''}</div>
                <div>
                  {formData.marriageCity || ''}, {formData.marriageProvince || ''}
                </div>
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
              <td className="SummarySectionTitleMSummary" colSpan="2">
                WITNESSES
              </td>
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

        <div className="ActionButtonContainerMSummary">
          <Button
            variant="contained"
            color="error"
            startIcon={<CancelIcon />}
            onClick={() => setConfirmCancelDialog(true)}
            className="ActionButtonMSummary cancelButton"
            aria-label="Cancel Application"
          >
            Cancel
          </Button>

          <Button
            variant="contained"
            startIcon={<EditIcon />}
            onClick={handleModify}
            className="ActionButtonMSummary modifyButton"
            aria-label="Modify Form"
          >
            Modify
          </Button>

          <Button
            variant="contained"
            startIcon={<CheckIcon />}
            onClick={handleSubmit}
            className="ActionButtonMSummary doneButton"
            aria-label="Done"
          >
            Done
          </Button>
        </div>

        <Dialog open={confirmCancelDialog} onClose={() => setConfirmCancelDialog(false)}>
          <DialogTitle>Cancel Application</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Are you sure you want to cancel this application? This action cannot be undone.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setConfirmCancelDialog(false)} color="primary">
              No, Keep Application
            </Button>
            <Button onClick={handleCancelApplication} color="error" variant="contained">
              Yes, Cancel Application
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </div>
  );
};

export default MarriageSummaryForm;
