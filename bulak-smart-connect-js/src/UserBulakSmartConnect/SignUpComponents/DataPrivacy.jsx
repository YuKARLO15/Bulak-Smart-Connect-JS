import React, { useState, useEffect } from 'react';
import '../SignUpComponents/DataPrivacy.css';
import { useNavigate, useLocation } from 'react-router-dom';

const DataPrivacy = ({ onAgreeChange }) => {
  const [agreed, setAgreed] = useState(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const fromPrivacy = urlParams.get('agreed');
    
    if (fromPrivacy === 'true') {
      setAgreed(true);
      if (onAgreeChange) {
        onAgreeChange(true);
      }
    }


    const handleMessage = (event) => {
      if (event.data === 'visited-terms-and-conditions') {
        setAgreed(true);
        if (onAgreeChange) {
          onAgreeChange(true);
        }
      }
    };
    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [location, onAgreeChange]);

  const handleAgreement = e => {

    const termsWindow = window.open(
      '/PrivacyPolicy?redirect=/SignUpForm', 

    );
    
    if (termsWindow) {
      termsWindow.focus();
    }
  };

  const handleDisagreement = e => {
    setShowConfirmDialog(true);
  };

  const confirmDisagreement = () => {
    setAgreed(false);
    if (onAgreeChange) {
      onAgreeChange(false);
    }
      sessionStorage.removeItem('signupFormData');
 
    setShowConfirmDialog(false);
    navigate('/');
  };

  const cancelDisagreement = () => {
    setShowConfirmDialog(false);
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
         <p><strong>Choose one | Pumili ng isa</strong></p>
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
          <label className='do-not'>
            <input 
              type="radio"
              name="agree"
              value="no"
              checked={agreed === false}
              onChange={handleDisagreement}
            />
            I do not agree / Hindi Sumasang Ayon
          </label>
        </div>
      </div>

      {/* Confirmation Dialog */}
       {showConfirmDialog && (
        <div className="dialog-overlay-signupdataprivacy">
          <div className="dialog-box-signupdataprivacy">
            <h3>Are you sure? </h3>
            <p>
              If you do not agree, all progress made will be deleted and you will be redirected to the home page.
            </p>
          
            <div className="dialog-buttons-signupdataprivacy">
              <button onClick={confirmDisagreement} className="confirm-btn-signupdataprivacy">
                Yes, I'm sure 
              </button>
              <button onClick={cancelDisagreement} className="cancel-btn-signupdataprivacy">
                Cancel 
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataPrivacy;