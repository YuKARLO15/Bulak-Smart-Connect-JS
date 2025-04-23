import React from 'react';
import './MarriageCertificateForm.css';

const MarriageAffidavitForm = () => {
  return (
   <section className='MarriageCertificateFormContainer'>
      <div className="AffidavitCertificateForm">
          {/* Witnesses Section */}
          <div className="section witnesses-section">
            <div className="section-title">20b. WITNESSES (Print Name and Sign):</div>
            <div className="witnesses-row">
              <div className="witness-input-container">
              <input type="text" className="witness-input" />
              
              </div>
              <div className="witness-input-container">
                <input type="text" className="witness-input" />
              </div>
              <div className="witness-input-container">
                <input type="text" className="witness-input" />
              </div>
            </div>
            <div className="witnesses-row">
              <div className="witness-input-container">
                <input type="text" className="witness-input" />
              </div>
              <div className="witness-input-container">
                <input type="text" className="witness-input" />
              </div>
              <div className="witness-input-container">
                <input type="text" className="witness-input" />
              </div>
            </div>
          </div>

          {/* Affidavit of Solemnizing Officer */}
          <div className="section">
            <h3>AFFIDAVIT OF SOLEMNIZING OFFICER</h3>
            
            <div className="affidavit-content">
              <p className="affidavit-paragraph">
                I, <input type="text" className="form-input inline-input" />, of legal age, Solemnizing Officer of <input type="text" className="form-input inline-input" /> with address at <input type="text" className="form-input inline-input" />, after having sworn to in accordance with law, do hereby depose and say:
              </p>
              
              <div className="numbered-items">
                <p className="numbered-item">1. That I have solemnized the marriage between <input type="text" className="form-input inline-input" /> and <input type="text" className="form-input inline-input" />;</p>
                
                <div className="numbered-item">
                  2. <div className="checkbox-item">
                    <div className="checkbox-container">
                      <input type="checkbox" id="item2a" />
                    </div>
                    <label htmlFor="item2a">a. That I have ascertained the qualifications of the contracting parties and have found no legal impediment for them to marry as required by Article 34 of the Family Code;</label>
                  </div>
                </div>
                
                <div className="checkbox-item">
                  <div className="checkbox-container">
                    <input type="checkbox" id="item2b" />
                  </div>
                  <label htmlFor="item2b">b. That this marriage was performed in articulo mortis or at the point of death;</label>
                </div>
                
                <div className="checkbox-item">
                  <div className="checkbox-container">
                    <input type="checkbox" id="item2c" />
                  </div>
                  <label htmlFor="item2c">c. That the contracting party/ies <input type="text" className="form-input inline-input" />, being at the point of death and physically unable to sign the foregoing certificate of marriage by signature or mark, one of the witnesses to the marriage sign for him or her by writing the dying party's name and beneath it, the witness' own signature preceded by the proposition "By";</label>
                </div>
                
                <div className="checkbox-item">
                  <div className="checkbox-container">
                    <input type="checkbox" id="item2d" />
                  </div>
                  <label htmlFor="item2d">d. That the residence of either party is so located that there is no means of transportation to enable concerned party/parties to appear personally before the civil registrar;</label>
                </div>
                
                <div className="checkbox-item">
                  <div className="checkbox-container">
                    <input type="checkbox" id="item2e" />
                  </div>
                  <label htmlFor="item2e">e. That the marriage was among Muslims or among members of the Ethnic Cultural Communities and that the marriage was solemnized in accordance with their customs and practices;</label>
                </div>
                
                <p className="numbered-item">3. That I took the necessary steps to ascertain the ages and relationship of the contracting parties and that neither of them are under any legal impediment to marry each other;</p>
                
                <p className="numbered-item">4. That I am executing this affidavit to attest to the truthfulness of the foregoing statements for all legal intents and purposes.</p>
              </div>
              
              <p className="affidavit-paragraph truth-statement">
                In truth whereof, I have affixed my signature below this <input type="text" className="form-input inline-input small-input" /> day of <input type="text" className="form-input inline-input medium-input" />, <input type="text" className="form-input inline-input small-input" />, at <input type="text" className="form-input inline-input medium-input" />, Philippines.
              </p>
              
              <div className="signature-section">
                <div className="signature-line">
                  <input type="text" className="signature-input" />
                  <div className="signature-label">Signature Over Printed Name of the Solemnizing Officer</div>
                </div>
              </div>
              
              <p className="affidavit-paragraph sworn-statement">
                SUBSCRIBED AND SWORN to before me this <input type="text" className="form-input inline-input small-input" /> day of <input type="text" className="form-input inline-input medium-input" />, <input type="text" className="form-input inline-input small-input" />, at <input type="text" className="form-input inline-input medium-input" />, Philippines, affiant who exhibited to me his CTC/valid ID <input type="text" className="form-input inline-input medium-input" />, at <input type="text" className="form-input inline-input medium-input" />.
              </p>
              
              <div className="dual-signature-section">
                <div className="signature-line">
                  <input type="text" className="signature-input" />
                  <div className="signature-label">Signature of the Administering Officer</div>
                </div>
                <div className="signature-line">
                  <input type="text" className="signature-input" />
                  <div className="signature-label">Position/Title/Designation</div>
                </div>
              </div>
              
              <div className="dual-signature-section">
                <div className="signature-line">
                  <input type="text" className="signature-input" />
                  <div className="signature-label">Name in Print</div>
                </div>
                <div className="signature-line">
                  <input type="text" className="signature-input" />
                  <div className="signature-label">Address</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Affidavit for Delayed Registration of Marriage */}
          <div className="section">
            <h3>AFFIDAVIT FOR DELAYED REGISTRATION OF MARRIAGE</h3>
            
            <div className="affidavit-content">
              <p className="affidavit-paragraph">
                I, <input type="text" className="form-input inline-input" />, of legal age, single/married/divorced/widow/widower, with residence and postal address at <input type="text" className="form-input inline-input large-input" />, after having duly sworn in accordance with law do hereby depose and say:
              </p>
              
              <div className="numbered-items">
                <div className="numbered-item">
                  1. That I am the applicant for the delayed registration of 
                  <div className="checkbox-item indent">
                    <div className="checkbox-container">
                      <input type="checkbox" id="item1a" />
                    </div>
                    <label htmlFor="item1a">my marriage with <input type="text" className="form-input inline-input" /> in <input type="text" className="form-input inline-input medium-input" /> on <input type="text" className="form-input inline-input medium-input" />,</label>
                  </div>
                  <div className="checkbox-item indent">
                    <div className="checkbox-container">
                      <input type="checkbox" id="item1b" />
                    </div>
                    <label htmlFor="item1b">the marriage between <input type="text" className="form-input inline-input" /> and <input type="text" className="form-input inline-input" /> in <input type="text" className="form-input inline-input medium-input" /> on <input type="text" className="form-input inline-input medium-input" />,</label>
                  </div>
                </div>
                
                <div className="numbered-item">
                  2. That said marriage was solemnized by <input type="text" className="form-input inline-input large-input" /> (Solemnizing Officer's name) under
                  <div className="ceremony-types">
                    <div className="ceremony-type">
                      <span>a.</span>
                      <input type="checkbox" id="ceremony-a" />
                      <label htmlFor="ceremony-a">religious ceremony</label>
                    </div>
                    <div className="ceremony-type">
                      <span>b.</span>
                      <input type="checkbox" id="ceremony-b" />
                      <label htmlFor="ceremony-b">civil ceremony</label>
                    </div>
                    <div className="ceremony-type">
                      <span>c.</span>
                      <input type="checkbox" id="ceremony-c" />
                      <label htmlFor="ceremony-c">Muslim rites</label>
                    </div>
                    <div className="ceremony-type">
                      <span>d.</span>
                      <input type="checkbox" id="ceremony-d" />
                      <label htmlFor="ceremony-d">tribal rites</label>
                    </div>
                  </div>
                </div>
                
                <div className="numbered-item">
                  3. That the marriage was solemnized:
                  <div className="sub-items">
                    <p>a. with marriage license no. <input type="text" className="form-input inline-input" /> issued on <input type="text" className="form-input inline-input medium-input" /> at <input type="text" className="form-input inline-input medium-input" />;</p>
                    <p>b. under Article <input type="text" className="form-input inline-input small-input" /> (marriages of exceptional character);</p>
                  </div>
                </div>
                
                <p className="numbered-item">
                  4. (If the applicant is either the wife or husband) That I am a citizen of <input type="text" className="form-input inline-input" /> and my spouse is a citizen of <input type="text" className="form-input inline-input" />
                </p>
                
                <p className="affidavit-paragraph">
                  (If the applicant is other than the wife or husband) That the wife is a citizen of <input type="text" className="form-input inline-input" /> and the husband is a citizen of <input type="text" className="form-input inline-input" />;
                </p>
                
                <p className="numbered-item">
                  5. That the reason for the delay in registering our/their marriage is <input type="text" className="form-input inline-input large-input" />;
                </p>
                
                <p className="numbered-item">
                  6. That I am executing this affidavit to attest to the truthfulness of the foregoing statements for all legal intents and purposes.
                </p>
              </div>
              
              <p className="affidavit-paragraph truth-statement">
                In truth whereof, I have affixed my signature below this <input type="text" className="form-input inline-input small-input" /> day of <input type="text" className="form-input inline-input medium-input" />, <input type="text" className="form-input inline-input small-input" />, at <input type="text" className="form-input inline-input medium-input" />, Philippines.
              </p>
              
              <div className="signature-section">
                <div className="signature-line">
                  <input type="text" className="signature-input" />
                  <div className="signature-label">Signature Over Printed Name of Affiant</div>
                </div>
              </div>
              
              <p className="affidavit-paragraph sworn-statement">
                SUBSCRIBED AND SWORN to before me this <input type="text" className="form-input inline-input small-input" /> day of <input type="text" className="form-input inline-input medium-input" />, <input type="text" className="form-input inline-input small-input" />, at <input type="text" className="form-input inline-input medium-input" />, Philippines, affiant who exhibited to me his CTC/valid ID <input type="text" className="form-input inline-input medium-input" />, at <input type="text" className="form-input inline-input medium-input" />.
              </p>
              
              <div className="dual-signature-section">
                <div className="signature-line">
                  <input type="text" className="signature-input" />
                  <div className="signature-label">Signature of the Administering Officer</div>
                </div>
                <div className="signature-line">
                  <input type="text" className="signature-input" />
                  <div className="signature-label">Position/Title/Designation</div>
                </div>
              </div>
              
              <div className="dual-signature-section">
                <div className="signature-line">
                  <input type="text" className="signature-input" />
                  <div className="signature-label">Name in Print</div>
                </div>
                <div className="signature-line">
                  <input type="text" className="signature-input" />
                  <div className="signature-label">Address</div>
                </div>
              </div>
            </div>
          </div>
      </div>
   
    </section>
  );
};

export default MarriageAffidavitForm;