import React, { useEffect } from 'react';
import './MarriageAffidavitForm.css';

const MarriageAffidavitForm = ({
  formData,
  handleChange,
  errors: propErrors,
  onValidationChange,
}) => {
  // Always report form as valid to parent component
  useEffect(() => {
    if (onValidationChange) {
      onValidationChange(true);
    }
  }, [onValidationChange]);

  // Simple submit handler
  const handleSubmit = e => {
    e.preventDefault();
    console.log('Form reviewed:', formData);

    // Always report success to parent
    if (onValidationChange) {
      onValidationChange(true);
    }
  };

  return (
    <section className="affidavit-form-container">
      <div className="view-only-notice">
        <strong>View Only:</strong> This form is in read-only mode and cannot be edited.
      </div>

      <form onSubmit={handleSubmit} className="affidavit-form1-container">
        {/* Witnesses section */}
        <div className="affidavit-witnesses-section">
          <div className="affidavit-section-title">20b. WITNESSES (Print Name and Sign)</div>
          <div className="affidavit-witnesses-row">
            <div className="affidavit-witness-input-container">
              <input
                type="text"
                name="witness1Name"
                className="affidavit-witness-input disabled-input"
                value={formData.witness1Name || ''}
                disabled
              />
            </div>
            <div className="affidavit-witness-input-container">
              <input
                type="text"
                name="witness1Address"
                className="affidavit-witness-input disabled-input"
                value={formData.witness1Address || ''}
                disabled
              />
            </div>
            <div className="affidavit-witness-input-container">
              <input
                type="text"
                name="witness1Signature"
                className="affidavit-witness-input disabled-input"
                value={formData.witness1Signature || ''}
                disabled
              />
            </div>
          </div>
          <div className="affidavit-witnesses-row">
            <div className="affidavit-witness-input-container">
              <input
                type="text"
                name="witness2Name"
                className="affidavit-witness-input disabled-input"
                value={formData.witness2Name || ''}
                disabled
              />
            </div>
            <div className="affidavit-witness-input-container">
              <input
                type="text"
                name="witness2Address"
                className="affidavit-witness-input disabled-input"
                value={formData.witness2Address || ''}
                disabled
              />
            </div>
            <div className="affidavit-witness-input-container">
              <input
                type="text"
                name="witness2Signature"
                className="affidavit-witness-input disabled-input"
                value={formData.witness2Signature || ''}
                disabled
              />
            </div>
          </div>
        </div>

        {/* Affidavit of Solemnizing Officer */}
        <div className="affidavit-officer-section">
          <h3 className="affidavit-heading">AFFIDAVIT OF SOLEMNIZING OFFICER</h3>

          <div className="affidavit-content">
            <p className="affidavit-paragraph">
              I,{' '}
              <input
                type="text"
                name="solemnizingOfficerName"
                className="affidavit-form-input affidavit-inline-input disabled-input"
                value={formData.solemnizingOfficerName || ''}
                disabled
              />
              , of legal age, Solemnizing Officer of{' '}
              <input
                type="text"
                className="affidavit-form-input affidavit-inline-input disabled-input"
                name="solemnizingOfficerInstitution"
                value={formData.solemnizingOfficerInstitution || ''}
                disabled
              />
              with address at{' '}
              <input
                type="text"
                className="affidavit-form-input affidavit-inline-input disabled-input"
                name="solemnizingOfficerAddress"
                value={formData.solemnizingOfficerAddress || ''}
                disabled
              />
              , after having sworn to in accordance with law, do hereby depose and say:
            </p>

            <div className="affidavit-numbered-items">
              <p className="affidavit-numbered-item">
                1. That I have solemnized the marriage between{' '}
                <input
                  type="text"
                  className="affidavit-form-input affidavit-inline-input disabled-input"
                  name="husbandFullNameAffidavit"
                  value={formData.husbandFullNameAffidavit || ''}
                  disabled
                />{' '}
                and{' '}
                <input
                  type="text"
                  className="affidavit-form-input affidavit-inline-input disabled-input"
                  name="wifeFullNameAffidavit"
                  value={formData.wifeFullNameAffidavit || ''}
                  disabled
                />
                ;
              </p>

              <div className="affidavit-numbered-item">
                2.{' '}
                <div className="affidavit-checkbox-item">
                  <div className="affidavit-checkbox-container">
                    <input
                      type="checkbox"
                      id="item2a"
                      name="item2a"
                      checked={formData.item2a || false}
                      disabled
                    />
                  </div>
                  <label htmlFor="item2a">
                    a. That I have ascertained the qualifications of the contracting parties and
                    have found no legal impediment for them to marry as required by Article 34 of
                    the Family Code;
                  </label>
                </div>
              </div>

              <div className="affidavit-checkbox-item">
                <div className="affidavit-checkbox-container">
                  <input
                    type="checkbox"
                    id="item2b"
                    name="item2b"
                    checked={formData.item2b || false}
                    disabled
                  />
                </div>
                <label htmlFor="item2b">
                  b. That this marriage was performed in articulo mortis or at the point of death;
                </label>
              </div>

              <div className="affidavit-checkbox-item">
                <div className="affidavit-checkbox-container">
                  <input
                    type="checkbox"
                    id="item2c"
                    name="item2c"
                    checked={formData.item2c || false}
                    disabled
                  />
                </div>
                <label htmlFor="item2c">
                  c. That the contracting party/ies{' '}
                  <input
                    type="text"
                    className="affidavit-form-input affidavit-inline-input disabled-input"
                    name="contractingParties"
                    value={formData.contractingParties || ''}
                    disabled
                  />
                  , being at the point of death and physically unable to sign the foregoing
                  certificate of marriage by signature or mark, one of the witnesses to the marriage
                  sign for him or her by writing the dying party's name and beneath it, the witness'
                  own signature preceded by the proposition "By";
                </label>
              </div>

              <div className="affidavit-checkbox-item">
                <div className="affidavit-checkbox-container">
                  <input
                    type="checkbox"
                    id="item2d"
                    name="item2d"
                    checked={formData.item2d || false}
                    disabled
                  />
                </div>
                <label htmlFor="item2d">
                  d. That the residence of either party is so located that there is no means of
                  transportation to enable concerned party/parties to appear personally before the
                  civil registrar;
                </label>
              </div>

              <div className="affidavit-checkbox-item">
                <div className="affidavit-checkbox-container">
                  <input
                    type="checkbox"
                    id="item2e"
                    name="item2e"
                    checked={formData.item2e || false}
                    disabled
                  />
                </div>
                <label htmlFor="item2e">
                  e. That the marriage was among Muslims or among members of the Ethnic Cultural
                  Communities and that the marriage was solemnized in accordance with their customs
                  and practices;
                </label>
              </div>

              <p className="affidavit-numbered-item">
                3. That I took the necessary steps to ascertain the ages and relationship of the
                contracting parties and that neither of them are under any legal impediment to marry
                each other;
              </p>

              <p className="affidavit-numbered-item">
                4. That I am executing this affidavit to attest to the truthfulness of the foregoing
                statements for all legal intents and purposes.
              </p>
            </div>

            <p className="affidavit-paragraph affidavit-truth-statement">
              In truth whereof, I have affixed my signature below this{' '}
              <input
                type="text"
                className="affidavit-form-input affidavit-inline-input affidavit-small-input disabled-input"
                name="officerSignatureDay"
                value={formData.officerSignatureDay || ''}
                disabled
              />{' '}
              day of{' '}
              <input
                type="text"
                className="affidavit-form-input affidavit-inline-input affidavit-medium-input disabled-input"
                name="officerSignatureMonth"
                value={formData.officerSignatureMonth || ''}
                disabled
              />
              ,{' '}
              <input
                type="text"
                className="affidavit-form-input affidavit-inline-input affidavit-small-input disabled-input"
                name="officerSignatureYear"
                value={formData.officerSignatureYear || ''}
                disabled
              />
              , at{' '}
              <input
                type="text"
                className="affidavit-form-input affidavit-inline-input affidavit-medium-input disabled-input"
                name="officerSignaturePlace"
                value={formData.officerSignaturePlace || ''}
                disabled
              />
              , Philippines.
            </p>

            <div className="affidavit-signature-section">
              <div className="affidavit-signature-line">
                <input
                  type="text"
                  className="affidavit-signature-input disabled-input"
                  name="officerSignature"
                  value={formData.officerSignature || ''}
                  disabled
                />
                <div className="affidavit-signature-label">
                  Signature Over Printed Name of the Solemnizing Officer
                </div>
              </div>
            </div>

            <p className="affidavit-paragraph affidavit-sworn-statement">
              SUBSCRIBED AND SWORN to before me this{' '}
              <input
                type="text"
                className="affidavit-form-input affidavit-inline-input affidavit-small-input disabled-input"
                name="swornDay"
                value={formData.swornDay || ''}
                disabled
              />{' '}
              day of{' '}
              <input
                type="text"
                className="affidavit-form-input affidavit-inline-input affidavit-medium-input disabled-input"
                name="swornMonth"
                value={formData.swornMonth || ''}
                disabled
              />
              ,{' '}
              <input
                type="text"
                className="affidavit-form-input affidavit-inline-input affidavit-small-input disabled-input"
                name="swornYear"
                value={formData.swornYear || ''}
                disabled
              />
              , at{' '}
              <input
                type="text"
                className="affidavit-form-input affidavit-inline-input affidavit-medium-input disabled-input"
                name="swornPlace"
                value={formData.swornPlace || ''}
                disabled
              />
              , Philippines, affiant who exhibited to me his CTC/valid ID{' '}
              <input
                type="text"
                className="affidavit-form-input affidavit-inline-input affidavit-medium-input disabled-input"
                name="ctcId"
                value={formData.ctcId || ''}
                disabled
              />
              , at{' '}
              <input
                type="text"
                className="affidavit-form-input affidavit-inline-input affidavit-medium-input disabled-input"
                name="ctcPlace"
                value={formData.ctcPlace || ''}
                disabled
              />
              .
            </p>

            <div className="affidavit-dual-signature-section">
              <div className="affidavit-signature-line">
                <input
                  type="text"
                  className="affidavit-signature-input disabled-input"
                  name="adminOfficerSignature"
                  value={formData.adminOfficerSignature || ''}
                  disabled
                />
                <div className="affidavit-signature-label">
                  Signature of the Administering Officer
                </div>
              </div>
              <div className="affidavit-signature-line">
                <input
                  type="text"
                  className="affidavit-signature-input disabled-input"
                  name="adminOfficerPosition"
                  value={formData.adminOfficerPosition || ''}
                  disabled
                />
                <div className="affidavit-signature-label">Position/Title/Designation</div>
              </div>
            </div>

            <div className="affidavit-dual-signature-section">
              <div className="affidavit-signature-line">
                <input
                  type="text"
                  className="affidavit-signature-input disabled-input"
                  name="adminOfficerName"
                  value={formData.adminOfficerName || ''}
                  disabled
                />
                <div className="affidavit-signature-label">Name in Print</div>
              </div>
              <div className="affidavit-signature-line">
                <input
                  type="text"
                  className="affidavit-signature-input disabled-input"
                  name="adminOfficerAddress"
                  value={formData.adminOfficerAddress || ''}
                  disabled
                />
                <div className="affidavit-signature-label">Address</div>
              </div>
            </div>
          </div>
        </div>

        {/* Affidavit for Delayed Registration section */}
        <div className="affidavit-delayed-section">
          <h3 className="affidavit-heading">AFFIDAVIT FOR DELAYED REGISTRATION OF MARRIAGE</h3>

          <div className="affidavit-content">
            <p className="affidavit-paragraph">
              I,{' '}
              <input
                type="text"
                className="affidavit-form-input affidavit-inline-input disabled-input"
                name="delayedRegistrationApplicant"
                value={formData.delayedRegistrationApplicant || ''}
                disabled
              />
              , of legal age, with residence and postal address at{' '}
              <input
                type="text"
                className="affidavit-form-input affidavit-inline-input affidavit-large-input disabled-input"
                name="delayedRegistrationAddress"
                value={formData.delayedRegistrationAddress || ''}
                disabled
              />
              , after having duly sworn in accordance with law do hereby depose and say:
            </p>

            <div className="affidavit-numbered-items">
              <div className="affidavit-numbered-item">
                1. That I am the applicant for the delayed registration of
                <div className="affidavit-checkbox-item affidavit-indent">
                  <div className="affidavit-checkbox-container">
                    <input
                      type="checkbox"
                      id="delayedReg1a"
                      name="delayedReg1a"
                      checked={formData.delayedReg1a || false}
                      disabled
                    />
                  </div>
                  <label htmlFor="delayedReg1a">
                    my marriage with{' '}
                    <input
                      type="text"
                      className="affidavit-form-input affidavit-inline-input disabled-input"
                      name="spouseName"
                      value={formData.spouseName || ''}
                      disabled
                    />{' '}
                    in{' '}
                    <input
                      type="text"
                      className="affidavit-form-input affidavit-inline-input affidavit-medium-input disabled-input"
                      name="marriagePlace"
                      value={formData.marriagePlace || ''}
                      disabled
                    />{' '}
                    on{' '}
                    <input
                      type="text"
                      className="affidavit-form-input affidavit-inline-input affidavit-medium-input disabled-input"
                      name="marriageDate"
                      value={formData.marriageDate || ''}
                      disabled
                    />
                    ,
                  </label>
                </div>
                <div className="affidavit-checkbox-item affidavit-indent">
                  <div className="affidavit-checkbox-container">
                    <input
                      type="checkbox"
                      id="delayedReg1b"
                      name="delayedReg1b"
                      checked={formData.delayedReg1b || false}
                      disabled
                    />
                  </div>
                  <label htmlFor="delayedReg1b">
                    the marriage between{' '}
                    <input
                      type="text"
                      className="affidavit-form-input affidavit-inline-input disabled-input"
                      name="person1"
                      value={formData.person1 || ''}
                      disabled
                    />{' '}
                    and{' '}
                    <input
                      type="text"
                      className="affidavit-form-input affidavit-inline-input disabled-input"
                      name="person2"
                      value={formData.person2 || ''}
                      disabled
                    />{' '}
                    in{' '}
                    <input
                      type="text"
                      className="affidavit-form-input affidavit-inline-input affidavit-medium-input disabled-input"
                      name="marriagePlace2"
                      value={formData.marriagePlace2 || ''}
                      disabled
                    />{' '}
                    on{' '}
                    <input
                      type="text"
                      className="affidavit-form-input affidavit-inline-input affidavit-medium-input disabled-input"
                      name="marriageDate2"
                      value={formData.marriageDate2 || ''}
                      disabled
                    />
                    ,
                  </label>
                </div>
              </div>

              <div className="affidavit-numbered-item">
                2. That said marriage was solemnized by{' '}
                <input
                  type="text"
                  className="affidavit-form-input affidavit-inline-input affidavit-large-input disabled-input"
                  name="solemnizingOfficerName2"
                  value={formData.solemnizingOfficerName2 || ''}
                  disabled
                />{' '}
                (Solemnizing Officer's name) under
                <div className="affidavit-ceremony-types">
                  <div className="affidavit-ceremony-type">
                    <span>a.</span>
                    <input
                      type="checkbox"
                      id="ceremony-a"
                      name="ceremonyTypeReligious"
                      checked={formData.ceremonyTypeReligious || false}
                      disabled
                    />
                    <label htmlFor="ceremony-a">religious ceremony</label>
                  </div>
                  <div className="affidavit-ceremony-type">
                    <span>b.</span>
                    <input
                      type="checkbox"
                      id="ceremony-b"
                      name="ceremonyTypeCivil"
                      checked={formData.ceremonyTypeCivil || false}
                      disabled
                    />
                    <label htmlFor="ceremony-b">civil ceremony</label>
                  </div>
                  <div className="affidavit-ceremony-type">
                    <span>c.</span>
                    <input
                      type="checkbox"
                      id="ceremony-c"
                      name="ceremonyTypeMuslim"
                      checked={formData.ceremonyTypeMuslim || false}
                      disabled
                    />
                    <label htmlFor="ceremony-c">Muslim rites</label>
                  </div>
                  <div className="affidavit-ceremony-type">
                    <span>d.</span>
                    <input
                      type="checkbox"
                      id="ceremony-d"
                      name="ceremonyTypeTribal"
                      checked={formData.ceremonyTypeTribal || false}
                      disabled
                    />
                    <label htmlFor="ceremony-d">tribal rites</label>
                  </div>
                </div>
              </div>

              <div className="affidavit-numbered-item">
                3. That the marriage was solemnized:
                <div className="affidavit-sub-items">
                  <p>
                    a. with marriage license no.{' '}
                    <input
                      type="text"
                      className="affidavit-form-input affidavit-inline-input disabled-input"
                      name="marriageLicenseNo"
                      value={formData.marriageLicenseNo || ''}
                      disabled
                    />{' '}
                    issued on{' '}
                    <input
                      type="text"
                      className="affidavit-form-input affidavit-inline-input affidavit-medium-input disabled-input"
                      name="marriageLicenseDate"
                      value={formData.marriageLicenseDate || ''}
                      disabled
                    />{' '}
                    at{' '}
                    <input
                      type="text"
                      className="affidavit-form-input affidavit-inline-input affidavit-medium-input disabled-input"
                      name="marriageLicensePlace"
                      value={formData.marriageLicensePlace || ''}
                      disabled
                    />
                    ;
                  </p>
                  <p>
                    b. under Article{' '}
                    <input
                      type="text"
                      className="affidavit-form-input affidavit-inline-input affidavit-small-input disabled-input"
                      name="marriageArticle"
                      value={formData.marriageArticle || ''}
                      disabled
                    />{' '}
                    (marriages of exceptional character);
                  </p>
                </div>
              </div>

              <p className="affidavit-numbered-item">
                4. (If the applicant is either the wife or husband) That I am a citizen of{' '}
                <input
                  type="text"
                  className="affidavit-form-input affidavit-inline-input"
                  name="applicantCitizenship"
                  value={formData.applicantCitizenship || ''}
                  disabled
                />{' '}
                and my spouse is a citizen of{' '}
                <input
                  type="text"
                  className="affidavit-form-input affidavit-inline-input"
                  name="spouseCitizenship"
                  value={formData.spouseCitizenship || ''}
                  disabled
                />
              </p>

              <p className="affidavit-paragraph">
                (If the applicant is other than the wife or husband) That the wife is a citizen of{' '}
                <input
                  type="text"
                  className="affidavit-form-input affidavit-inline-input"
                  name="wifeCitizenship"
                  value={formData.wifeCitizenship || ''}
                  disabled
                />{' '}
                and the husband is a citizen of{' '}
                <input
                  type="text"
                  className="affidavit-form-input affidavit-inline-input"
                  name="husbandCitizenship"
                  value={formData.husbandCitizenship || ''}
                  disabled
                />
                ;
              </p>

              <p className="affidavit-numbered-item">
                5. That the reason for the delay in registering our/their marriage is{' '}
                <input
                  type="text"
                  className="affidavit-form-input affidavit-inline-input affidavit-large-input"
                  name="delayReason"
                  value={formData.delayReason || ''}
                  disabled
                />
                ;
              </p>

              <p className="affidavit-numbered-item">
                6. That I am executing this affidavit to attest to the truthfulness of the foregoing
                statements for all legal intents and purposes.
              </p>
            </div>

            <p className="affidavit-paragraph affidavit-truth-statement">
              In truth whereof, I have affixed my signature below this{' '}
              <input
                type="text"
                className="affidavit-form-input affidavit-inline-input affidavit-small-input disabled-input"
                name="delayedRegSignatureDay"
                value={formData.delayedRegSignatureDay || ''}
                disabled
              />{' '}
              day of{' '}
              <input
                type="text"
                className="affidavit-form-input affidavit-inline-input affidavit-medium-input disabled-input"
                name="delayedRegSignatureMonth"
                value={formData.delayedRegSignatureMonth || ''}
                disabled
              />
              ,{' '}
              <input
                type="text"
                className="affidavit-form-input affidavit-inline-input affidavit-small-input disabled-input"
                name="delayedRegSignatureYear"
                value={formData.delayedRegSignatureYear || ''}
                disabled
              />
              , at{' '}
              <input
                type="text"
                className="affidavit-form-input affidavit-inline-input affidavit-medium-input disabled-input"
                name="delayedRegSignaturePlace"
                value={formData.delayedRegSignaturePlace || ''}
                disabled
              />
              , Philippines.
            </p>

            <div className="affidavit-signature-section">
              <div className="affidavit-signature-line">
                <input
                  type="text"
                  className="affidavit-signature-input"
                  name="affiantSignature"
                  value={formData.affiantSignature || ''}
                  disabled
                />
                <div className="affidavit-signature-label">
                  Signature Over Printed Name of Affiant
                </div>
              </div>
            </div>

            <p className="affidavit-paragraph affidavit-sworn-statement">
              SUBSCRIBED AND SWORN to before me this{' '}
              <input
                type="text"
                className="affidavit-form-input affidavit-inline-input affidavit-small-input disabled-input"
                name="affiantSwornDay"
                value={formData.affiantSwornDay || ''}
                disabled
              />{' '}
              day of{' '}
              <input
                type="text"
                className="affidavit-form-input affidavit-inline-input affidavit-medium-input disabled-input"
                name="affiantSwornMonth"
                value={formData.affiantSwornMonth || ''}
                disabled
              />
              ,{' '}
              <input
                type="text"
                className="affidavit-form-input affidavit-inline-input affidavit-small-input disabled-input"
                name="affiantSwornYear"
                value={formData.affiantSwornYear || ''}
                disabled
              />
              , at{' '}
              <input
                type="text"
                className="affidavit-form-input affidavit-inline-input affidavit-medium-input disabled-input"
                name="affiantSwornPlace"
                value={formData.affiantSwornPlace || ''}
                disabled
              />
              , Philippines, affiant who exhibited to me his CTC/valid ID{' '}
              <input
                type="text"
                className="affidavit-form-input affidavit-inline-input affidavit-medium-input disabled-input"
                name="affiantCtcId"
                value={formData.affiantCtcId || ''}
                disabled
              />
              , at{' '}
              <input
                type="text"
                className="affidavit-form-input affidavit-inline-input affidavit-medium-input disabled-input"
                name="affiantCtcPlace"
                value={formData.affiantCtcPlace || ''}
                disabled
              />
              .
            </p>

            <div className="affidavit-dual-signature-section">
              <div className="affidavit-signature-line">
                <input
                  type="text"
                  className="affidavit-signature-input"
                  name="affiantAdminOfficerSignature"
                  value={formData.affiantAdminOfficerSignature || ''}
                  disabled
                />
                <div className="affidavit-signature-label">
                  Signature of the Administering Officer
                </div>
              </div>
              <div className="affidavit-signature-line">
                <input
                  type="text"
                  className="affidavit-signature-input"
                  name="affiantAdminOfficerPosition"
                  value={formData.affiantAdminOfficerPosition || ''}
                  disabled
                />
                <div className="affidavit-signature-label">Position/Title/Designation</div>
              </div>
            </div>

            <div className="affidavit-dual-signature-section">
              <div className="affidavit-signature-line">
                <input
                  type="text"
                  className="affidavit-signature-input"
                  name="affiantAdminOfficerName"
                  value={formData.affiantAdminOfficerName || ''}
                  disabled
                />
                <div className="affidavit-signature-label">Name in Print</div>
              </div>
              <div className="affidavit-signature-line">
                <input
                  type="text"
                  className="affidavit-signature-input"
                  name="affiantAdminOfficerAddress"
                  value={formData.affiantAdminOfficerAddress || ''}
                  disabled
                />
                <div className="affidavit-signature-label">Address</div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </section>
  );
};

export default MarriageAffidavitForm;
