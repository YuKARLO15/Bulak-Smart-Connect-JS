import React, { useState } from "react";
import { 
  Box, 
  Typography, 
  Paper, 
  Button, 
  Divider 
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import "./CopyBirthCertificate.css";

const CopyBirthCertificate = ({ formData = {}, handleChange }) => {
  const navigate = useNavigate();
  const [showExtension, setShowExtension] = useState(formData.hasExtension || false);
  const [localFormData, setLocalFormData] = useState(formData || {});
  const requiredField = <span className="RequiredFieldCopyBirth">*</span>;

 
  const months = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  const handleLocalChange = (e) => {
    const { name, value } = e.target;
    
    setLocalFormData(prev => ({
      ...prev,
      [name]: value
    }));
    

    if (typeof handleChange === 'function') {
      handleChange(e);
    }
  };

  const handleExtensionChange = (e) => {
    setShowExtension(e.target.checked);
    if (typeof handleChange === 'function') {
      handleChange({
        target: {
          name: "hasExtension",
          value: e.target.checked
        }
      });
    }
  };
  
  const handleNextClick = () => {
    
    navigate("/CTCBirthCertificate");
  };

  return (  
    <Box className="CopyBirthCertificateContainer">
      <Typography variant="h5" className="FormTitleCopyBirth">
        Request a Copy of Birth Certificate
      </Typography>
      <Box className="CopyBirthCertificateContainerCopyBirth">
        <Typography variant="body1" className="FormSubtitleCopyBirth">
          Please provide the information exactly as it appears on your birth certificate
        </Typography>

        <Paper elevation={3} className="FormPaperCopyBirth">
          <Box className="FormSectionCopyBirth">
            <Typography variant="h6" className="SectionTitleCopyBirth">
              Personal Information
            </Typography>
            <Typography className="SubSectionTitleCopyBirth">
                 FULL NAME  {requiredField}
                </Typography>
            <div className="FormRowChild">
              <div className="FormGroupChild">
                <label className="FormLabelChild">
                  First Name {requiredField}
                </label>
                <input
                  type="text"
                  name="firstName"
                  value={localFormData.firstName || ""}
                  onChange={handleLocalChange}
                  className="FormInputChild"
                  required
                />
              </div>

              <div className="FormGroupChild">
                <label className="FormLabelChild">
                  Middle Name
                </label>
                <input
                  type="text"
                  name="middleName"
                  value={localFormData.middleName || ""}
                  onChange={handleLocalChange}
                  className="FormInputChild"
                />
              </div>

              <div className="FormGroupChild">
                <label className="FormLabelChild">
                  Last Name {requiredField}
                </label>
                <input
                  type="text"
                  name="lastName"
                  value={localFormData.lastName || ""}
                  onChange={handleLocalChange}
                  className="FormInputChild"
                  required
                />
              </div>
            </div>

            <div className="FormRowChild">
              <div className="CheckboxContainerChild">
                <input
                  type="checkbox"
                  id="extensionCheckbox"
                  checked={showExtension}
                  onChange={handleExtensionChange}
                  className="CheckboxInputChild"
                />
                <label htmlFor="extensionCheckbox" className="CheckboxLabelChild">
                  I have an extension name (Jr., Sr., III, etc.)
                </label>
              </div>

              {showExtension && (
                <div className="ExtensionContainerChild">
                  <span className="ExtensionLabelChild">Extension</span>
                  <select
                    name="extension"
                    value={localFormData.extension || ""}
                    onChange={handleLocalChange}
                    className="SelectInputChild"
                  >
                    <option value="">Select</option>
                    <option value="Jr.">Jr.</option>
                    <option value="Sr.">Sr.</option>
                    <option value="II">II</option>
                    <option value="III">III</option>
                    <option value="IV">IV</option>
                    <option value="V">V</option>
                  </select>
                </div>
              )}
            </div>
          </Box>

          <Divider className="SectionDividerCopyBirth" />

          <Box className="FormSectionCopyBirth">
            <Typography variant="h6" className="SectionTitleCopyBirth">
              Birth Information
            </Typography>
            
            <Typography variant="subtitle1" className="SubSectionTitleCopyBirth">
              Date of Birth {requiredField}
            </Typography>
            
            <div className="DateInputsRowChild">
              <div className="FormGroupChild">
                <label className="FormLabelChild">Month</label>
                <select
                  name="birthMonth"
                  value={localFormData.birthMonth || ""}
                  onChange={handleLocalChange}
                  className="SelectInputChild"
                  required
                >
                  <option value="">Select</option>
                  {months.map((month) => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
              </div>
              
              <div className="FormGroupChild">
                <label className="FormLabelChild">Day</label>
                <select
                  name="birthDay"
                  value={localFormData.birthDay || ""}
                  onChange={handleLocalChange}
                  className="SelectInputChild"
                  required
                >
                  <option value="">Select</option>
                  {days.map((day) => (
                    <option key={day} value={day}>{day}</option>
                  ))}
                </select>
              </div>
              
              <div className="FormGroupChild">
                <label className="FormLabelChild">Year</label>
                <select
                  name="birthYear"
                  value={localFormData.birthYear || ""}
                  onChange={handleLocalChange}
                  className="SelectInputChild"
                  required
                >
                  <option value="">Select</option>
                  {years.map((year) => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <Typography variant="subtitle1" className="SubSectionTitleCopyBirth" style={{ marginTop: '20px' }}>
              Place of Birth {requiredField}
            </Typography>
            
            <div className="FormRowChild">
              <div className="FormFullWidthGroupChild">
                <label className="FormLabelChild">Hospital/Clinic/Institution</label>
                <input
                  type="text"
                  name="hospital"
                  value={localFormData.hospital || ""}
                  onChange={handleLocalChange}
                  className="FormInputChild"
                />
              </div>
            </div>
            
            <div className="FormRowChild">
              <div className="FormGroupChild">
                <label className="FormLabelChild">City/Municipality {requiredField}</label>
                <input
                  type="text"
                  name="city"
                  value={localFormData.city || ""}
                  onChange={handleLocalChange}
                  className="FormInputChild"
                  required
                />
              </div>
              
              <div className="FormGroupChild">
                <label className="FormLabelChild">Province {requiredField}</label>
                <input
                  type="text"
                  name="province"
                  value={localFormData.province || ""}
                  onChange={handleLocalChange}
                  className="FormInputChild"
                  required
                />
              </div>
            </div>
          </Box>

          <Divider className="SectionDividerCopyBirth" />

          <Box className="FormSectionCopyBirth">
            <Typography variant="h6" className="SectionTitleCopyBirth">
              Parents Information
            </Typography>
            
            <Typography variant="subtitle1" className="SubSectionTitleCopyBirth">
              Mother's Maiden Name {requiredField}
            </Typography>
            
            <div className="FormRowChild">
              <div className="FormGroupChild">
                <label className="FormLabelChild">First Name {requiredField}</label>
                <input
                  type="text"
                  name="motherFirstName"
                  value={localFormData.motherFirstName || ""}
                  onChange={handleLocalChange}
                  className="FormInputChild"
                  required
                />
              </div>
              
              <div className="FormGroupChild">
                <label className="FormLabelChild">Middle Name</label>
                <input
                  type="text"
                  name="motherMiddleName"
                  value={localFormData.motherMiddleName || ""}
                  onChange={handleLocalChange}
                  className="FormInputChild"
                />
              </div>
              
              <div className="FormGroupChild">
                <label className="FormLabelChild">Last Name {requiredField}</label>
                <input
                  type="text"
                  name="motherLastName"
                  value={localFormData.motherLastName || ""}
                  onChange={handleLocalChange}
                  className="FormInputChild"
                  required
                />
              </div>
            </div>
            
            <Typography variant="subtitle1" className="SubSectionTitleCopyBirth" style={{ marginTop: '20px' }}>
              Father's Name
            </Typography>
            
            <div className="FormRowChild">
              <div className="FormGroupChild">
                <label className="FormLabelChild">First Name</label>
                <input
                  type="text"
                  name="fatherFirstName"
                  value={localFormData.fatherFirstName || ""}
                  onChange={handleLocalChange}
                  className="FormInputChild"
                />
              </div>
              
              <div className="FormGroupChild">
                <label className="FormLabelChild">Middle Name</label>
                <input
                  type="text"
                  name="fatherMiddleName"
                  value={localFormData.fatherMiddleName || ""}
                  onChange={handleLocalChange}
                  className="FormInputChild"
                />
              </div>
              
              <div className="FormGroupChild">
                <label className="FormLabelChild">Last Name</label>
                <input
                  type="text"
                  name="fatherLastName"
                  value={localFormData.fatherLastName || ""}
                  onChange={handleLocalChange}
                  className="FormInputChild"
                />
              </div>
            </div>
          </Box>

          <Divider className="SectionDividerCopyBirth" />

          <Box className="FormSectionCopyBirth">
            <Typography variant="h6" className="SectionTitleCopyBirth">
              Purpose of Request
            </Typography>
            
            <div className="FormRowChild">
              <div className="FormGroupChild" style={{ width: '100%' }}>
                <label className="FormLabelChild">Purpose</label>
                <select
                  name="purpose"
                  value={localFormData.purpose || ""}
                  onChange={handleLocalChange}
                  className="SelectInputChild"
                  style={{ width: '100%' }}
                >
                  <option value="">Select</option>
                  <option value="Passport Application">Passport Application</option>
                  <option value="School Requirements">School Requirements</option>
                  <option value="Employment">Employment</option>
                  <option value="Claim Benefits/Loan">Claim Benefits/Loan</option>
                  <option value="Marriage License">Marriage License</option>
                  <option value="Legal Purposes">Legal Purposes</option>
                  <option value="Travel">Travel</option>
                  <option value="Others">Others</option>
                </select>
              </div>
            </div>
            
            {localFormData.purpose === "Others" && (
              <div className="FormRowChild">
                <div className="FormGroupChild" style={{ width: '100%' }}>
                  <label className="FormLabelChild">Specify Purpose</label>
                  <input
                    type="text"
                    name="otherPurpose"
                    value={localFormData.otherPurpose || ""}
                    onChange={handleLocalChange}
                    className="FormInputChild"
                  />
                </div>
              </div>
            )}
          </Box>

          <Box className="FormNoteCopyBirth">
            <Typography variant="body2">
              Note: The information you provide should exactly match what appears on your birth certificate record.
              Inaccurate information may result in delay or inability to locate your records.
            </Typography>
          </Box>
        </Paper>
        
        <Box className="ButtonContainerCopyBirth" style={{ marginTop: '20px', display: 'flex', justifyContent: 'center' }}>
          <Button 
            variant="contained" 
            color="primary"
            onClick={handleNextClick}
            className="NextButtonCopyBirth"
            size="large"
          >
            NEXT
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default CopyBirthCertificate;