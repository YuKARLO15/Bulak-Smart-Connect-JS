import React, { useState } from 'react';
import { otpService } from '../services/otpService';
import OTPVerification from './OTPVerification';

const OTPTest = () => {
  const [email, setEmail] = useState('test@example.com');
  const [showOtpModal, setShowOtpModal] = useState(false);
  const [purpose, setPurpose] = useState('verification');
  const [results, setResults] = useState([]);

  const addResult = (message, type = 'info') => {
    setResults(prev => [...prev, { 
      message, 
      type, 
      time: new Date().toLocaleTimeString() 
    }]);
  };

  const testSendOTP = async () => {
    try {
      await otpService.sendOTP(email, purpose);
      addResult(`✅ OTP sent to ${email}`, 'success');
      setShowOtpModal(true);
    } catch (error) {
      addResult(`❌ Failed to send OTP: ${error.message}`, 'error');
    }
  };

  const testForgotPassword = async () => {
    try {
      await otpService.forgotPassword(email);
      addResult(`✅ Password reset code sent to ${email}`, 'success');
    } catch (error) {
      addResult(`❌ Failed to send reset code: ${error.message}`, 'error');
    }
  };

  const handleOtpVerified = () => {
    addResult('✅ OTP verified successfully!', 'success');
    setShowOtpModal(false);
  };

  const handleOtpCancel = () => {
    addResult('❌ OTP verification cancelled', 'warning');
    setShowOtpModal(false);
  };

  const clearResults = () => {
    setResults([]);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <h2>🧪 OTP System Test Panel</h2>
      
      <div style={{ marginBottom: '20px', display: 'grid', gap: '10px' }}>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
          placeholder="Enter test email"
        />

        <label>Purpose:</label>
        <select
          value={purpose}
          onChange={(e) => setPurpose(e.target.value)}
          style={{ padding: '8px', border: '1px solid #ddd', borderRadius: '4px' }}
        >
          <option value="verification">Email Verification</option>
          <option value="password_reset">Password Reset</option>
        </select>
      </div>

      <div style={{ marginBottom: '20px', display: 'grid', gap: '10px' }}>
        <button 
          onClick={testSendOTP}
          style={{
            padding: '10px',
            background: '#667eea',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          📧 Send OTP & Test Verification
        </button>
        
        <button 
          onClick={testForgotPassword}
          style={{
            padding: '10px',
            background: '#e74c3c',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          🔒 Test Forgot Password
        </button>
      </div>

      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3>Test Results:</h3>
          <button 
            onClick={clearResults}
            style={{
              padding: '5px 10px',
              background: '#ccc',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Clear
          </button>
        </div>
        
        <div style={{ 
          background: '#f5f5f5', 
          padding: '10px', 
          borderRadius: '5px',
          maxHeight: '300px',
          overflowY: 'auto'
        }}>
          {results.map((result, index) => (
            <div
              key={index}
              style={{
                padding: '8px',
                margin: '5px 0',
                borderLeft: `3px solid ${
                  result.type === 'success' ? '#27ae60' :
                  result.type === 'error' ? '#e74c3c' :
                  result.type === 'warning' ? '#f39c12' : '#3498db'
                }`,
                background: 'white',
                borderRadius: '4px'
              }}
            >
              <small style={{ color: '#666' }}>{result.time}</small><br />
              {result.message}
            </div>
          ))}
          {results.length === 0 && (
            <p style={{ color: '#666', textAlign: 'center' }}>
              No test results yet. Click a button above to start testing!
            </p>
          )}
        </div>
      </div>

      {showOtpModal && (
        <OTPVerification
          email={email}
          purpose={purpose}
          onVerified={handleOtpVerified}
          onCancel={handleOtpCancel}
          title={`Verify OTP - ${purpose}`}
        />
      )}
    </div>
  );
};

export default OTPTest;