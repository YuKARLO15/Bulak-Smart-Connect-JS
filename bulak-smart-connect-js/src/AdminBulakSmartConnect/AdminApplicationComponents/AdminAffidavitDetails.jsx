import React, { useEffect, useState } from 'react';
import { documentApplicationService } from '../../services/documentApplicationService';
import './AdminAffidavitDetails.css';
import { useAuth } from '../../context/AuthContext';

const AdminBirthAffidavitPreviewPage = ({ applicationId, currentUser }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applicationDetails, setApplicationDetails] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [originalData, setOriginalData] = useState({});
  const [success, setSuccess] = useState('');

  // Checkbox state for radio/checkbox fields
  const [registrationType, setRegistrationType] = useState('self');
  const [parentStatus, setParentStatus] = useState('married');
  const [maritalStatus, setMaritalStatus] = useState('single');
 const { user, hasRole } = useAuth();

  // Updated permission checks using AuthContext
  const canEdit = hasRole('super_admin') || hasRole('admin') ;
  const canView =  hasRole('super_admin') || hasRole('admin') || hasRole('staff');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      setSuccess('');
      try {
        const application = await documentApplicationService.getApplication(applicationId);
        // Merge affidavitData over formData for editing
        const combinedFormData = {
          ...(application.formData || {}),
          ...(application.affidavitData || {}),
        };
        setFormData(combinedFormData);
        setOriginalData(combinedFormData);

        setRegistrationType(application.affidavitData?.registrationType || 'self');
        setParentStatus(application.affidavitData?.parentStatus || 'married');
        setMaritalStatus(application.affidavitData?.maritalStatus || 'single');

        setApplicationDetails({
          submittedBy: application.submittedBy,
          submittedAt: application.submittedAt,
          status: application.status,
        });
      } catch (err) {
        setError('Failed to load application data: ' + (err.message || 'Unknown error'));
      } finally {
        setLoading(false);
      }
    };

    if (canView && applicationId) {
      fetchData();
    } else {
      if (!applicationId) setError('No application ID provided.');
      else if (!canView) setError('Unauthorized access');
    }
     
  }, [applicationId, canView]);

  // Form field change handler
  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  // Checkboxes/radios as actual fields in formData
  const handleRegistrationTypeChange = (type) => {
    setRegistrationType(type);
    setFormData(prev => ({ ...prev, registrationType: type }));
  };
  const handleParentStatusChange = (status) => {
    setParentStatus(status);
    setFormData(prev => ({ ...prev, parentStatus: status }));
  };
  const handleMaritalStatusChange = (status) => {
    setMaritalStatus(status);
    setFormData(prev => ({ ...prev, maritalStatus: status }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const updatedAffidavitData = {
        ...formData,
        registrationType,
        parentStatus,
        maritalStatus,
        lastUpdated: new Date().toISOString(),
        lastUpdatedBy: currentUser.login
      };
   
      await documentApplicationService.updateApplication(applicationId, {
        affidavitData: updatedAffidavitData,
        formData: { ...formData, registrationType, parentStatus, maritalStatus },
      });
      setOriginalData(updatedAffidavitData);
      setIsEditMode(false);
      setSuccess('Affidavit updated successfully.');
    } catch (err) {
      setError('Failed to save changes: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(originalData || {});
    setRegistrationType(originalData.registrationType || 'self');
    setParentStatus(originalData.parentStatus || 'married');
    setMaritalStatus(originalData.maritalStatus || 'single');
    setIsEditMode(false);
    setError('');
    setSuccess('');
  };


  const getChildFullName = () => {
    const firstName = formData.firstName || '';
    const middleName = formData.middleName || '';
    const lastName = formData.lastName || '';
    const extension = formData.extension || '';
    let fullName = [firstName, middleName, lastName].filter(Boolean).join(' ');
    if (extension) fullName += ' ' + extension;
    return fullName.trim();
  };
  const getFatherFullName = () => {
    const firstName = formData.fatherFirstName || '';
    const middleName = formData.fatherMiddleName || '';
    const lastName = formData.fatherLastName || '';
    const extension = formData.fatherExtension || '';
    let fullName = [firstName, middleName, lastName].filter(Boolean).join(' ');
    if (extension) fullName += ' ' + extension;
    return fullName.trim();
  };
  const getMotherFullName = () => {
    const firstName = formData.motherFirstName || '';
    const middleName = formData.motherMiddleName || '';
    const lastName = formData.motherLastName || '';
    const extension = formData.motherExtension || '';
    let fullName = [firstName, middleName, lastName].filter(Boolean).join(' ');
    if (extension) fullName += ' ' + extension;
    return fullName.trim();
  };
  const getChildBirthDate = () => {
    const month = formData.birthMonth || '';
    const day = formData.birthDay || '';
    const year = formData.birthYear || '';
    if (month && day && year) {
      return `${month} ${day}, ${year}`;
    }
    return '';
  };
  const shouldShowPaternityAffidavit = () => {
    if (formData.maritalStatus === "marital" || !formData.fatherLastName) {
      return false;
    }
    return true;
  };

  if (!canView) return <div className="AdminPreviewError">Unauthorized access</div>;
  if (loading) return <div className="AdminPreviewLoading">Loading affidavit...</div>;
  if (error) return <div className="AdminPreviewError">{error}</div>;

  return (
    <div className="AdminPreviewContainer">
      <div className="AdminInfoHeader">
        <div className="AdminInfoContent">
          <div className="AdminInfoRow">
            <span className="AdminInfoLabel">Application ID:</span>
            <span className="AdminInfoValue">{applicationId}</span>
          </div>
          <div className="AdminInfoRow">
            <span className="AdminInfoLabel">Application Status:</span>
            <span className={`AdminInfoValue Status ${applicationDetails.status}`}>
              {applicationDetails.status || 'Unknown'}
            </span>
          </div>
          {canEdit && (
            <div className="AdminInfoRow">
              <div className="AdminEditControls" style={{ marginLeft: 'auto' }}>
                {!isEditMode ? (
                  <button
                    onClick={() => { setIsEditMode(true); setSuccess(''); setError(''); }}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#184a5b',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Edit Affidavit
                  </button>
                ) : (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={handleSave}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#184a5b',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      {loading ? "Saving..." : "Save Changes"}
                    </button>
                    <button
                      onClick={handleCancel}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#dc3545',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      {success && <div className="AdminPreviewSuccess">{success}</div>}

      {/* Paternity Affidavit */}
      {shouldShowPaternityAffidavit() && (
        <div className="BirthFormContainerAffidavit">
          <div className="FormHeaderAffidavit">AFFIDAVIT OF ACKNOWLEDGMENT/ADMISSION OF PATERNITY</div>
          <div className="FormContentAffidavit">
            <div className="FormSectionAffidavit">
              <div className="FormRowAffidavit">
                <div className="AffidavitText">
                  I/We,
                  {isEditMode ? (
                    <input
                      type="text"
                      name="affiantName1"
                      value={formData.affiantName1 ?? getFatherFullName()}
                      onChange={handleChange}
                      className="AffidavitUnderlineInput"
                    />
                  ) : (
                    <span className="AffidavitUnderlineInput ReadOnly">
                      {formData.affiantName1 || getFatherFullName()}
                    </span>
                  )}
                  and
                  {isEditMode ? (
                    <input
                      type="text"
                      name="affiantName2"
                      value={formData.affiantName2 ?? getMotherFullName()}
                      onChange={handleChange}
                      className="AffidavitUnderlineInput"
                    />
                  ) : (
                    <span className="AffidavitUnderlineInput ReadOnly">
                      {formData.affiantName2 || getMotherFullName()}
                    </span>
                  )}
                  , who was born on
                  {isEditMode ? (
                    <input
                      type="text"
                      name="affiantBirthDate"
                      value={formData.affiantBirthDate ?? ''}
                      onChange={handleChange}
                      className="AffidavitUnderlineInput"
                    />
                  ) : (
                    <span className="AffidavitUnderlineInput ReadOnly">
                      {formData.affiantBirthDate}
                    </span>
                  )}
                  at
                  {isEditMode ? (
                    <input
                      type="text"
                      name="affiantBirthPlace"
                      value={formData.affiantBirthPlace ?? ''}
                      onChange={handleChange}
                      className="AffidavitUnderlineInput"
                    />
                  ) : (
                    <span className="AffidavitUnderlineInput ReadOnly">
                      {formData.affiantBirthPlace}
                    </span>
                  )}
                  of legal age, am/are the natural mother and/or father of
                  {isEditMode ? (
                    <input
                      type="text"
                      name="childFullName"
                      value={formData.childFullName ?? getChildFullName()}
                      onChange={handleChange}
                      className="AffidavitUnderlineInput"
                    />
                  ) : (
                    <span className="AffidavitUnderlineInput ReadOnly">
                      {formData.childFullName || getChildFullName()}
                    </span>
                  )}
                  .
                </div>
              </div>
              <div className="FormRowAffidavit">
                <div className="AffidavitText">
                  That I am / We are executing this affidavit to attest to the truthfulness of the
                  foregoing statements and for purposes of acknowledging my/our child.
                </div>
              </div>
              <div className="FormRowAffidavit">
                <div className="SignatureBlockAffidavit">
                  <div className="SignatureLine"></div>
                  <div className="SignatureCaption">(Signature Over Printed Name of Father)</div>
                </div>
                <div className="SignatureBlockAffidavit">
                  <div className="SignatureLine"></div>
                  <div className="SignatureCaption">(Signature Over Printed Name of Mother)</div>
                </div>
              </div>
              <div className="FormRowAffidavit">
                <div className="AffidavitText">
                  <strong>SUBSCRIBED AND SWORN</strong> to before me this
                  {isEditMode ? (
                    <input type="text" name="swornDay1" value={formData.swornDay1 ?? ''} onChange={handleChange} className="AffidavitShortInput" />
                  ) : (
                    <span className="AffidavitUnderlineInput ReadOnly">{formData.swornDay1 || ''}</span>
                  )}
                  day of
                  {isEditMode ? (
                    <input type="text" name="swornMonth1" value={formData.swornMonth1 ?? ''} onChange={handleChange} className="AffidavitMediumInput" />
                  ) : (
                    <span className="AffidavitUnderlineInput ReadOnly">{formData.swornMonth1 || ''}</span>
                  )}
                  ,
                  {isEditMode ? (
                    <input type="text" name="swornYear1" value={formData.swornYear1 ?? ''} onChange={handleChange} className="AffidavitShortInput" />
                  ) : (
                    <span className="AffidavitUnderlineInput ReadOnly">{formData.swornYear1 || ''}</span>
                  )}
                  , by
                  {isEditMode ? (
                    <input type="text" name="swornBy1" value={formData.swornBy1 ?? ''} onChange={handleChange} className="AffidavitMediumInput" />
                  ) : (
                    <span className="AffidavitUnderlineInput ReadOnly">{formData.swornBy1 || ''}</span>
                  )}
                  , who exhibited to me (his/her) CTC/valid ID
                  {isEditMode ? (
                    <input type="text" name="validID1" value={formData.validID1 ?? ''} onChange={handleChange} className="AffidavitMediumInput" />
                  ) : (
                    <span className="AffidavitUnderlineInput ReadOnly">{formData.validID1 || ''}</span>
                  )}
                  issued on
                  {isEditMode ? (
                    <input type="text" name="idIssueDate1" value={formData.idIssueDate1 ?? ''} onChange={handleChange} className="AffidavitMediumInput" />
                  ) : (
                    <span className="AffidavitUnderlineInput ReadOnly">{formData.idIssueDate1 || ''}</span>
                  )}
                  at
                  {isEditMode ? (
                    <input type="text" name="idIssuePlace1" value={formData.idIssuePlace1 ?? ''} onChange={handleChange} className="AffidavitMediumInput" />
                  ) : (
                    <span className="AffidavitUnderlineInput ReadOnly">{formData.idIssuePlace1 || ''}</span>
                  )}
                  .
                </div>
              </div>
              <div className="FormRowAffidavit">
                <div className="SignatureBlockAffidavit">
                  <div className="SignatureLine"></div>
                  <div className="SignatureCaption">Signature of the Administering Officer</div>
                  <div className="SignatureLine"></div>
                  <div className="SignatureCaption">Name in Print</div>
                </div>
                <div className="SignatureBlockAffidavit">
                  <div className="SignatureLine"></div>
                  <div className="SignatureCaption">Position / Title / Designation</div>
                  <div className="SignatureLine"></div>
                  <div className="SignatureCaption">Address</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delayed Registration Affidavit */}
      <div className="BirthFormContainerAffidavit">
        <div className="FormHeaderAffidavit">AFFIDAVIT FOR DELAYED REGISTRATION OF BIRTH</div>
        <div className="SubHeaderAffidavit">
          (To be accomplished by the hospital/clinic administrator, father, mother, or guardian of the
          person himself if 18 years old or over.)
        </div>
        <div className="FormContentAffidavit">
          <div className="FormSectionAffidavit">
            <div className="FormRowAffidavit">
              <div className="AffidavitText">
                I,
                {isEditMode ? (
                  <input type="text" name="delayedAffiantName" value={formData.delayedAffiantName ?? ''} onChange={handleChange} className="AffidavitLongInput" />
                ) : (
                  <span className="AffidavitUnderlineInput ReadOnly">{formData.delayedAffiantName || ''}</span>
                )}
                , of legal age,
                <span className="MaritalStatusOptions">
                  {['single', 'married', 'divorced', 'widow', 'widower'].map(status => (
                    <span className="CheckboxContainerAffidavit MaritalStatusCheckbox" key={status}>
                      <input
                        type="checkbox"
                        id={`${status}Checkbox`}
                        checked={maritalStatus === status}
                        onChange={() => isEditMode && handleMaritalStatusChange(status)}
                        className="CheckboxInputAffidavit"
                        disabled={!isEditMode}
                      />
                      <label htmlFor={`${status}Checkbox`} className="CheckboxLabelAffidavit">{status}</label>
                    </span>
                  ))}
                </span>
                , with residence and postal address at
                {isEditMode ? (
                  <input type="text" name="delayedAffiantAddress" value={formData.delayedAffiantAddress ?? ''} onChange={handleChange} className="AffidavitLongInput" />
                ) : (
                  <span className="AffidavitUnderlineInput ReadOnly">{formData.delayedAffiantAddress || ''}</span>
                )}
                after having been duly sworn in accordance with law, do hereby depose and say:
              </div>
            </div>
            <div className="FormRowAffidavit">
              <div className="AffidavitText">
                1. That I am the applicant for the delayed registration of:
              </div>
            </div>
            <div className="FormRowAffidavit">
              <div className="CheckboxContainerAffidavit">
                <input
                  type="checkbox"
                  id="selfBirthCheckbox"
                  checked={registrationType === 'self'}
                  onChange={() => isEditMode && handleRegistrationTypeChange('self')}
                  className="CheckboxInputAffidavit"
                  disabled={!isEditMode}
                />
                <label htmlFor="selfBirthCheckbox" className="CheckboxLabelAffidavit">
                  my birth in
                  {isEditMode ? (
                    <input type="text" name="selfBirthPlace" value={formData.selfBirthPlace ?? ''} onChange={handleChange} className="AffidavitMediumInput" disabled={registrationType !== 'self' || !isEditMode} />
                  ) : (
                    <span className="AffidavitUnderlineInput ReadOnly">{formData.selfBirthPlace || ''}</span>
                  )}
                  on
                  {isEditMode ? (
                    <input type="text" name="selfBirthDate" value={formData.selfBirthDate ?? ''} onChange={handleChange} className="AffidavitMediumInput" disabled={registrationType !== 'self' || !isEditMode} />
                  ) : (
                    <span className="AffidavitUnderlineInput ReadOnly">{formData.selfBirthDate || ''}</span>
                  )}
                  .
                </label>
              </div>
            </div>
            <div className="FormRowAffidavit">
              <div className="CheckboxContainerAffidavit">
                <input
                  type="checkbox"
                  id="otherBirthCheckbox"
                  checked={registrationType === 'other'}
                  onChange={() => isEditMode && handleRegistrationTypeChange('other')}
                  className="CheckboxInputAffidavit"
                  disabled={!isEditMode}
                />
                <label htmlFor="otherBirthCheckbox" className="CheckboxLabelAffidavit">
                  the birth of
                  {isEditMode ? (
                    <input type="text" name="otherPersonName" value={formData.otherPersonName ?? getChildFullName()} onChange={handleChange} className="AffidavitMediumInput" disabled={registrationType !== 'other' || !isEditMode} />
                  ) : (
                    <span className="AffidavitUnderlineInput ReadOnly">{formData.otherPersonName || getChildFullName()}</span>
                  )}
                  who was born in
                  {isEditMode ? (
                    <input type="text" name="otherBirthPlace" value={formData.otherBirthPlace ?? ''} onChange={handleChange} className="AffidavitMediumInput" disabled={registrationType !== 'other' || !isEditMode} />
                  ) : (
                    <span className="AffidavitUnderlineInput ReadOnly">{formData.otherBirthPlace || ''}</span>
                  )}
                  on
                  {isEditMode ? (
                    <input type="text" name="otherBirthDate" value={formData.otherBirthDate ?? getChildBirthDate()} onChange={handleChange} className="AffidavitMediumInput" disabled={registrationType !== 'other' || !isEditMode} />
                  ) : (
                    <span className="AffidavitUnderlineInput ReadOnly">{formData.otherBirthDate || getChildBirthDate()}</span>
                  )}
                  .
                </label>
              </div>
            </div>
            <div className="FormRowAffidavit">
              <div className="AffidavitText">
                2. That I/he/she was attended at birth by
                {isEditMode ? (
                  <input type="text" name="attendedBy" value={formData.attendedBy ?? ''} onChange={handleChange} className="AffidavitLongInput" />
                ) : (
                  <span className="AffidavitUnderlineInput ReadOnly">{formData.attendedBy || ''}</span>
                )}
                who resides at
                {isEditMode ? (
                  <input type="text" name="attendantAddress" value={formData.attendantAddress ?? ''} onChange={handleChange} className="AffidavitLongInput" />
                ) : (
                  <span className="AffidavitUnderlineInput ReadOnly">{formData.attendantAddress || ''}</span>
                )}
                .
              </div>
            </div>
            <div className="FormRowAffidavit">
              <div className="AffidavitText">
                3. That I am/he/she is a citizen of
                {isEditMode ? (
                  <input type="text" name="citizenship" value={formData.citizenship ?? formData.motherCitizenship ?? ''} onChange={handleChange} className="AffidavitLongInput" />
                ) : (
                  <span className="AffidavitUnderlineInput ReadOnly">{formData.citizenship || formData.motherCitizenship || ''}</span>
                )}
                .
              </div>
            </div>
            <div className="FormRowAffidavit"><div className="AffidavitText">4. That my/his/her parents were</div></div>
            <div className="FormRowAffidavit">
              <div className="CheckboxContainerAffidavit">
                <input type="checkbox" id="marriedParentsCheckbox" checked={parentStatus === 'married'} onChange={() => isEditMode && handleParentStatusChange('married')} className="CheckboxInputAffidavit" disabled={!isEditMode} />
                <label htmlFor="marriedParentsCheckbox" className="CheckboxLabelAffidavit">
                  married on
                  {isEditMode ? (
                    <input
                      type="text"
                      name="marriageDate"
                      value={
                        formData.marriageMonth && formData.marriageDay && formData.marriageYear
                          ? `${formData.marriageMonth} ${formData.marriageDay}, ${formData.marriageYear}`
                          : formData.marriageDate ?? ''
                      }
                      onChange={handleChange}
                      className="AffidavitMediumInput"
                      disabled={parentStatus !== 'married' || !isEditMode}
                    />
                  ) : (
                    <span className="AffidavitUnderlineInput ReadOnly">
                      {formData.marriageMonth && formData.marriageDay && formData.marriageYear
                        ? `${formData.marriageMonth} ${formData.marriageDay}, ${formData.marriageYear}`
                        : formData.marriageDate || ''}
                    </span>
                  )}
                  at
                  {isEditMode ? (
                    <input
                      type="text"
                      name="marriagePlace"
                      value={
                        formData.marriageCity && formData.marriageProvince
                          ? `${formData.marriageCity}, ${formData.marriageProvince}`
                          : formData.marriagePlace ?? ''
                      }
                      onChange={handleChange}
                      className="AffidavitMediumInput"
                      disabled={parentStatus !== 'married' || !isEditMode}
                    />
                  ) : (
                    <span className="AffidavitUnderlineInput ReadOnly">
                      {formData.marriageCity && formData.marriageProvince
                        ? `${formData.marriageCity}, ${formData.marriageProvince}`
                        : formData.marriagePlace || ''}
                    </span>
                  )}
                  .
                </label>
              </div>
            </div>
            <div className="FormRowAffidavit">
              <div className="CheckboxContainerAffidavit">
                <input type="checkbox" id="notMarriedParentsCheckbox" checked={parentStatus === 'notMarried'} onChange={() => isEditMode && handleParentStatusChange('notMarried')} className="CheckboxInputAffidavit" disabled={!isEditMode} />
                <label htmlFor="notMarriedParentsCheckbox" className="CheckboxLabelAffidavit">
                  not married but I/he/she was acknowledged/not acknowledged by my/his/her father
                  whose name is
                  {isEditMode ? (
                    <input
                      type="text"
                      name="fatherName"
                      value={
                        formData.fatherFirstName && formData.fatherLastName
                          ? `${formData.fatherFirstName} ${formData.fatherMiddleName || ''} ${formData.fatherLastName}`
                          : formData.fatherName ?? ''
                      }
                      onChange={handleChange}
                      className="AffidavitMediumInput"
                      disabled={parentStatus !== 'notMarried' || !isEditMode}
                    />
                  ) : (
                    <span className="AffidavitUnderlineInput ReadOnly">
                      {formData.fatherFirstName && formData.fatherLastName
                        ? `${formData.fatherFirstName} ${formData.fatherMiddleName || ''} ${formData.fatherLastName}`
                        : formData.fatherName || ''}
                    </span>
                  )}
                  .
                </label>
              </div>
            </div>
            <div className="FormRowAffidavit">
              <div className="AffidavitText">
                5. That the reason for the delay in registering my/his/her birth was
                {isEditMode ? (
                  <input type="text" name="delayReason" value={formData.delayReason ?? ''} onChange={handleChange} className="AffidavitLongInput" />
                ) : (
                  <span className="AffidavitUnderlineInput ReadOnly">{formData.delayReason || ''}</span>
                )}
                .
              </div>
            </div>
            <div className="FormRowAffidavit">
              <div className="AffidavitText">
                6. (For the applicant only) That I am married to
                {isEditMode ? (
                  <input type="text" name="spouseName" value={formData.spouseName ?? ''} onChange={handleChange} className="AffidavitLongInput" />
                ) : (
                  <span className="AffidavitUnderlineInput ReadOnly">{formData.spouseName || ''}</span>
                )}
                .
              </div>
            </div>
            <div className="FormRowAffidavit">
              <div className="AffidavitText">
                (If the applicant is other than the document owner) That I am the
                {isEditMode ? (
                  <input type="text" name="relationshipToOwner" value={formData.relationshipToOwner ?? ''} onChange={handleChange} className="AffidavitMediumInput" />
                ) : (
                  <span className="AffidavitUnderlineInput ReadOnly">{formData.relationshipToOwner || ''}</span>
                )}
                of the said person.
              </div>
            </div>
            <div className="FormRowAffidavit">
              <div className="AffidavitText">
                7. That I am executing this affidavit to attest to the truthfulness of the foregoing statements for all legal intents and purposes.
              </div>
            </div>
            <div className="FormRowAffidavit">
              <div className="AffidavitText">
                In truth whereof, I have affixed my signature below this
                {isEditMode ? (
                  <input type="text" name="signatureDay" value={formData.signatureDay ?? ''} onChange={handleChange} className="AffidavitShortInput" />
                ) : (
                  <span className="AffidavitUnderlineInput ReadOnly">{formData.signatureDay || ''}</span>
                )}
                day of
                {isEditMode ? (
                  <input type="text" name="signatureMonth" value={formData.signatureMonth ?? ''} onChange={handleChange} className="AffidavitMediumInput" />
                ) : (
                  <span className="AffidavitUnderlineInput ReadOnly">{formData.signatureMonth || ''}</span>
                )}
                at
                {isEditMode ? (
                  <input type="text" name="signaturePlace" value={formData.signaturePlace ?? ''} onChange={handleChange} className="AffidavitMediumInput" />
                ) : (
                  <span className="AffidavitUnderlineInput ReadOnly">{formData.signaturePlace || ''}</span>
                )}
                , Philippines.
              </div>
            </div>
            <div className="FormRowAffidavit">
              <div className="SignatureBlockAffidavit FullWidth">
                <div className="SignatureLine"></div>
                <div className="SignatureCaption">(Signature Over Printed Name of Affiant)</div>
              </div>
            </div>
            <div className="FormRowAffidavit">
              <div className="AffidavitText">
                <strong>SUBSCRIBED AND SWORN</strong> to before me this
                {isEditMode ? (
                  <input type="text" name="swornDay2" value={formData.swornDay2 ?? ''} onChange={handleChange} className="AffidavitShortInput" />
                ) : (
                  <span className="AffidavitUnderlineInput ReadOnly">{formData.swornDay2 || ''}</span>
                )}
                day of
                {isEditMode ? (
                  <input type="text" name="swornMonth2" value={formData.swornMonth2 ?? ''} onChange={handleChange} className="AffidavitMediumInput" />
                ) : (
                  <span className="AffidavitUnderlineInput ReadOnly">{formData.swornMonth2 || ''}</span>
                )}
                at
                {isEditMode ? (
                  <input type="text" name="swornPlace2" value={formData.swornPlace2 ?? ''} onChange={handleChange} className="AffidavitMediumInput" />
                ) : (
                  <span className="AffidavitUnderlineInput ReadOnly">{formData.swornPlace2 || ''}</span>
                )}
                , Philippines, affiant who exhibited to me his/her CTC/valid ID
                {isEditMode ? (
                  <input type="text" name="validID2" value={formData.validID2 ?? ''} onChange={handleChange} className="AffidavitMediumInput" />
                ) : (
                  <span className="AffidavitUnderlineInput ReadOnly">{formData.validID2 || ''}</span>
                )}
                issued on
                {isEditMode ? (
                  <input type="text" name="idIssueDate2" value={formData.idIssueDate2 ?? ''} onChange={handleChange} className="AffidavitShortInput" />
                ) : (
                  <span className="AffidavitUnderlineInput ReadOnly">{formData.idIssueDate2 || ''}</span>
                )}
                at
                {isEditMode ? (
                  <input type="text" name="idIssuePlace2" value={formData.idIssuePlace2 ?? ''} onChange={handleChange} className="AffidavitMediumInput" />
                ) : (
                  <span className="AffidavitUnderlineInput ReadOnly">{formData.idIssuePlace2 || ''}</span>
                )}
                .
              </div>
            </div>
            <div className="FormRowAffidavit">
              <div className="SignatureBlockAffidavit">
                <div className="SignatureLine"></div>
                <div className="SignatureCaption">Signature of the Administering Officer</div>
                <div className="SignatureLine"></div>
                <div className="SignatureCaption">Name in Print</div>
              </div>
              <div className="SignatureBlockAffidavit">
                <div className="SignatureLine"></div>
                <div className="SignatureCaption">Position / Title / Designation</div>
                <div className="SignatureLine"></div>
                <div className="SignatureCaption">Address</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminBirthAffidavitPreviewPage;