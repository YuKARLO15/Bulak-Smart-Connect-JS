import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import './AdminMarriageLicensePreview.css';

const AdminMarriageLicensePreview = ({ applicationData }) => {
  const formData = applicationData?.formData || {};


  const formatName = (firstName = '', middleName = '', lastName = '') => {
    return [firstName, middleName, lastName].filter(Boolean).join(' ') || 'N/A';
  };

 
  const formatAddress = (street = '', barangay = '', city = '', province = '') => {
    return [street, barangay, city, province].filter(Boolean).join(', ') || 'N/A';
  };


  const consentPersonHusband = formatName(formData.waliFirstName, formData.waliMiddleName, formData.waliLastName);
  const consentPersonWife = formatName(formData.wifewaliFirstName, formData.wifewaliMiddleName, formData.wifewaliLastName);
  
  const consentPersonAddHusband = formatAddress(
    formData.waliStreet,
    formData.waliBarangay,
    formData.waliCity,
    formData.waliProvince
  );
  
  const consentPersonAddWife = formatAddress(
    formData.wifewaliStreet,
    formData.wifewaliBarangay,
    formData.wifewaliCity,
    formData.wifewaliProvince
  );

  return (
    <div className="AdminContainerMLApplication">
      <div className="AdminFormDocumentMLApplication">
        <div className="AdminDocumentHeaderMLApplication">
          <div className="AdminFormNumberMLApplication">Municipal Form No. 90 (Form No. 2)<br/>(Revised January 2001)</div>
          <div className="AdminDocumentNoticeMLApplication">(To be accomplished in quadruplicate using black ink)</div>
          <div className="AdminHeaderCenterMLApplication">
            <div className="AdminRepublicTextMLApplication">Republic of the Philippines</div>
            <div className="AdminRegistrarTextMLApplication">OFFICE OF THE CIVIL REGISTRAR GENERAL</div>
            <div className="AdminLicenseTitleMLApplication">APPLICATION FOR MARRIAGE LICENSE</div>
          </div>
        </div>
        
        <div className="AdminTopGridMLApplication">
          <div className="AdminTopLeftMLApplication">
            <div className="AdminGridItemMLApplication">
              <div className="AdminItemLabelMLApplication">Province</div>
              <div className="AdminItemValueMLApplication">Bulacan</div>
            </div>
            <div className="AdminGridItemMLApplication">
              <div className="AdminItemLabelMLApplication">City/Municipality</div>
              <div className="AdminItemValueMLApplication">San Ildefonso</div>
            </div>
            <div className="AdminGridItemMLApplication">
              <div className="AdminItemLabelMLApplication">Received by:</div>
              <div className="AdminItemValueMLApplication"></div>
            </div>
            <div className="AdminGridItemMLApplication">
              <div className="AdminItemLabelMLApplication">Date of Receipt:</div>
              <div className="AdminItemValueMLApplication"></div>
            </div>
          </div>
          <div className="AdminTopRightMLApplication">
            <div className="AdminGridItemMLApplication">
              <div className="AdminItemLabelMLApplication">Registry No.</div>
              <div className="AdminItemValueMLApplication"></div>
            </div>
            <div className="AdminGridItemMLApplication">
              <div className="AdminItemLabelMLApplication">Marriage License No.:</div>
              <div className="AdminItemValueMLApplication"></div>
            </div>
            <div className="AdminGridItemMLApplication">
              <div className="AdminItemLabelMLApplication">Date of Issuance of Marriage License:</div>
              <div className="AdminItemValueMLApplication"></div>
            </div>
          </div>
        </div>
        
        <table className="AdminApplicantTableMLApplication">
          <thead>
            <tr>
              <th className="AdminColumnHeaderMLApplication">GROOM</th>
              <th className="AdminColumnHeaderMLApplication">BRIDE</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="AdminTableCellMLApplication">
                <div className="AdminRegistrarTitleMLApplication">The Civil Registrar</div>
                <div className="AdminRegistrarStatementMLApplication">
                  <p>Sir/Madam:</p>
                  <p>May I apply for a license to contract marriage with <span className="AdminUnderlinedTextMLApplication">{formData.wifeFirstName || ''} {formData.wifeLastName || ''}</span> and to this effect, being duly sworn, I hereby depose and say that I have all the necessary qualifications and none of the legal disqualifications to contract the said marriage, and that the following data are true and correct to the best of my knowledge and information.</p>
                </div>
              </td>
              <td className="AdminTableCellMLApplication">
                <div className="AdminRegistrarTitleMLApplication">The Civil Registrar</div>
                <div className="AdminRegistrarStatementMLApplication">
                  <p>Sir/Madam:</p>
                  <p>May I apply for a license to contract marriage with <span className="AdminUnderlinedTextMLApplication">{formData.husbandFirstName || ''} {formData.husbandLastName || ''}</span> and to this effect, being duly sworn, I hereby depose and say that I have all the necessary qualifications and none of the legal disqualifications to contract the said marriage, and that the following data are true and correct to the best of my knowledge and information.</p>
                </div>
              </td>
            </tr>

            <tr>
              <td className="AdminTableCellMLApplication">
                <div className="AdminFieldNumberMLApplication">1.</div>
                <div className="AdminFieldLabelMLApplication">Name of Applicant</div>
                <div className="AdminNameFieldsWrapperMLApplication">
                  <div className="AdminNameFieldMLApplication">
                    <div className="AdminNameValueMLApplication">{formData.husbandFirstName || ''}</div>
                    <div className="AdminNameParenMLApplication">(First)</div>
                  </div>
                  <div className="AdminNameFieldMLApplication">
                    <div className="AdminNameValueMLApplication">{formData.husbandMiddleName || ''}</div>
                    <div className="AdminNameParenMLApplication">(Middle)</div>
                  </div>
                  <div className="AdminNameFieldMLApplication">
                    <div className="AdminNameValueMLApplication">{formData.husbandLastName || ''}</div>
                    <div className="AdminNameParenMLApplication">(Last)</div>
                  </div>
                </div>
              </td>
              <td className="AdminTableCellMLApplication">
                <div className="AdminFieldNumberMLApplication">1.</div>
                <div className="AdminFieldLabelMLApplication">Name of Applicant</div>
                <div className="AdminNameFieldsWrapperMLApplication">
                  <div className="AdminNameFieldMLApplication">
                    <div className="AdminNameValueMLApplication">{formData.wifeFirstName || ''}</div>
                    <div className="AdminNameParenMLApplication">(First)</div>
                  </div>
                  <div className="AdminNameFieldMLApplication">
                    <div className="AdminNameValueMLApplication">{formData.wifeMiddleName || ''}</div>
                    <div className="AdminNameParenMLApplication">(Middle)</div>
                  </div>
                  <div className="AdminNameFieldMLApplication">
                    <div className="AdminNameValueMLApplication">{formData.wifeLastName || ''}</div>
                    <div className="AdminNameParenMLApplication">(Last)</div>
                  </div>
                </div>
              </td>
            </tr>

            <tr>
              <td className="AdminTableCellMLApplication">
                <div className="AdminFieldNumberMLApplication">2.</div>
                <div className="AdminFieldLabelMLApplication">Date of Birth Age</div>
                <div className="AdminDateFieldsWrapperMLApplication">
                  <div className="AdminDateFieldMLApplication">
                    <div className="AdminDateValueMLApplication">{formData.husbandBirthDay || ''}</div>
                    <div className="AdminDateParenMLApplication">(Day)</div>
                  </div>
                  <div className="AdminDateFieldMLApplication">
                    <div className="AdminDateValueMLApplication">{formData.husbandBirthMonth || ''}</div>
                    <div className="AdminDateParenMLApplication">(Month)</div>
                  </div>
                  <div className="AdminDateFieldMLApplication">
                    <div className="AdminDateValueMLApplication">{formData.husbandBirthYear || ''}</div>
                    <div className="AdminDateParenMLApplication">(Year)</div>
                  </div>
                  <div className="AdminDateFieldMLApplication">
                    <div className="AdminDateValueMLApplication">{formData.husbandAge || ''}</div>
                    <div className="AdminDateParenMLApplication">(Age)</div>
                  </div>
                </div>
              </td>
              <td className="AdminTableCellMLApplication">
                <div className="AdminFieldNumberMLApplication">2.</div>
                <div className="AdminFieldLabelMLApplication">Date of Birth Age</div>
                <div className="AdminDateFieldsWrapperMLApplication">
                  <div className="AdminDateFieldMLApplication">
                    <div className="AdminDateValueMLApplication">{formData.wifeBirthDay || ''}</div>
                    <div className="AdminDateParenMLApplication">(Day)</div>
                  </div>
                  <div className="AdminDateFieldMLApplication">
                    <div className="AdminDateValueMLApplication">{formData.wifeBirthMonth || ''}</div>
                    <div className="AdminDateParenMLApplication">(Month)</div>
                  </div>
                  <div className="AdminDateFieldMLApplication">
                    <div className="AdminDateValueMLApplication">{formData.wifeBirthYear || ''}</div>
                    <div className="AdminDateParenMLApplication">(Year)</div>
                  </div>
                  <div className="AdminDateFieldMLApplication">
                    <div className="AdminDateValueMLApplication">{formData.wifeAge || ''}</div>
                    <div className="AdminDateParenMLApplication">(Age)</div>
                  </div>
                </div>
              </td>
            </tr>

            {/* Place of Birth */}
            <tr>
              <td className="AdminTableCellMLApplication">
                <div className="AdminFieldNumberMLApplication">3.</div>
                <div className="AdminFieldLabelMLApplication">Place of Birth</div>
                <div className="AdminPlaceFieldsWrapperMLApplication">
                  <div className="AdminPlaceFieldMLApplication">
                    <div className="AdminPlaceValueMLApplication">{formData.husbandBirthCity || ''}</div>
                    <div className="AdminPlaceParenMLApplication">(City/Municipality)</div>
                  </div>
                  <div className="AdminPlaceFieldMLApplication">
                    <div className="AdminPlaceValueMLApplication">{formData.husbandBirthProvince || ''}</div>
                    <div className="AdminPlaceParenMLApplication">(Province)</div>
                  </div>
                  <div className="AdminPlaceFieldMLApplication">
                    <div className="AdminPlaceValueMLApplication">{formData.husbandBirthCountry || ''}</div>
                    <div className="AdminPlaceParenMLApplication">(Country)</div>
                  </div>
                </div>
              </td>
              <td className="AdminTableCellMLApplication">
                <div className="AdminFieldNumberMLApplication">3.</div>
                <div className="AdminFieldLabelMLApplication">Place of Birth</div>
                <div className="AdminPlaceFieldsWrapperMLApplication">
                  <div className="AdminPlaceFieldMLApplication">
                    <div className="AdminPlaceValueMLApplication">{formData.wifeBirthCity || ''}</div>
                    <div className="AdminPlaceParenMLApplication">(City/Municipality)</div>
                  </div>
                  <div className="AdminPlaceFieldMLApplication">
                    <div className="AdminPlaceValueMLApplication">{formData.wifeBirthProvince || ''}</div>
                    <div className="AdminPlaceParenMLApplication">(Province)</div>
                  </div>
                  <div className="AdminPlaceFieldMLApplication">
                    <div className="AdminPlaceValueMLApplication">{formData.wifeBirthCountry || ''}</div>
                    <div className="AdminPlaceParenMLApplication">(Country)</div>
                  </div>
                </div>
              </td>
            </tr>

            {/* Sex/Citizenship */}
            <tr>
              <td className="AdminTableCellMLApplication">
                <div className="AdminFieldNumberMLApplication">4.</div>
                <div className="AdminFieldLabelMLApplication">Sex/ Citizenship</div>
                <div className="AdminSexCitizenFieldsMLApplication">
                  <div className="AdminSexFieldMLApplication">{formData.husbandSex || 'Male'}</div>
                  <div className="AdminCitizenFieldMLApplication">{formData.husbandCitizenship || ''}</div>
                </div>
              </td>
              <td className="AdminTableCellMLApplication">
                <div className="AdminFieldNumberMLApplication">4.</div>
                <div className="AdminFieldLabelMLApplication">Sex/ Citizenship</div>
                <div className="AdminSexCitizenFieldsMLApplication">
                  <div className="AdminSexFieldMLApplication">{formData.wifeSex || 'Female'}</div>
                  <div className="AdminCitizenFieldMLApplication">{formData.wifeCitizenship || ''}</div>
                </div>
              </td>
            </tr>

            {/* Residence */}
            <tr>
              <td className="AdminTableCellMLApplication">
                <div className="AdminFieldNumberMLApplication">5.</div>
                <div className="AdminFieldLabelMLApplication">Residence</div>
                <div className="AdminResidenceValueMLApplication">
                  {formatAddress(formData.husbandStreet, formData.husbandBarangay, formData.husbandCity, formData.husbandProvince)}
                </div>
              </td>
              <td className="AdminTableCellMLApplication">
                <div className="AdminFieldNumberMLApplication">5.</div>
                <div className="AdminFieldLabelMLApplication">Residence</div>
                <div className="AdminResidenceValueMLApplication">
                  {formatAddress(formData.wifeStreet, formData.wifeBarangay, formData.wifeCity, formData.wifeProvince)}
                </div>
              </td>
            </tr>

            {/* Religion/Religious Sect */}
            <tr>
              <td className="AdminTableCellMLApplication">
                <div className="AdminFieldNumberMLApplication">6.</div>
                <div className="AdminFieldLabelMLApplication">Religion/ Religious Sect</div>
                <div className="AdminReligionValueMLApplication">{formData.husbandReligion || ''}</div>
              </td>
              <td className="AdminTableCellMLApplication">
                <div className="AdminFieldNumberMLApplication">6.</div>
                <div className="AdminFieldLabelMLApplication">Religion/ Religious Sect</div>
                <div className="AdminReligionValueMLApplication">{formData.wifeReligion || ''}</div>
              </td>
            </tr>

            {/* Civil Status */}
            <tr>
              <td className="AdminTableCellMLApplication">
                <div className="AdminFieldNumberMLApplication">7.</div>
                <div className="AdminFieldLabelMLApplication">Civil Status</div>
                <div className="AdminCivilStatusValueMLApplication">{formData.husbandCivilStatus || ''}</div>
              </td>
              <td className="AdminTableCellMLApplication">
                <div className="AdminFieldNumberMLApplication">7.</div>
                <div className="AdminFieldLabelMLApplication">Civil Status</div>
                <div className="AdminCivilStatusValueMLApplication">{formData.wifeCivilStatus || ''}</div>
              </td>
            </tr>

            {/* If previously married */}
            <tr>
              <td className="AdminTableCellMLApplication">
                <div className="AdminFieldNumberMLApplication">8.</div>
                <div className="AdminFieldLabelMLApplication">If PREVIOUSLY MARRIED, how was it dissolved?</div>
                <div className="AdminPreviousMarriageMLApplication">{formData.husbandPreviousMarriageStatus || ''}</div>
              </td>
              <td className="AdminTableCellMLApplication">
                <div className="AdminFieldNumberMLApplication">8.</div>
                <div className="AdminFieldLabelMLApplication">If PREVIOUSLY MARRIED, how was it dissolved?</div>
                <div className="AdminPreviousMarriageMLApplication">{formData.wifePreviousMarriageStatus || ''}</div>
              </td>
            </tr>

            {/* Place where dissolved */}
            <tr>
              <td className="AdminTableCellMLApplication">
                <div className="AdminFieldNumberMLApplication">9.</div>
                <div className="AdminFieldLabelMLApplication">Place where dissolved</div>
                <div className="AdminPlaceDissolvedFieldsMLApplication">
                  <div className="AdminPlaceDissolvedValueMLApplication">{formData.husbandDissolutionCity || ''}</div>
                  <div className="AdminPlaceDissolvedValueMLApplication">{formData.husbandDissolutionProvince || ''}</div>
                  <div className="AdminPlaceDissolvedValueMLApplication">{formData.husbandDissolutionCountry || ''}</div>
                </div>
              </td>
              <td className="AdminTableCellMLApplication">
                <div className="AdminFieldNumberMLApplication">9.</div>
                <div className="AdminFieldLabelMLApplication">Place where dissolved</div>
                <div className="AdminPlaceDissolvedFieldsMLApplication">
                  <div className="AdminPlaceDissolvedValueMLApplication">{formData.wifeDissolutionCity || ''}</div>
                  <div className="AdminPlaceDissolvedValueMLApplication">{formData.wifeDissolutionProvince || ''}</div>
                  <div className="AdminPlaceDissolvedValueMLApplication">{formData.wifeDissolutionCountry || ''}</div>
                </div>
              </td>
            </tr>

            {/* Date when dissolved */}
            <tr>
              <td className="AdminTableCellMLApplication">
                <div className="AdminFieldNumberMLApplication">10.</div>
                <div className="AdminFieldLabelMLApplication">Date when dissolved</div>
                <div className="AdminDissolvedDateFieldsMLApplication">
                  <div className="AdminDissolvedDateValueMLApplication">{formData.husbandDissolutionDay || ''}</div>
                  <div className="AdminDissolvedDateValueMLApplication">{formData.husbandDissolutionMonth || ''}</div>
                  <div className="AdminDissolvedDateValueMLApplication">{formData.husbandDissolutionYear || ''}</div>
                </div>
              </td>
              <td className="AdminTableCellMLApplication">
                <div className="AdminFieldNumberMLApplication">10.</div>
                <div className="AdminFieldLabelMLApplication">Date when dissolved</div>
                <div className="AdminDissolvedDateFieldsMLApplication">
                  <div className="AdminDissolvedDateValueMLApplication">{formData.wifeDissolutionDay || ''}</div>
                  <div className="AdminDissolvedDateValueMLApplication">{formData.wifeDissolutionMonth || ''}</div>
                  <div className="AdminDissolvedDateValueMLApplication">{formData.wifeDissolutionYear || ''}</div>
                </div>
              </td>
            </tr>

            {/* Degree of relationship */}
            <tr>
              <td className="AdminTableCellMLApplication">
                <div className="AdminFieldNumberMLApplication">11.</div>
                <div className="AdminFieldLabelMLApplication">Degree of relationship of contracting parties</div>
                <div className="AdminRelationshipValueMLApplication">{formData.degreeRelationship || ''}</div>
              </td>
              <td className="AdminTableCellMLApplication"></td>
            </tr>

            {/* Name of Father */}
            <tr>
              <td className="AdminTableCellMLApplication">
                <div className="AdminFieldNumberMLApplication">12.</div>
                <div className="AdminFieldLabelMLApplication">Name of Father</div>
                <div className="AdminParentNameFieldsMLApplication">
                  <div className="AdminParentFirstNameMLApplication">{formData.husbandFatherFirstName || ''}</div>
                  <div className="AdminParentMiddleNameMLApplication">{formData.husbandFatherMiddleName || ''}</div>
                  <div className="AdminParentLastNameMLApplication">{formData.husbandFatherLastName || ''}</div>
                </div>
              </td>
              <td className="AdminTableCellMLApplication">
                <div className="AdminFieldNumberMLApplication">12.</div>
                <div className="AdminFieldLabelMLApplication">Name of Father</div>
                <div className="AdminParentNameFieldsMLApplication">
                  <div className="AdminParentFirstNameMLApplication">{formData.wifeFatherFirstName || ''}</div>
                  <div className="AdminParentMiddleNameMLApplication">{formData.wifeFatherMiddleName || ''}</div>
                  <div className="AdminParentLastNameMLApplication">{formData.wifeFatherLastName || ''}</div>
                </div>
              </td>
            </tr>

            {/* Citizenship (Father) */}
            <tr>
              <td className="AdminTableCellMLApplication">
                <div className="AdminFieldNumberMLApplication">13.</div>
                <div className="AdminFieldLabelMLApplication">Citizenship</div>
                <div className="AdminFatherCitizenshipMLApplication">{formData.husbandFatherCitizenship || ''}</div>
              </td>
              <td className="AdminTableCellMLApplication">
                <div className="AdminFieldNumberMLApplication">13.</div>
                <div className="AdminFieldLabelMLApplication">Citizenship</div>
                <div className="AdminFatherCitizenshipMLApplication">{formData.wifeFatherCitizenship || ''}</div>
              </td>
            </tr>

            {/* Residence (Father) */}
            <tr>
              <td className="AdminTableCellMLApplication">
                <div className="AdminFieldNumberMLApplication">14.</div>
                <div className="AdminFieldLabelMLApplication">Residence</div>
                <div className="AdminFatherResidenceMLApplication">{formData.husbandFatherAddress || ''}</div>
              </td>
              <td className="AdminTableCellMLApplication">
                <div className="AdminFieldNumberMLApplication">14.</div>
                <div className="AdminFieldLabelMLApplication">Residence</div>
                <div className="AdminFatherResidenceMLApplication">{formData.wifeFatherAddress || ''}</div>
              </td>
            </tr>

            {/* Maiden Name of Mother */}
            <tr>
              <td className="AdminTableCellMLApplication">
                <div className="AdminFieldNumberMLApplication">15.</div>
                <div className="AdminFieldLabelMLApplication">Maiden Name of Mother</div>
                <div className="AdminParentNameFieldsMLApplication">
                  <div className="AdminParentFirstNameMLApplication">{formData.husbandMotherFirstName || ''}</div>
                  <div className="AdminParentMiddleNameMLApplication">{formData.husbandMotherMiddleName || ''}</div>
                  <div className="AdminParentLastNameMLApplication">{formData.husbandMotherLastName || ''}</div>
                </div>
              </td>
              <td className="AdminTableCellMLApplication">
                <div className="AdminFieldNumberMLApplication">15.</div>
                <div className="AdminFieldLabelMLApplication">Maiden Name of Mother</div>
                <div className="AdminParentNameFieldsMLApplication">
                  <div className="AdminParentFirstNameMLApplication">{formData.wifeMotherFirstName || ''}</div>
                  <div className="AdminParentMiddleNameMLApplication">{formData.wifeMotherMiddleName || ''}</div>
                  <div className="AdminParentLastNameMLApplication">{formData.wifeMotherLastName || ''}</div>
                </div>
              </td>
            </tr>

            {/* Citizenship (Mother) */}
            <tr>
              <td className="AdminTableCellMLApplication">
                <div className="AdminFieldNumberMLApplication">16.</div>
                <div className="AdminFieldLabelMLApplication">Citizenship</div>
                <div className="AdminMotherCitizenshipMLApplication">{formData.husbandMotherCitizenship || ''}</div>
              </td>
              <td className="AdminTableCellMLApplication">
                <div className="AdminFieldNumberMLApplication">16.</div>
                <div className="AdminFieldLabelMLApplication">Citizenship</div>
                <div className="AdminMotherCitizenshipMLApplication">{formData.wifeMotherCitizenship || ''}</div>
              </td>
            </tr>

            {/* Residence (Mother) */}
            <tr>
              <td className="AdminTableCellMLApplication">
                <div className="AdminFieldNumberMLApplication">17.</div>
                <div className="AdminFieldLabelMLApplication">Residence</div>
                <div className="AdminMotherResidenceMLApplication">{formData.husbandMotherAddress || ''}</div>
              </td>
              <td className="AdminTableCellMLApplication">
                <div className="AdminFieldNumberMLApplication">17.</div>
                <div className="AdminFieldLabelMLApplication">Residence</div>
                <div className="AdminMotherResidenceMLApplication">{formData.wifeMotherAddress || ''}</div>
              </td>
            </tr>

            {/* Person who gave consent */}
            <tr>
              <td className="AdminTableCellMLApplication">
                <div className="AdminFieldNumberMLApplication">18.</div>
                <div className="AdminFieldLabelMLApplication">Persons who gave consent or advice</div>
                <div className="AdminConsentPersonMLApplication">{consentPersonHusband}</div>
              </td>
              <td className="AdminTableCellMLApplication">
                <div className="AdminFieldNumberMLApplication">18.</div>
                <div className="AdminFieldLabelMLApplication">Persons who gave consent or advice</div>
                <div className="AdminConsentPersonMLApplication">{consentPersonWife}</div>
              </td>
            </tr>

            {/* Relationship */}
            <tr>
              <td className="AdminTableCellMLApplication">
                <div className="AdminFieldNumberMLApplication">19.</div>
                <div className="AdminFieldLabelMLApplication">Relationship</div>
                <div className="AdminRelationshipValueMLApplication">{formData.waliRelationship || ''}</div>
              </td>
              <td className="AdminTableCellMLApplication">
                <div className="AdminFieldNumberMLApplication">19.</div>
                <div className="AdminFieldLabelMLApplication">Relationship</div>
                <div className="AdminRelationshipValueMLApplication">{formData.wifewaliRelationship || ''}</div>
              </td>
            </tr>

            <tr>
              <td className="AdminTableCellMLApplication">
                <div className="AdminFieldNumberMLApplication">20.</div>
                <div className="AdminFieldLabelMLApplication">Citizenship</div>
                <div className="AdminConsentCitizenshipMLApplication">{formData.waliCitizenship || ''}</div>
              </td>
              <td className="AdminTableCellMLApplication">
                <div className="AdminFieldNumberMLApplication">20.</div>
                <div className="AdminFieldLabelMLApplication">Citizenship</div>
                <div className="AdminConsentCitizenshipMLApplication">{formData.wifewaliCitizenship || ''}</div>
              </td>
            </tr>

            <tr>
              <td className="AdminTableCellMLApplication">
                <div className="AdminFieldNumberMLApplication">21.</div>
                <div className="AdminFieldLabelMLApplication">Residence</div>
                <div className="AdminConsentResidenceMLApplication">{consentPersonAddHusband}</div>
              </td>
              <td className="AdminTableCellMLApplication">
                <div className="AdminFieldNumberMLApplication">21.</div>
                <div className="AdminFieldLabelMLApplication">Residence</div>
                <div className="AdminConsentResidenceMLApplication">{consentPersonAddWife}</div>
              </td>
            </tr>

            <tr>
              <td className="AdminTableCellMLApplication AdminSignatureBoxMLApplication">
                <div className="AdminSignatureLineMLApplication"></div>
                <div className="AdminSignatureLabelMLApplication">(Signature of Applicant)</div>
                
                <div className="AdminSubscribedMLApplication">
                  <div className="AdminSubscribedTextMLApplication">SUBSCRIBED AND SWORN</div>
                  <div className="AdminSubscribedDetailsMLApplication">
                    to before me this _____ day of ________, ________, Philippines, affiant who exhibited to me his Community Tax Cert. issued on __________ at _________.
                  </div>
                </div>
                
                <div className="AdminOfficialSignatureMLApplication">
                  <div className="AdminOfficialLineMLApplication"></div>
                  <div className="AdminOfficialLabelMLApplication">(Signature Over Printed Name of the Civil Registrar)</div>
                </div>
              </td>
              <td className="AdminTableCellMLApplication AdminSignatureBoxMLApplication">
                <div className="AdminSignatureLineMLApplication"></div>
                <div className="AdminSignatureLabelMLApplication">(Signature of Applicant)</div>
                
                <div className="AdminSubscribedMLApplication">
                  <div className="AdminSubscribedTextMLApplication">SUBSCRIBED AND SWORN</div>
                  <div className="AdminSubscribedDetailsMLApplication">
                    to before me this _____ day of ________, ________, Philippines, affiant who exhibited to me his Community Tax Cert. issued on __________ at _________.
                  </div>
                  <div className="AdminDocStampMLApplication">
                    <div className="AdminStampTextMLApplication">
                      Documentary<br/>
                      stamp tax
                    </div>
                  </div>
                </div>
                
                <div className="AdminOfficialSignatureMLApplication">
                  <div className="AdminOfficialLineMLApplication"></div>
                  <div className="AdminOfficialLabelMLApplication">(Signature Over Printed Name of the Civil Registrar)</div>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminMarriageLicensePreview;