import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Typography, Box } from '@mui/material';
import './MarriageLicenseSummary.css';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CancelIcon from '@mui/icons-material/Cancel';
const MarriageLicenseSummary = () => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false); 


  useEffect(() => {
    try {
      const savedLicenseData = localStorage.getItem('marriageFormData');
      if (savedLicenseData) {
        setFormData(JSON.parse(savedLicenseData));
      }
    } catch (err) {
      console.error('Error loading form data:', err);
    } finally {
      setLoading(false);
    }
  }, []);
 const handleModify = () => {
  try {
    console.log('Current formData:', formData);
    
    // Get the application ID
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
    localStorage.setItem('editingMarriageType', 'Marriage License'); 
    localStorage.setItem('currentEditingApplicationId', applicationId);
    localStorage.setItem('selectedMarriageOption', 'Marriage License'); 
    
    // Navigate to the form
    navigate('/MarriageForm');
  } catch (err) {
    console.error('Error setting up modification:', err);
    alert('There was a problem preparing the form for editing. Please try again.');
  }
};
  const handleBackToForm = () => {
    navigate('/MarriageForm');
  };

  const handleSubmit = () => {
    navigate('/ApplicationForm');
  };


useEffect(() => {
  try {
    const savedLicenseData = localStorage.getItem('marriageFormData');
    if (savedLicenseData) {
      const parsedData = JSON.parse(savedLicenseData);
      
      // Debug log to check wife's birth data
      console.log("Wife birth data:", {
        day: parsedData.wifeBirthDay,
        month: parsedData.wifeBirthMonth,
        year: parsedData.wifeBirthYear
      });
      
      // Log all keys to check for naming inconsistencies
      console.log("All form keys:", Object.keys(parsedData));
      
      setFormData(parsedData);
    }
  } catch (err) {
    console.error('Error loading form data:', err);
  } finally {
    setLoading(false);
  }
}, []);



  if (loading) {
    return <div className="ContainerMLSummary">Loading...</div>;
    }
    const consentPersonHusband  = formData.waliFirstName + " "  + formData.waliMiddleName  + " "+ formData.waliLastName;
    const consentPersonWife = formData.wifewaliFirstName + " " + formData.wifewaliMiddleName + " " + formData.wifewaliLastName;
    const consentPersonAddHusband = formData.waliStreet + " " + formData.waliBarangay + " " + formData.waliCity + " " + formData.waliProvince;
    const consentPersonAddWife = formData.wifewaliStreet + " " + formData.wifewaliBarangay + " " + formData.wifewaliCity + " " + formData.wifewaliProvince;
  return (
    <div className="ContainerMLSummary">
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
      <div className="FormDocumentMLSummary">
        
        <div className="DocumentHeaderMLSummary">
          <div className="FormNumberMLSummary">Municipal Form No. 90 (Form No. 2)<br/>(Revised January 2001)</div>
          <div className="DocumentNoticeMLSummary">(To be accomplished in quadruplicate using black ink)</div>
          <div className="HeaderCenterMLSummary">
            <div className="RepublicTextMLSummary">Republic of the Philippines</div>
            <div className="RegistrarTextMLSummary">OFFICE OF THE CIVIL REGISTRAR GENERAL</div>
            <div className="LicenseTitleMLSummary">APPLICATION FOR MARRIAGE LICENSE</div>
          </div>
        </div>
        
        
        <div className="TopGridMLSummary">
          <div className="TopLeftMLSummary">
            <div className="GridItemMLSummary">
              <div className="ItemLabelMLSummary">Province</div>
              <div className="ItemValueMLSummary">{ " Bulacan " || ''}</div>
            </div>
            <div className="GridItemMLSummary">
              <div className="ItemLabelMLSummary">City/Municipality</div>
              <div className="ItemValueMLSummary">{ " San Ildefonso " || ''}</div>
            </div>
            <div className="GridItemMLSummary">
              <div className="ItemLabelMLSummary">Received by:</div>
              <div className="ItemValueMLSummary"></div>
            </div>
            <div className="GridItemMLSummary">
              <div className="ItemLabelMLSummary">Date of Receipt:</div>
              <div className="ItemValueMLSummary"></div>
            </div>
          </div>
          <div className="TopRightMLSummary">
            <div className="GridItemMLSummary">
              <div className="ItemLabelMLSummary">Registry No.</div>
              <div className="ItemValueMLSummary"></div>
            </div>
            <div className="GridItemMLSummary">
              <div className="ItemLabelMLSummary">Marriage License No.:</div>
              <div className="ItemValueMLSummary"></div>
            </div>
            <div className="GridItemMLSummary">
              <div className="ItemLabelMLSummary">Date of Issuance of Marriage License:</div>
              <div className="ItemValueMLSummary"></div>
            </div>
          </div>
        </div>
        
        {/* Main Applicant Sections */}
        <table className="ApplicantTableMLSummary">
          <thead>
            <tr>
              <th className="ColumnHeaderMLSummary">GROOM</th>
              <th className="ColumnHeaderMLSummary">BRIDE</th>
            </tr>
          </thead>
          <tbody>
            {/* Civil Registrar Section */}
            <tr>
              <td className="TableCellMLSummary">
                <div className="RegistrarTitleMLSummary">The Civil Registrar</div>
                <div className="RegistrarStatementMLSummary">
                  <p>Sir/Madam:</p>
                  <p>May I apply for a license to contract marriage with <span className="UnderlinedTextMLSummary">{formData.wifeFirstName || ''} {formData.wifeLastName || ''}</span> and to this effect, being duly sworn, I hereby depose and say that I have all the necessary qualifications and none of the legal disqualifications to contract the said marriage, and that the following data are true and correct to the best of my knowledge and information.</p>
                </div>
              </td>
              <td className="TableCellMLSummary">
                <div className="RegistrarTitleMLSummary">The Civil Registrar</div>
                <div className="RegistrarStatementMLSummary">
                  <p>Sir/Madam:</p>
                  <p>May I apply for a license to contract marriage with <span className="UnderlinedTextMLSummary">{formData.husbandFirstName || ''} {formData.husbandLastName || ''}</span> and to this effect, being duly sworn, I hereby depose and say that I have all the necessary qualifications and none of the legal disqualifications to contract the said marriage, and that the following data are true and correct to the best of my knowledge and information.</p>
                </div>
              </td>
            </tr>

            {/* Name of Applicant */}
            <tr>
              <td className="TableCellMLSummary">
                <div className="FieldNumberMLSummary">1.</div>
                <div className="FieldLabelMLSummary">Name of Applicant</div>
                <div className="NameFieldsWrapperMLSummary">
                  <div className="NameFieldMLSummary">
                    <div className="NameValueMLSummary">{formData.husbandFirstName || ''}</div>
                    <div className="NameParenMLSummary">(First)</div>
                  </div>
                  <div className="NameFieldMLSummary">
                    <div className="NameValueMLSummary">{formData.husbandMiddleName || ''}</div>
                    <div className="NameParenMLSummary">(Middle)</div>
                  </div>
                  <div className="NameFieldMLSummary">
                    <div className="NameValueMLSummary">{formData.husbandLastName || ''}</div>
                    <div className="NameParenMLSummary">(Last)</div>
                  </div>
                </div>
              </td>
              <td className="TableCellMLSummary">
                <div className="FieldNumberMLSummary">1.</div>
                <div className="FieldLabelMLSummary">Name of Applicant</div>
                <div className="NameFieldsWrapperMLSummary">
                  <div className="NameFieldMLSummary">
                    <div className="NameValueMLSummary">{formData.wifeFirstName || ''}</div>
                    <div className="NameParenMLSummary">(First)</div>
                  </div>
                  <div className="NameFieldMLSummary">
                    <div className="NameValueMLSummary">{formData.wifeMiddleName || ''}</div>
                    <div className="NameParenMLSummary">(Middle)</div>
                  </div>
                  <div className="NameFieldMLSummary">
                    <div className="NameValueMLSummary">{formData.wifeLastName || ''}</div>
                    <div className="NameParenMLSummary">(Last)</div>
                  </div>
                </div>
              </td>
            </tr>

            {/* Date of Birth / Age */}
            <tr>
              <td className="TableCellMLSummary">
                <div className="FieldNumberMLSummary">2.</div>
                <div className="FieldLabelMLSummary">Date of Birth Age</div>
                <div className="DateFieldsWrapperMLSummary">
                  <div className="DateFieldMLSummary">
                    <div className="DateValueMLSummary">{formData.husbandBirthDay || ''}</div>
                    <div className="DateParenMLSummary">(Day)</div>
                  </div>
                  <div className="DateFieldMLSummary">
                    <div className="DateValueMLSummary">{formData.husbandBirthMonth || ''}</div>
                    <div className="DateParenMLSummary">(Month)</div>
                  </div>
                  <div className="DateFieldMLSummary">
                    <div className="DateValueMLSummary">{formData.husbandBirthYear || ''}</div>
                    <div className="DateParenMLSummary">(Year)</div>
                  </div>
                  <div className="DateFieldMLSummary">
                    <div className="DateValueMLSummary">{formData.husbandAge || ''}</div>
                    <div className="DateParenMLSummary">(Age)</div>
                  </div>
                </div>
              </td>
              <td className="TableCellMLSummary">
                <div className="FieldNumberMLSummary">2.</div>
                <div className="FieldLabelMLSummary">Date of Birth Age</div>
                <div className="DateFieldsWrapperMLSummary">
                  <div className="DateFieldMLSummary">
                    <div className="DateValueMLSummary">{formData.wifeBirthDay || ''}</div>
                    <div className="DateParenMLSummary">(Day)</div>
                  </div>
                  <div className="DateFieldMLSummary">
                    <div className="DateValueMLSummary">{formData.wifeBirthMonth || ''}</div>
                    <div className="DateParenMLSummary">(Month)</div>
                  </div>
                  <div className="DateFieldMLSummary">
                    <div className="DateValueMLSummary">{formData.wifeBirthYear || '' }</div>
                    <div className="DateParenMLSummary">(Year)</div>
                  </div>
                  <div className="DateFieldMLSummary">
                    <div className="DateValueMLSummary">{formData.wifeAge || ''}</div>
                    <div className="DateParenMLSummary">(Age)</div>
                  </div>
                </div>
              </td>
            </tr>

            {/* Place of Birth */}
            <tr>
              <td className="TableCellMLSummary">
                <div className="FieldNumberMLSummary">3.</div>
                <div className="FieldLabelMLSummary">Place of Birth</div>
                <div className="PlaceFieldsWrapperMLSummary">
                  <div className="PlaceFieldMLSummary">
                    <div className="PlaceValueMLSummary">{formData.husbandBirthCity || ''}</div>
                    <div className="PlaceParenMLSummary">(City/Municipality)</div>
                  </div>
                  <div className="PlaceFieldMLSummary">
                    <div className="PlaceValueMLSummary">{formData.husbandBirthProvince || ''}</div>
                    <div className="PlaceParenMLSummary">(Province)</div>
                  </div>
                  <div className="PlaceFieldMLSummary">
                    <div className="PlaceValueMLSummary">{formData.husbandBirthCountry || ''}</div>
                    <div className="PlaceParenMLSummary">(Country)</div>
                  </div>
                </div>
              </td>
              <td className="TableCellMLSummary">
                <div className="FieldNumberMLSummary">3.</div>
                <div className="FieldLabelMLSummary">Place of Birth</div>
                <div className="PlaceFieldsWrapperMLSummary">
                  <div className="PlaceFieldMLSummary">
                    <div className="PlaceValueMLSummary">{formData.wifeBirthCity || ''}</div>
                    <div className="PlaceParenMLSummary">(City/Municipality)</div>
                  </div>
                  <div className="PlaceFieldMLSummary">
                    <div className="PlaceValueMLSummary">{formData.wifeBirthProvince || ''}</div>
                    <div className="PlaceParenMLSummary">(Province)</div>
                  </div>
                  <div className="PlaceFieldMLSummary">
                    <div className="PlaceValueMLSummary">{formData.wifeBirthCountry || ''}</div>
                    <div className="PlaceParenMLSummary">(Country)</div>
                  </div>
                </div>
              </td>
            </tr>

            {/* Sex/Citizenship */}
            <tr>
              <td className="TableCellMLSummary">
                <div className="FieldNumberMLSummary">4.</div>
                <div className="FieldLabelMLSummary">Sex/ Citizenship</div>
                <div className="SexCitizenFieldsMLSummary">
                  <div className="SexFieldMLSummary">{formData.husbandSex || 'Male'}</div>
                  <div className="CitizenFieldMLSummary">{formData.husbandCitizenship || ''}</div>
                </div>
              </td>
              <td className="TableCellMLSummary">
                <div className="FieldNumberMLSummary">4.</div>
                <div className="FieldLabelMLSummary">Sex/ Citizenship</div>
                <div className="SexCitizenFieldsMLSummary">
                  <div className="SexFieldMLSummary">{formData.wifeSex || 'Female'}</div>
                  <div className="CitizenFieldMLSummary">{formData.wifeCitizenship || ''}</div>
                </div>
              </td>
            </tr>

            {/* Residence */}
            <tr>
              <td className="TableCellMLSummary">
                <div className="FieldNumberMLSummary">5.</div>
                <div className="FieldLabelMLSummary">Residence</div>
                <div className="ResidenceValueMLSummary">
                  {formData.husbandStreet || ''} {formData.husbandBarangay || ''}, {formData.husbandCity || ''}, {formData.husbandProvince || ''}
                </div>
              </td>
              <td className="TableCellMLSummary">
                <div className="FieldNumberMLSummary">5.</div>
                <div className="FieldLabelMLSummary">Residence</div>
                <div className="ResidenceValueMLSummary">
                  {formData.wifeStreet || ''} {formData.wifeBarangay || ''}, {formData.wifeCity || ''}, {formData.wifeProvince || ''}
                </div>
              </td>
            </tr>

            {/* Religion/Religious Sect */}
            <tr>
              <td className="TableCellMLSummary">
                <div className="FieldNumberMLSummary">6.</div>
                <div className="FieldLabelMLSummary">Religion/ Religious Sect</div>
                <div className="ReligionValueMLSummary">{formData.husbandReligion || ''}</div>
              </td>
              <td className="TableCellMLSummary">
                <div className="FieldNumberMLSummary">6.</div>
                <div className="FieldLabelMLSummary">Religion/ Religious Sect</div>
                <div className="ReligionValueMLSummary">{formData.wifeReligion || ''}</div>
              </td>
            </tr>

            {/* Civil Status */}
            <tr>
              <td className="TableCellMLSummary">
                <div className="FieldNumberMLSummary">7.</div>
                <div className="FieldLabelMLSummary">Civil Status</div>
                <div className="CivilStatusValueMLSummary">{formData.husbandCivilStatus || ''}</div>
              </td>
              <td className="TableCellMLSummary">
                <div className="FieldNumberMLSummary">7.</div>
                <div className="FieldLabelMLSummary">Civil Status</div>
                <div className="CivilStatusValueMLSummary">{formData.wifeCivilStatus || ''}</div>
              </td>
            </tr>

            {/* If previously married */}
            <tr>
              <td className="TableCellMLSummary">
                <div className="FieldNumberMLSummary">8.</div>
                <div className="FieldLabelMLSummary">If PREVIOUSLY MARRIED, how was it dissolved?</div>
                <div className="PreviousMarriageMLSummary">{formData.husbandPreviousMarriageStatus || ''}</div>
              </td>
              <td className="TableCellMLSummary">
                <div className="FieldNumberMLSummary">8.</div>
                <div className="FieldLabelMLSummary">If PREVIOUSLY MARRIED, how was it dissolved?</div>
                <div className="PreviousMarriageMLSummary">{formData.wifePreviousMarriageStatus || ''}</div>
              </td>
            </tr>

            {/* Place where dissolved */}
            <tr>
              <td className="TableCellMLSummary">
                <div className="FieldNumberMLSummary">9.</div>
                <div className="FieldLabelMLSummary">Place where dissolved</div>
                <div className="PlaceDissolvedFieldsMLSummary">
                  <div className="PlaceDissolvedValueMLSummary">{formData.husbandDissolutionCity || ''}</div>
                  <div className="PlaceDissolvedValueMLSummary">{formData.husbandDissolutionProvince || ''}</div>
                  <div className="PlaceDissolvedValueMLSummary">{formData.husbandDissolutionCountry || ''}</div>
                </div>
              </td>
              <td className="TableCellMLSummary">
                <div className="FieldNumberMLSummary">9.</div>
                <div className="FieldLabelMLSummary">Place where dissolved</div>
                <div className="PlaceDissolvedFieldsMLSummary">
                  <div className="PlaceDissolvedValueMLSummary">{formData.wifeDissolutionCity || ''}</div>
                  <div className="PlaceDissolvedValueMLSummary">{formData.wifeDissolutionProvince || ''}</div>
                  <div className="PlaceDissolvedValueMLSummary">{formData.wifeDissolutionCountry || ''}</div>
                </div>
              </td>
            </tr>

            {/* Date when dissolved */}
            <tr>
              <td className="TableCellMLSummary">
                <div className="FieldNumberMLSummary">10.</div>
                <div className="FieldLabelMLSummary">Date when dissolved</div>
                <div className="DissolvedDateFieldsMLSummary">
                  <div className="DissolvedDateValueMLSummary">{formData.husbandDissolutionDay || ''}</div>
                  <div className="DissolvedDateValueMLSummary">{formData.husbandDissolutionMonth || ''}</div>
                  <div className="DissolvedDateValueMLSummary">{formData.husbandDissolutionYear || ''}</div>
                </div>
              </td>
              <td className="TableCellMLSummary">
                <div className="FieldNumberMLSummary">10.</div>
                <div className="FieldLabelMLSummary">Date when dissolved</div>
                <div className="DissolvedDateFieldsMLSummary">
                  <div className="DissolvedDateValueMLSummary">{formData.wifeDissolutionDay || ''}</div>
                  <div className="DissolvedDateValueMLSummary">{formData.wifeDissolutionMonth || ''}</div>
                  <div className="DissolvedDateValueMLSummary">{formData.wifeDissolutionYear || ''}</div>
                </div>
              </td>
            </tr>

            {/* Degree of relationship */}
            <tr>
              <td className="TableCellMLSummary">
                <div className="FieldNumberMLSummary">11.</div>
                <div className="FieldLabelMLSummary">Degree of relationship of contracting parties</div>
                <div className="RelationshipValueMLSummary">{formData.degreeRelationship || ''}</div>
              </td>
              <td className="TableCellMLSummary"></td>
            </tr>

            {/* Name of Father */}
            <tr>
              <td className="TableCellMLSummary">
                <div className="FieldNumberMLSummary">12.</div>
                <div className="FieldLabelMLSummary">Name of Father</div>
                <div className="ParentNameFieldsMLSummary">
                  <div className="ParentFirstNameMLSummary">{formData.husbandFatherFirstName || ''}</div>
                  <div className="ParentMiddleNameMLSummary">{formData.husbandFatherMiddleName || ''}</div>
                  <div className="ParentLastNameMLSummary">{formData.husbandFatherLastName || ''}</div>
                </div>
              </td>
              <td className="TableCellMLSummary">
                <div className="FieldNumberMLSummary">12.</div>
                <div className="FieldLabelMLSummary">Name of Father</div>
                <div className="ParentNameFieldsMLSummary">
                  <div className="ParentFirstNameMLSummary">{formData.wifeFatherFirstName || ''}</div>
                  <div className="ParentMiddleNameMLSummary">{formData.wifeFatherMiddleName || ''}</div>
                  <div className="ParentLastNameMLSummary">{formData.wifeFatherLastName || ''}</div>
                </div>
              </td>
            </tr>

            {/* Citizenship (Father) */}
            <tr>
              <td className="TableCellMLSummary">
                <div className="FieldNumberMLSummary">13.</div>
                <div className="FieldLabelMLSummary">Citizenship</div>
                <div className="FatherCitizenshipMLSummary">{formData.husbandFatherCitizenship || ''}</div>
              </td>
              <td className="TableCellMLSummary">
                <div className="FieldNumberMLSummary">13.</div>
                <div className="FieldLabelMLSummary">Citizenship</div>
                <div className="FatherCitizenshipMLSummary">{formData.wifeFatherCitizenship || ''}</div>
              </td>
            </tr>

            {/* Residence (Father) */}
            <tr>
              <td className="TableCellMLSummary">
                <div className="FieldNumberMLSummary">14.</div>
                <div className="FieldLabelMLSummary">Residence</div>
                <div className="FatherResidenceMLSummary">{formData.husbandFatherAddress || ''}</div>
              </td>
              <td className="TableCellMLSummary">
                <div className="FieldNumberMLSummary">14.</div>
                <div className="FieldLabelMLSummary">Residence</div>
                <div className="FatherResidenceMLSummary">{formData.wifeFatherAddress || ''}</div>
              </td>
            </tr>

            {/* Maiden Name of Mother */}
            <tr>
              <td className="TableCellMLSummary">
                <div className="FieldNumberMLSummary">15.</div>
                <div className="FieldLabelMLSummary">Maiden Name of Mother</div>
                <div className="ParentNameFieldsMLSummary">
                  <div className="ParentFirstNameMLSummary">{formData.husbandMotherFirstName || ''}</div>
                  <div className="ParentMiddleNameMLSummary">{formData.husbandMotherMiddleName || ''}</div>
                  <div className="ParentLastNameMLSummary">{formData.husbandMotherLastName || ''}</div>
                </div>
              </td>
              <td className="TableCellMLSummary">
                <div className="FieldNumberMLSummary">15.</div>
                <div className="FieldLabelMLSummary">Maiden Name of Mother</div>
                <div className="ParentNameFieldsMLSummary">
                  <div className="ParentFirstNameMLSummary">{formData.wifeMotherFirstName || ''}</div>
                  <div className="ParentMiddleNameMLSummary">{formData.wifeMotherMiddleName || ''}</div>
                  <div className="ParentLastNameMLSummary">{formData.wifeMotherLastName || ''}</div>
                </div>
              </td>
            </tr>

            {/* Citizenship (Mother) */}
            <tr>
              <td className="TableCellMLSummary">
                <div className="FieldNumberMLSummary">16.</div>
                <div className="FieldLabelMLSummary">Citizenship</div>
                <div className="MotherCitizenshipMLSummary">{formData.husbandMotherCitizenship || ''}</div>
              </td>
              <td className="TableCellMLSummary">
                <div className="FieldNumberMLSummary">16.</div>
                <div className="FieldLabelMLSummary">Citizenship</div>
                <div className="MotherCitizenshipMLSummary">{formData.wifeMotherCitizenship || ''}</div>
              </td>
            </tr>

            {/* Residence (Mother) */}
            <tr>
              <td className="TableCellMLSummary">
                <div className="FieldNumberMLSummary">17.</div>
                <div className="FieldLabelMLSummary">Residence</div>
                <div className="MotherResidenceMLSummary">{formData.husbandMotherAddress || ''}</div>
              </td>
              <td className="TableCellMLSummary">
                <div className="FieldNumberMLSummary">17.</div>
                <div className="FieldLabelMLSummary">Residence</div>
                <div className="MotherResidenceMLSummary">{formData.wifeMotherAddress || ''}</div>
              </td>
            </tr>

            {/* Person who gave consent */}
            <tr>
              <td className="TableCellMLSummary">
                <div className="FieldNumberMLSummary">18.</div>
                <div className="FieldLabelMLSummary">Persons who gave consent or advice</div>
                <div className="ConsentPersonMLSummary">{ consentPersonHusband|| ''}</div>
              </td>
              <td className="TableCellMLSummary">
                <div className="FieldNumberMLSummary">18.</div>
                <div className="FieldLabelMLSummary">Persons who gave consent or advice</div>
                <div className="ConsentPersonMLSummary">{consentPersonWife|| ''}</div>
              </td>
            </tr>

            {/* Relationship */}
            <tr>
              <td className="TableCellMLSummary">
                <div className="FieldNumberMLSummary">19.</div>
                <div className="FieldLabelMLSummary">Relationship</div>
                <div className="RelationshipValueMLSummary">{formData.waliRelationship || ''}</div>
              </td>
              <td className="TableCellMLSummary">
                <div className="FieldNumberMLSummary">19.</div>
                <div className="FieldLabelMLSummary">Relationship</div>
                <div className="RelationshipValueMLSummary">{formData.wifewaliRelationship|| ''}</div>
              </td>
            </tr>

            {/* Citizenship (Consent Person) */}
            <tr>
              <td className="TableCellMLSummary">
                <div className="FieldNumberMLSummary">20.</div>
                <div className="FieldLabelMLSummary">Citizenship</div>
                <div className="ConsentCitizenshipMLSummary">{formData.waliCitizenship  || ''}</div>
              </td>
              <td className="TableCellMLSummary">
                <div className="FieldNumberMLSummary">20.</div>
                <div className="FieldLabelMLSummary">Citizenship</div>
                <div className="ConsentCitizenshipMLSummary">{formData.wifewaliCitizenship || ''}</div>
              </td>
            </tr>

            {/* Residence (Consent Person) */}
            <tr>
              <td className="TableCellMLSummary">
                <div className="FieldNumberMLSummary">21.</div>
                <div className="FieldLabelMLSummary">Residence</div>
                <div className="ConsentResidenceMLSummary">{consentPersonAddHusband  || ''}</div>
              </td>
              <td className="TableCellMLSummary">
                <div className="FieldNumberMLSummary">21.</div>
                <div className="FieldLabelMLSummary">Residence</div>
                <div className="ConsentResidenceMLSummary">{consentPersonAddWife  || ''}</div>
              </td>
            </tr>

            {/* Signature Section */}
            <tr>
              <td className="TableCellMLSummary SignatureBoxMLSummary">
                <div className="SignatureLineMLSummary"></div>
                <div className="SignatureLabelMLSummary">(Signature of Applicant)</div>
                
                <div className="SubscribedMLSummary">
                  <div className="SubscribedTextMLSummary">SUBSCRIBED AND SWORN</div>
                  <div className="SubscribedDetailsMLSummary">
                    to before me this _____ day of ________, ________, Philippines, affiant who exhibited to me his Community Tax Cert. issued on __________ at _________.
                  </div>
                </div>
                
                <div className="OfficialSignatureMLSummary">
                  <div className="OfficialLineMLSummary"></div>
                  <div className="OfficialLabelMLSummary">(Signature Over Printed Name of the Civil Registrar)</div>
                </div>
              </td>
              <td className="TableCellMLSummary SignatureBoxMLSummary">
                <div className="SignatureLineMLSummary"></div>
                <div className="SignatureLabelMLSummary">(Signature of Applicant)</div>
                
                <div className="SubscribedMLSummary">
                  <div className="SubscribedTextMLSummary">SUBSCRIBED AND SWORN</div>
                  <div className="SubscribedDetailsMLSummary">
                    to before me this _____ day of ________, ________, Philippines, affiant who exhibited to me his Community Tax Cert. issued on __________ at _________.
                  </div>
                  <div className="DocStampMLSummary">
                    <div className="StampTextMLSummary">
                      Documentary<br/>
                      stamp tax
                    </div>
                  </div>
                </div>
                
                <div className="OfficialSignatureMLSummary">
                  <div className="OfficialLineMLSummary"></div>
                  <div className="OfficialLabelMLSummary">(Signature Over Printed Name of the Civil Registrar)</div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
      // Replace the ButtonContainerMLSummary div with this code
<div className="ActionButtonContainerMLSummary">
  <Button
    variant="contained"
    color="error"
    startIcon={<CancelIcon />}
    onClick={() => setConfirmCancelDialog ? setConfirmCancelDialog(true) : navigate('/ApplicationForm')}
    className="ActionButtonMLSummary cancelButton"
    aria-label="Cancel Application"
  >
    Cancel
  </Button>
  
 
  <Button
    variant="contained" 
    startIcon={<EditIcon />}
    onClick={handleModify}
    className="ActionButtonMLSummary modifyButton"
    aria-label="Modify Form"
  >
    Modify
  </Button>
  
  <Button
    variant="contained"
    startIcon={<CheckIcon />}
    onClick={handleSubmit}
    className="ActionButtonMLSummary doneButton"
    aria-label="Done"
  >
    Done
  </Button>
</div>
      
    </div>
  );
};

export default MarriageLicenseSummary;