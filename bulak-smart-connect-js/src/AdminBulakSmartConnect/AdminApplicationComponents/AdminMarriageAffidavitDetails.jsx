import React, { useEffect, useState } from 'react';
import { documentApplicationService } from '../../services/documentApplicationService';
import './AdminMarriageAffidavitDetails.css';

import { useAuth } from '../../context/AuthContext';

const AdminMarriageAffidavitDetails = ({ applicationId, currentUser }) => {
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [applicationDetails, setApplicationDetails] = useState({});
  const [isEditMode, setIsEditMode] = useState(false);
  const [originalData, setOriginalData] = useState({});
  const [success, setSuccess] = useState('');

  const { user, hasRole } = useAuth();


  const canEdit = hasRole('super_admin') || hasRole('admin');
  const canView = hasRole('super_admin') || hasRole('admin') || hasRole('staff');

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError('');
      setSuccess('');
      try {
        const application = await documentApplicationService.getApplication(applicationId);

        const combinedFormData = {
          ...(application.formData || {}),
          ...(application.marriageAffidavitData || {}),
        };
        setFormData(combinedFormData);
        setOriginalData(combinedFormData);

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

  const handleChange = (event) => {
    const { name, value, type, checked } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const updatedAffidavitData = {
        ...formData,
        lastUpdated: new Date().toISOString(),
        lastUpdatedBy: user?.login || currentUser?.login
      };
   
      await documentApplicationService.updateApplication(applicationId, {
        marriageAffidavitData: updatedAffidavitData,
        formData: { ...formData },
      });
      setOriginalData(updatedAffidavitData);
      setIsEditMode(false);
      setSuccess('Marriage affidavit updated successfully.');
    } catch (err) {
      setError('Failed to save changes: ' + (err.message || 'Unknown error'));
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    setFormData(originalData || {});
    setIsEditMode(false);
    setError('');
    setSuccess('');
  };


  const getHusbandFullName = () => {
    const firstName = formData.husbandFirstName || '';
    const middleName = formData.husbandMiddleName || '';
    const lastName = formData.husbandLastName || '';
    const extension = formData.husbandExtension || '';
    let fullName = [firstName, middleName, lastName].filter(Boolean).join(' ');
    if (extension) fullName += ' ' + extension;
    return fullName.trim();
  };

  const getWifeFullName = () => {
    const firstName = formData.wifeFirstName || '';
    const middleName = formData.wifeMiddleName || '';
    const lastName = formData.wifeLastName || '';
    const extension = formData.wifeExtension || '';
    let fullName = [firstName, middleName, lastName].filter(Boolean).join(' ');
    if (extension) fullName += ' ' + extension;
    return fullName.trim();
  };

  const getMarriageDate = () => {
    const month = formData.marriageMonth || '';
    const day = formData.marriageDay || '';
    const year = formData.marriageYear || '';
    if (month && day && year) {
      return `${month} ${day}, ${year}`;
    }
    return '';
  };

  const getMarriagePlace = () => {
    const city = formData.marriageCity || '';
    const province = formData.marriageProvince || '';
    if (city && province) {
      return `${city}, ${province}`;
    }
    return city || province || '';
  };

  if (!canView) return <div className="AdminPreviewErrorMcAffidavit">Unauthorized access</div>;
  if (loading) return <div className="AdminPreviewLoadingMcAffidavit">Loading marriage affidavit...</div>;
  if (error) return <div className="AdminPreviewErrorMcAffidavit">{error}</div>;

  return (
    <div className="AdminPreviewContainerMcAffidavit">
      <div className="AdminInfoHeaderMcAffidavit">
        <div className="AdminInfoContentMcAffidavit">
          <div className="AdminInfoRowMcAffidavit">
            <span className="AdminInfoLabelMcAffidavit">Application ID:</span>
            <span className="AdminInfoValueMcAffidavit">{applicationId}</span>
          </div>
          <div className="AdminInfoRowMcAffidavit">
            <span className="AdminInfoLabelMcAffidavit">Application Status:</span>
            <span className={`AdminInfoValueMcAffidavit StatusMcAffidavit ${applicationDetails.status}`}>
              {applicationDetails.status || 'Unknown'}
            </span>
          </div>
          {canEdit && (
            <div className="AdminInfoRowMcAffidavit">
              <div className="AdminEditControlsMcAffidavit" style={{ marginLeft: 'auto' }}>
                {!isEditMode ? (
                  <button
                    onClick={() => { setIsEditMode(true); setSuccess(''); setError(''); }}
                    style={{
                      padding: '8px 16px',
                      backgroundColor: '#0066cc',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer'
                    }}
                  >
                    Edit Marriage Affidavit
                  </button>
                ) : (
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      onClick={handleSave}
                      style={{
                        padding: '8px 16px',
                        backgroundColor: '#28a745',
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
      {success && <div className="AdminPreviewSuccessMcAffidavit">{success}</div>}

      {/* Witnesses section */}
      <div className="MarriageFormContainerMcAffidavit">
        <div className="FormHeaderMcAffidavit">20b. WITNESSES (Print Name and Sign)</div>
        <div className="WitnessesSectionMcAffidavit">
          <div className="WitnessRowMcAffidavit">
            {isEditMode ? (
              <input
                type="text"
                name="witness1Name"
                value={formData.witness1Name || ''}
                onChange={handleChange}
                className="WitnessInputMcAffidavit"
                placeholder="Witness 1 Name"
              />
            ) : (
              <span className="WitnessInputMcAffidavit ReadOnlyMcAffidavit">
                {formData.witness1Name || 'N/A'}
              </span>
            )}
            {isEditMode ? (
              <input
                type="text"
                name="witness1Address"
                value={formData.witness1Address || ''}
                onChange={handleChange}
                className="WitnessInputMcAffidavit"
                placeholder="Witness 1 Address"
              />
            ) : (
              <span className="WitnessInputMcAffidavit ReadOnlyMcAffidavit">
                {formData.witness1Address || 'N/A'}
              </span>
            )}
            {isEditMode ? (
              <input
                type="text"
                name="witness1Signature"
                value={formData.witness1Signature || ''}
                onChange={handleChange}
                className="WitnessInputMcAffidavit"
                placeholder="Witness 1 Signature"
              />
            ) : (
              <span className="WitnessInputMcAffidavit ReadOnlyMcAffidavit">
                {formData.witness1Signature || 'N/A'}
              </span>
            )}
          </div>
          <div className="WitnessRowMcAffidavit">
            {isEditMode ? (
              <input
                type="text"
                name="witness2Name"
                value={formData.witness2Name || ''}
                onChange={handleChange}
                className="WitnessInputMcAffidavit"
                placeholder="Witness 2 Name"
              />
            ) : (
              <span className="WitnessInputMcAffidavit ReadOnlyMcAffidavit">
                {formData.witness2Name || 'N/A'}
              </span>
            )}
            {isEditMode ? (
              <input
                type="text"
                name="witness2Address"
                value={formData.witness2Address || ''}
                onChange={handleChange}
                className="WitnessInputMcAffidavit"
                placeholder="Witness 2 Address"
              />
            ) : (
              <span className="WitnessInputMcAffidavit ReadOnlyMcAffidavit">
                {formData.witness2Address || 'N/A'}
              </span>
            )}
            {isEditMode ? (
              <input
                type="text"
                name="witness2Signature"
                value={formData.witness2Signature || ''}
                onChange={handleChange}
                className="WitnessInputMcAffidavit"
                placeholder="Witness 2 Signature"
              />
            ) : (
              <span className="WitnessInputMcAffidavit ReadOnlyMcAffidavit">
                {formData.witness2Signature || 'N/A'}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Affidavit of Solemnizing Officer */}
      <div className="MarriageFormContainerMcAffidavit">
        <div className="FormHeaderMcAffidavit">AFFIDAVIT OF SOLEMNIZING OFFICER</div>
        <div className="FormContentMcAffidavit">
          <div className="FormSectionMcAffidavit">
            <div className="FormRowMcAffidavit">
              <div className="AffidavitTextMcAffidavit">
                I,
                {isEditMode ? (
                  <input
                    type="text"
                    name="solemnizingOfficerName"
                    value={formData.solemnizingOfficerName || ''}
                    onChange={handleChange}
                    className="AffidavitUnderlineInputMcAffidavit"
                  />
                ) : (
                  <span className="AffidavitUnderlineInputMcAffidavit ReadOnlyMcAffidavit">
                    {formData.solemnizingOfficerName || 'N/A'}
                  </span>
                )}
                , of legal age, Solemnizing Officer of
                {isEditMode ? (
                  <input
                    type="text"
                    name="solemnizingOfficerInstitution"
                    value={formData.solemnizingOfficerInstitution || ''}
                    onChange={handleChange}
                    className="AffidavitUnderlineInputMcAffidavit"
                  />
                ) : (
                  <span className="AffidavitUnderlineInputMcAffidavit ReadOnlyMcAffidavit">
                    {formData.solemnizingOfficerInstitution || 'N/A'}
                  </span>
                )}
                with address at
                {isEditMode ? (
                  <input
                    type="text"
                    name="solemnizingOfficerAddress"
                    value={formData.solemnizingOfficerAddress || ''}
                    onChange={handleChange}
                    className="AffidavitUnderlineInputMcAffidavit"
                  />
                ) : (
                  <span className="AffidavitUnderlineInputMcAffidavit ReadOnlyMcAffidavit">
                    {formData.solemnizingOfficerAddress || 'N/A'}
                  </span>
                )}
                , after having sworn to in accordance with law, do hereby depose and say:
              </div>
            </div>

            <div className="FormRowMcAffidavit">
              <div className="AffidavitTextMcAffidavit">
                1. That I have solemnized the marriage between
                {isEditMode ? (
                  <input
                    type="text"
                    name="husbandFullNameAffidavit"
                    value={formData.husbandFullNameAffidavit || getHusbandFullName()}
                    onChange={handleChange}
                    className="AffidavitUnderlineInputMcAffidavit"
                  />
                ) : (
                  <span className="AffidavitUnderlineInputMcAffidavit ReadOnlyMcAffidavit">
                    {formData.husbandFullNameAffidavit || getHusbandFullName()}
                  </span>
                )}
                and
                {isEditMode ? (
                  <input
                    type="text"
                    name="wifeFullNameAffidavit"
                    value={formData.wifeFullNameAffidavit || getWifeFullName()}
                    onChange={handleChange}
                    className="AffidavitUnderlineInputMcAffidavit"
                  />
                ) : (
                  <span className="AffidavitUnderlineInputMcAffidavit ReadOnlyMcAffidavit">
                    {formData.wifeFullNameAffidavit || getWifeFullName()}
                  </span>
                )}
                ;
              </div>
            </div>

            <div className="FormRowMcAffidavit">
              <div className="AffidavitTextMcAffidavit">2.</div>
              <div className="CheckboxItemMcAffidavit">
                <input
                  type="checkbox"
                  id="item2a"
                  name="item2a"
                  checked={formData.item2a || false}
                  onChange={handleChange}
                  disabled={!isEditMode}
                  className="CheckboxInputMcAffidavit"
                />
                <label htmlFor="item2a" className="CheckboxLabelMcAffidavit">
                  a. That I have ascertained the qualifications of the contracting parties and
                  have found no legal impediment for them to marry as required by Article 34 of
                  the Family Code;
                </label>
              </div>
              <div className="CheckboxItemMcAffidavit">
                <input
                  type="checkbox"
                  id="item2b"
                  name="item2b"
                  checked={formData.item2b || false}
                  onChange={handleChange}
                  disabled={!isEditMode}
                  className="CheckboxInputMcAffidavit"
                />
                <label htmlFor="item2b" className="CheckboxLabelMcAffidavit">
                  b. That this marriage was performed in articulo mortis or at the point of death;
                </label>
              </div>
              <div className="CheckboxItemMcAffidavit">
                <input
                  type="checkbox"
                  id="item2c"
                  name="item2c"
                  checked={formData.item2c || false}
                  onChange={handleChange}
                  disabled={!isEditMode}
                  className="CheckboxInputMcAffidavit"
                />
                <label htmlFor="item2c" className="CheckboxLabelMcAffidavit">
                  c. That the contracting party/ies
                  {isEditMode ? (
                    <input
                      type="text"
                      name="contractingParties"
                      value={formData.contractingParties || ''}
                      onChange={handleChange}
                      className="AffidavitUnderlineInputMcAffidavit"
                    />
                  ) : (
                    <span className="AffidavitUnderlineInputMcAffidavit ReadOnlyMcAffidavit">
                      {formData.contractingParties || 'N/A'}
                    </span>
                  )}
                  , being at the point of death and physically unable to sign the foregoing
                  certificate of marriage by signature or mark, one of the witnesses to the marriage
                  sign for him or her by writing the dying party's name and beneath it, the witness'
                  own signature preceded by the proposition "By";
                </label>
              </div>
              <div className="CheckboxItemMcAffidavit">
                <input
                  type="checkbox"
                  id="item2d"
                  name="item2d"
                  checked={formData.item2d || false}
                  onChange={handleChange}
                  disabled={!isEditMode}
                  className="CheckboxInputMcAffidavit"
                />
                <label htmlFor="item2d" className="CheckboxLabelMcAffidavit">
                  d. That the residence of either party is so located that there is no means of
                  transportation to enable concerned party/parties to appear personally before the
                  civil registrar;
                </label>
              </div>
              <div className="CheckboxItemMcAffidavit">
                <input
                  type="checkbox"
                  id="item2e"
                  name="item2e"
                  checked={formData.item2e || false}
                  onChange={handleChange}
                  disabled={!isEditMode}
                  className="CheckboxInputMcAffidavit"
                />
                <label htmlFor="item2e" className="CheckboxLabelMcAffidavit">
                  e. That the marriage was among Muslims or among members of the Ethnic Cultural
                  Communities and that the marriage was solemnized in accordance with their customs
                  and practices;
                </label>
              </div>
            </div>

            <div className="FormRowMcAffidavit">
              <div className="AffidavitTextMcAffidavit">
                3. That I took the necessary steps to ascertain the ages and relationship of the
                contracting parties and that neither of them are under any legal impediment to marry
                each other;
              </div>
            </div>

            <div className="FormRowMcAffidavit">
              <div className="AffidavitTextMcAffidavit">
                4. That I am executing this affidavit to attest to the truthfulness of the foregoing
                statements for all legal intents and purposes.
              </div>
            </div>

            <div className="FormRowMcAffidavit">
              <div className="AffidavitTextMcAffidavit">
                In truth whereof, I have affixed my signature below this
                {isEditMode ? (
                  <input
                    type="text"
                    name="officerSignatureDay"
                    value={formData.officerSignatureDay || ''}
                    onChange={handleChange}
                    className="AffidavitShortInputMcAffidavit"
                  />
                ) : (
                  <span className="AffidavitUnderlineInputMcAffidavit ReadOnlyMcAffidavit">
                    {formData.officerSignatureDay || ''}
                  </span>
                )}
                day of
                {isEditMode ? (
                  <input
                    type="text"
                    name="officerSignatureMonth"
                    value={formData.officerSignatureMonth || ''}
                    onChange={handleChange}
                    className="AffidavitMediumInputMcAffidavit"
                  />
                ) : (
                  <span className="AffidavitUnderlineInputMcAffidavit ReadOnlyMcAffidavit">
                    {formData.officerSignatureMonth || ''}
                  </span>
                )}
                ,
                {isEditMode ? (
                  <input
                    type="text"
                    name="officerSignatureYear"
                    value={formData.officerSignatureYear || ''}
                    onChange={handleChange}
                    className="AffidavitShortInputMcAffidavit"
                  />
                ) : (
                  <span className="AffidavitUnderlineInputMcAffidavit ReadOnlyMcAffidavit">
                    {formData.officerSignatureYear || ''}
                  </span>
                )}
                , at
                {isEditMode ? (
                  <input
                    type="text"
                    name="officerSignaturePlace"
                    value={formData.officerSignaturePlace || ''}
                    onChange={handleChange}
                    className="AffidavitMediumInputMcAffidavit"
                  />
                ) : (
                  <span className="AffidavitUnderlineInputMcAffidavit ReadOnlyMcAffidavit">
                    {formData.officerSignaturePlace || ''}
                  </span>
                )}
                , Philippines.
              </div>
            </div>

            <div className="FormRowMcAffidavit">
              <div className="SignatureBlockMcAffidavit">
                <div className="SignatureLineMcAffidavit"></div>
                <div className="SignatureCaptionMcAffidavit">
                  Signature Over Printed Name of the Solemnizing Officer
                </div>
              </div>
            </div>

            <div className="FormRowMcAffidavit">
              <div className="AffidavitTextMcAffidavit">
                <strong>SUBSCRIBED AND SWORN</strong> to before me this
                {isEditMode ? (
                  <input
                    type="text"
                    name="swornDay"
                    value={formData.swornDay || ''}
                    onChange={handleChange}
                    className="AffidavitShortInputMcAffidavit"
                  />
                ) : (
                  <span className="AffidavitUnderlineInputMcAffidavit ReadOnlyMcAffidavit">
                    {formData.swornDay || ''}
                  </span>
                )}
                day of
                {isEditMode ? (
                  <input
                    type="text"
                    name="swornMonth"
                    value={formData.swornMonth || ''}
                    onChange={handleChange}
                    className="AffidavitMediumInputMcAffidavit"
                  />
                ) : (
                  <span className="AffidavitUnderlineInputMcAffidavit ReadOnlyMcAffidavit">
                    {formData.swornMonth || ''}
                  </span>
                )}
                ,
                {isEditMode ? (
                  <input
                    type="text"
                    name="swornYear"
                    value={formData.swornYear || ''}
                    onChange={handleChange}
                    className="AffidavitShortInputMcAffidavit"
                  />
                ) : (
                  <span className="AffidavitUnderlineInputMcAffidavit ReadOnlyMcAffidavit">
                    {formData.swornYear || ''}
                  </span>
                )}
                , at
                {isEditMode ? (
                  <input
                    type="text"
                    name="swornPlace"
                    value={formData.swornPlace || ''}
                    onChange={handleChange}
                    className="AffidavitMediumInputMcAffidavit"
                  />
                ) : (
                  <span className="AffidavitUnderlineInputMcAffidavit ReadOnlyMcAffidavit">
                    {formData.swornPlace || ''}
                  </span>
                )}
                , Philippines, affiant who exhibited to me his CTC/valid ID
                {isEditMode ? (
                  <input
                    type="text"
                    name="ctcId"
                    value={formData.ctcId || ''}
                    onChange={handleChange}
                    className="AffidavitMediumInputMcAffidavit"
                  />
                ) : (
                  <span className="AffidavitUnderlineInputMcAffidavit ReadOnlyMcAffidavit">
                    {formData.ctcId || ''}
                  </span>
                )}
                , at
                {isEditMode ? (
                  <input
                    type="text"
                    name="ctcPlace"
                    value={formData.ctcPlace || ''}
                    onChange={handleChange}
                    className="AffidavitMediumInputMcAffidavit"
                  />
                ) : (
                  <span className="AffidavitUnderlineInputMcAffidavit ReadOnlyMcAffidavit">
                    {formData.ctcPlace || ''}
                  </span>
                )}
                .
              </div>
            </div>

            <div className="FormRowMcAffidavit">
              <div className="SignatureBlockMcAffidavit">
                <div className="SignatureLineMcAffidavit"></div>
                <div className="SignatureCaptionMcAffidavit">
                  Signature of the Administering Officer
                </div>
                <div className="SignatureLineMcAffidavit"></div>
                <div className="SignatureCaptionMcAffidavit">Name in Print</div>
              </div>
              <div className="SignatureBlockMcAffidavit">
                <div className="SignatureLineMcAffidavit"></div>
                <div className="SignatureCaptionMcAffidavit">Position / Title / Designation</div>
                <div className="SignatureLineMcAffidavit"></div>
                <div className="SignatureCaptionMcAffidavit">Address</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Affidavit for Delayed Registration */}
      <div className="MarriageFormContainerMcAffidavit">
        <div className="FormHeaderMcAffidavit">AFFIDAVIT FOR DELAYED REGISTRATION OF MARRIAGE</div>
        <div className="FormContentMcAffidavit">
          <div className="FormSectionMcAffidavit">
            <div className="FormRowMcAffidavit">
              <div className="AffidavitTextMcAffidavit">
                I,
                {isEditMode ? (
                  <input
                    type="text"
                    name="delayedRegistrationApplicant"
                    value={formData.delayedRegistrationApplicant || ''}
                    onChange={handleChange}
                    className="AffidavitLongInputMcAffidavit"
                  />
                ) : (
                  <span className="AffidavitUnderlineInputMcAffidavit ReadOnlyMcAffidavit">
                    {formData.delayedRegistrationApplicant || 'N/A'}
                  </span>
                )}
                , of legal age, with residence and postal address at
                {isEditMode ? (
                  <input
                    type="text"
                    name="delayedRegistrationAddress"
                    value={formData.delayedRegistrationAddress || ''}
                    onChange={handleChange}
                    className="AffidavitLongInputMcAffidavit"
                  />
                ) : (
                  <span className="AffidavitUnderlineInputMcAffidavit ReadOnlyMcAffidavit">
                    {formData.delayedRegistrationAddress || 'N/A'}
                  </span>
                )}
                , after having duly sworn in accordance with law do hereby depose and say:
              </div>
            </div>

            <div className="FormRowMcAffidavit">
              <div className="AffidavitTextMcAffidavit">
                1. That I am the applicant for the delayed registration of
              </div>
              <div className="CheckboxItemMcAffidavit">
                <input
                  type="checkbox"
                  id="delayedReg1a"
                  name="delayedReg1a"
                  checked={formData.delayedReg1a || false}
                  onChange={handleChange}
                  disabled={!isEditMode}
                  className="CheckboxInputMcAffidavit"
                />
                <label htmlFor="delayedReg1a" className="CheckboxLabelMcAffidavit">
                  my marriage with
                  {isEditMode ? (
                    <input
                      type="text"
                      name="spouseName"
                      value={formData.spouseName || ''}
                      onChange={handleChange}
                      className="AffidavitUnderlineInputMcAffidavit"
                    />
                  ) : (
                    <span className="AffidavitUnderlineInputMcAffidavit ReadOnlyMcAffidavit">
                      {formData.spouseName || 'N/A'}
                    </span>
                  )}
                  in
                  {isEditMode ? (
                    <input
                      type="text"
                      name="marriagePlace"
                      value={formData.marriagePlace || getMarriagePlace()}
                      onChange={handleChange}
                      className="AffidavitMediumInputMcAffidavit"
                    />
                  ) : (
                    <span className="AffidavitUnderlineInputMcAffidavit ReadOnlyMcAffidavit">
                      {formData.marriagePlace || getMarriagePlace()}
                    </span>
                  )}
                  on
                  {isEditMode ? (
                    <input
                      type="text"
                      name="marriageDate"
                      value={formData.marriageDate || getMarriageDate()}
                      onChange={handleChange}
                      className="AffidavitMediumInputMcAffidavit"
                    />
                  ) : (
                    <span className="AffidavitUnderlineInputMcAffidavit ReadOnlyMcAffidavit">
                      {formData.marriageDate || getMarriageDate()}
                    </span>
                  )}
                  ,
                </label>
              </div>
            </div>

            <div className="FormRowMcAffidavit">
              <div className="AffidavitTextMcAffidavit">
                2. That said marriage was solemnized by
                {isEditMode ? (
                  <input
                    type="text"
                    name="solemnizingOfficerName2"
                    value={formData.solemnizingOfficerName2 || ''}
                    onChange={handleChange}
                    className="AffidavitLongInputMcAffidavit"
                  />
                ) : (
                  <span className="AffidavitUnderlineInputMcAffidavit ReadOnlyMcAffidavit">
                    {formData.solemnizingOfficerName2 || 'N/A'}
                  </span>
                )}
                (Solemnizing Officer's name) under
              </div>
              <div className="CeremonyTypesMcAffidavit">
                <div className="CeremonyTypeMcAffidavit">
                  <span>a.</span>
                  <input
                    type="checkbox"
                    id="ceremony-a"
                    name="ceremonyTypeReligious"
                    checked={formData.ceremonyTypeReligious || false}
                    onChange={handleChange}
                    disabled={!isEditMode}
                    className="CheckboxInputMcAffidavit"
                  />
                  <label htmlFor="ceremony-a" className="CheckboxLabelMcAffidavit">religious ceremony</label>
                </div>
                <div className="CeremonyTypeMcAffidavit">
                  <span>b.</span>
                  <input
                    type="checkbox"
                    id="ceremony-b"
                    name="ceremonyTypeCivil"
                    checked={formData.ceremonyTypeCivil || false}
                    onChange={handleChange}
                    disabled={!isEditMode}
                    className="CheckboxInputMcAffidavit"
                  />
                  <label htmlFor="ceremony-b" className="CheckboxLabelMcAffidavit">civil ceremony</label>
                </div>
                <div className="CeremonyTypeMcAffidavit">
                  <span>c.</span>
                  <input
                    type="checkbox"
                    id="ceremony-c"
                    name="ceremonyTypeMuslim"
                    checked={formData.ceremonyTypeMuslim || false}
                    onChange={handleChange}
                    disabled={!isEditMode}
                    className="CheckboxInputMcAffidavit"
                  />
                  <label htmlFor="ceremony-c" className="CheckboxLabelMcAffidavit">Muslim rites</label>
                </div>
                <div className="CeremonyTypeMcAffidavit">
                  <span>d.</span>
                  <input
                    type="checkbox"
                    id="ceremony-d"
                    name="ceremonyTypeTribal"
                    checked={formData.ceremonyTypeTribal || false}
                    onChange={handleChange}
                    disabled={!isEditMode}
                    className="CheckboxInputMcAffidavit"
                  />
                  <label htmlFor="ceremony-d" className="CheckboxLabelMcAffidavit">tribal rites</label>
                </div>
              </div>
            </div>

            <div className="FormRowMcAffidavit">
              <div className="AffidavitTextMcAffidavit">
                3. That the marriage was solemnized:
              </div>
              <div className="AffidavitTextMcAffidavit">
                a. with marriage license no.
                {isEditMode ? (
                  <input
                    type="text"
                    name="marriageLicenseNo"
                    value={formData.marriageLicenseNo || ''}
                    onChange={handleChange}
                    className="AffidavitUnderlineInputMcAffidavit"
                  />
                ) : (
                  <span className="AffidavitUnderlineInputMcAffidavit ReadOnlyMcAffidavit">
                    {formData.marriageLicenseNo || 'N/A'}
                  </span>
                )}
                issued on
                {isEditMode ? (
                  <input
                    type="text"
                    name="marriageLicenseDate"
                    value={formData.marriageLicenseDate || ''}
                    onChange={handleChange}
                    className="AffidavitMediumInputMcAffidavit"
                  />
                ) : (
                  <span className="AffidavitUnderlineInputMcAffidavit ReadOnlyMcAffidavit">
                    {formData.marriageLicenseDate || 'N/A'}
                  </span>
                )}
                at
                {isEditMode ? (
                  <input
                    type="text"
                    name="marriageLicensePlace"
                    value={formData.marriageLicensePlace || ''}
                    onChange={handleChange}
                    className="AffidavitMediumInputMcAffidavit"
                  />
                ) : (
                  <span className="AffidavitUnderlineInputMcAffidavit ReadOnlyMcAffidavit">
                    {formData.marriageLicensePlace || 'N/A'}
                  </span>
                )}
                ;
              </div>
              <div className="AffidavitTextMcAffidavit">
                b. under Article
                {isEditMode ? (
                  <input
                    type="text"
                    name="marriageArticle"
                    value={formData.marriageArticle || ''}
                    onChange={handleChange}
                    className="AffidavitShortInputMcAffidavit"
                  />
                ) : (
                  <span className="AffidavitUnderlineInputMcAffidavit ReadOnlyMcAffidavit">
                    {formData.marriageArticle || 'N/A'}
                  </span>
                )}
                (marriages of exceptional character);
              </div>
            </div>

            <div className="FormRowMcAffidavit">
              <div className="AffidavitTextMcAffidavit">
                4. (If the applicant is either the wife or husband) That I am a citizen of
                {isEditMode ? (
                  <input
                    type="text"
                    name="applicantCitizenship"
                    value={formData.applicantCitizenship || ''}
                    onChange={handleChange}
                    className="AffidavitUnderlineInputMcAffidavit"
                  />
                ) : (
                  <span className="AffidavitUnderlineInputMcAffidavit ReadOnlyMcAffidavit">
                    {formData.applicantCitizenship || 'N/A'}
                  </span>
                )}
                and my spouse is a citizen of
                {isEditMode ? (
                  <input
                    type="text"
                    name="spouseCitizenship"
                    value={formData.spouseCitizenship || ''}
                    onChange={handleChange}
                    className="AffidavitUnderlineInputMcAffidavit"
                  />
                ) : (
                  <span className="AffidavitUnderlineInputMcAffidavit ReadOnlyMcAffidavit">
                    {formData.spouseCitizenship || 'N/A'}
                  </span>
                )}
              </div>
            </div>

            <div className="FormRowMcAffidavit">
              <div className="AffidavitTextMcAffidavit">
                5. That the reason for the delay in registering our/their marriage is
                {isEditMode ? (
                  <input
                    type="text"
                    name="delayReason"
                    value={formData.delayReason || ''}
                    onChange={handleChange}
                    className="AffidavitLongInputMcAffidavit"
                  />
                ) : (
                  <span className="AffidavitUnderlineInputMcAffidavit ReadOnlyMcAffidavit">
                    {formData.delayReason || 'N/A'}
                  </span>
                )}
                ;
              </div>
            </div>

            <div className="FormRowMcAffidavit">
              <div className="AffidavitTextMcAffidavit">
                6. That I am executing this affidavit to attest to the truthfulness of the foregoing
                statements for all legal intents and purposes.
              </div>
            </div>

            <div className="FormRowMcAffidavit">
              <div className="AffidavitTextMcAffidavit">
                In truth whereof, I have affixed my signature below this
                {isEditMode ? (
                  <input
                    type="text"
                    name="delayedRegSignatureDay"
                    value={formData.delayedRegSignatureDay || ''}
                    onChange={handleChange}
                    className="AffidavitShortInputMcAffidavit"
                  />
                ) : (
                  <span className="AffidavitUnderlineInputMcAffidavit ReadOnlyMcAffidavit">
                    {formData.delayedRegSignatureDay || ''}
                  </span>
                )}
                day of
                {isEditMode ? (
                  <input
                    type="text"
                    name="delayedRegSignatureMonth"
                    value={formData.delayedRegSignatureMonth || ''}
                    onChange={handleChange}
                    className="AffidavitMediumInputMcAffidavit"
                  />
                ) : (
                  <span className="AffidavitUnderlineInputMcAffidavit ReadOnlyMcAffidavit">
                    {formData.delayedRegSignatureMonth || ''}
                  </span>
                )}
                ,
                {isEditMode ? (
                  <input
                    type="text"
                    name="delayedRegSignatureYear"
                    value={formData.delayedRegSignatureYear || ''}
                    onChange={handleChange}
                    className="AffidavitShortInputMcAffidavit"
                  />
                ) : (
                  <span className="AffidavitUnderlineInputMcAffidavit ReadOnlyMcAffidavit">
                    {formData.delayedRegSignatureYear || ''}
                  </span>
                )}
                , at
                {isEditMode ? (
                  <input
                    type="text"
                    name="delayedRegSignaturePlace"
                    value={formData.delayedRegSignaturePlace || ''}
                    onChange={handleChange}
                    className="AffidavitMediumInputMcAffidavit"
                  />
                ) : (
                  <span className="AffidavitUnderlineInputMcAffidavit ReadOnlyMcAffidavit">
                    {formData.delayedRegSignaturePlace || ''}
                  </span>
                )}
                , Philippines.
              </div>
            </div>

            <div className="FormRowMcAffidavit">
              <div className="SignatureBlockMcAffidavit FullWidthMcAffidavit">
                <div className="SignatureLineMcAffidavit"></div>
                <div className="SignatureCaptionMcAffidavit">
                  Signature Over Printed Name of Affiant
                </div>
              </div>
            </div>

            <div className="FormRowMcAffidavit">
              <div className="AffidavitTextMcAffidavit">
                <strong>SUBSCRIBED AND SWORN</strong> to before me this
                {isEditMode ? (
                  <input
                    type="text"
                    name="affiantSwornDay"
                    value={formData.affiantSwornDay || ''}
                    onChange={handleChange}
                    className="AffidavitShortInputMcAffidavit"
                  />
                ) : (
                  <span className="AffidavitUnderlineInputMcAffidavit ReadOnlyMcAffidavit">
                    {formData.affiantSwornDay || ''}
                  </span>
                )}
                day of
                {isEditMode ? (
                  <input
                    type="text"
                    name="affiantSwornMonth"
                    value={formData.affiantSwornMonth || ''}
                    onChange={handleChange}
                    className="AffidavitMediumInputMcAffidavit"
                  />
                ) : (
                  <span className="AffidavitUnderlineInputMcAffidavit ReadOnlyMcAffidavit">
                    {formData.affiantSwornMonth || ''}
                  </span>
                )}
                ,
                {isEditMode ? (
                  <input
                    type="text"
                    name="affiantSwornYear"
                    value={formData.affiantSwornYear || ''}
                    onChange={handleChange}
                    className="AffidavitShortInputMcAffidavit"
                  />
                ) : (
                  <span className="AffidavitUnderlineInputMcAffidavit ReadOnlyMcAffidavit">
                    {formData.affiantSwornYear || ''}
                  </span>
                )}
                , at
                {isEditMode ? (
                  <input
                    type="text"
                    name="affiantSwornPlace"
                    value={formData.affiantSwornPlace || ''}
                    onChange={handleChange}
                    className="AffidavitMediumInputMcAffidavit"
                  />
                ) : (
                  <span className="AffidavitUnderlineInputMcAffidavit ReadOnlyMcAffidavit">
                    {formData.affiantSwornPlace || ''}
                  </span>
                )}
                , Philippines, affiant who exhibited to me his CTC/valid ID
                {isEditMode ? (
                  <input
                    type="text"
                    name="affiantCtcId"
                    value={formData.affiantCtcId || ''}
                    onChange={handleChange}
                    className="AffidavitMediumInputMcAffidavit"
                  />
                ) : (
                  <span className="AffidavitUnderlineInputMcAffidavit ReadOnlyMcAffidavit">
                    {formData.affiantCtcId || ''}
                  </span>
                )}
                , at
                {isEditMode ? (
                  <input
                    type="text"
                    name="affiantCtcPlace"
                    value={formData.affiantCtcPlace || ''}
                    onChange={handleChange}
                    className="AffidavitMediumInputMcAffidavit"
                  />
                ) : (
                  <span className="AffidavitUnderlineInputMcAffidavit ReadOnlyMcAffidavit">
                    {formData.affiantCtcPlace || ''}
                  </span>
                )}
                .
              </div>
            </div>

            <div className="FormRowMcAffidavit">
              <div className="SignatureBlockMcAffidavit">
                <div className="SignatureLineMcAffidavit"></div>
                <div className="SignatureCaptionMcAffidavit">
                  Signature of the Administering Officer
                </div>
                <div className="SignatureLineMcAffidavit"></div>
                <div className="SignatureCaptionMcAffidavit">Name in Print</div>
              </div>
              <div className="SignatureBlockMcAffidavit">
                <div className="SignatureLineMcAffidavit"></div>
                <div className="SignatureCaptionMcAffidavit">Position / Title / Designation</div>
                <div className="SignatureLineMcAffidavit"></div>
                <div className="SignatureCaptionMcAffidavit">Address</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminMarriageAffidavitDetails;