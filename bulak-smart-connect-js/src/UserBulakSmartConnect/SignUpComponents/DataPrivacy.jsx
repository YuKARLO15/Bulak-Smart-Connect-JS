import React, { useState } from 'react';
import '../SignUpComponents/DataPrivacy.css';

const DataPrivacy = ({ onAgreeChange }) => {
  const [agreed, setAgreed] = useState(null);

  const handleAgreement = e => {
    const value = e.target.value === 'yes';
    setAgreed(value);
    onAgreeChange(value);
  };

  return (
    <div className="data-privacy-section">
      <div className="privacy-text">
        <h2>Data Privacy & Terms and Conditions</h2>
        <p>
          By signing up, you agree to our data privacy policy and terms of service. Your personal
          information will be handled securely and used solely for municipal civil registration
          purposes. |  Sa pamamagitan ng pag sign-up, sumasang-ayon ka sa aming polisiya sa privacy ng datos at
          mga termino ng serbisyo. Ang iyong personal na impormasyon ay hahawakan nang ligtas at
          gagamitin lamang para sa mga layunin ng rehistrasyong sibil ng munisipalidad.
        </p>
        <p>
         
        </p>
        <div className="radio-group">
          <label>
            <input
              type="radio"
              name="agree"
              value="yes"
              checked={agreed === true}
              onChange={handleAgreement}
              required
            />
            I agree to the Data Privacy Policy & Terms / Sumasang-ayon ako sa Data Privacy Policy &
            Terms.
          </label>
          </div>
           <div className="radio-group-2">
          <label>
            <input 
              type="radio"
              name="agree"
              value="no"
              checked={agreed === false}
              onChange={handleAgreement}
            />
            I do not agree / Hindi Sumasang Ayon
          </label>
        </div>
      </div>
    </div>
  );
};

export default DataPrivacy;
