import React, { useState, useEffect } from 'react';
import { otpService } from '../services/otpService';
import './OTPVerification.css';

const OTPVerification = ({ 
  email, 
  purpose = 'verification', 
  onVerified, 
  onCancel,
  title = 'Email Verification'
}) => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  // Handle OTP input
  const handleOtpChange = (index, value) => {
    if (value.length > 1) return; // Prevent multiple characters
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }

    // Auto-verify when all digits entered
    if (newOtp.every(digit => digit !== '') && newOtp.join('').length === 6) {
      handleVerify(newOtp.join(''));
    }
  };

  // Handle backspace
  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  // Verify OTP
  const handleVerify = async (otpValue = otp.join('')) => {
    if (otpValue.length !== 6) {
      setError('Please enter all 6 digits');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await otpService.verifyOTP(email, otpValue, purpose);
      onVerified && onVerified();
    } catch (error) {
      setError(error.message || 'Invalid OTP. Please try again.');
      setOtp(['', '', '', '', '', '']); // Clear OTP on error
      document.getElementById('otp-0')?.focus();
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResend = async () => {
    setIsLoading(true);
    setError('');

    try {
      await otpService.sendOTP(email, purpose);
      setTimeLeft(300);
      setCanResend(false);
      setOtp(['', '', '', '', '', '']);
      document.getElementById('otp-0')?.focus();
      alert('✅ New OTP sent to your email!');
    } catch (error) {
      setError('Failed to resend OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="otp-verification-container">
      <div className="otp-verification-card">
        <div className="otp-header">
          <h2>{title}</h2>
          <p>We've sent a 6-digit code to <strong>{email}</strong></p>
        </div>

        <div className="otp-input-container">
          {otp.map((digit, index) => (
            <input
              key={index}
              id={`otp-${index}`}
              type="text"
              value={digit}
              onChange={(e) => handleOtpChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="otp-input"
              maxLength="1"
              disabled={isLoading}
            />
          ))}
        </div>

        {error && (
          <div className="otp-error">
            ❌ {error}
          </div>
        )}

        <div className="otp-timer">
          {timeLeft > 0 ? (
            <p>⏰ Code expires in {formatTime(timeLeft)}</p>
          ) : (
            <p className="expired">❌ Code has expired</p>
          )}
        </div>

        <div className="otp-actions">
          <button
            onClick={() => handleVerify()}
            disabled={isLoading || otp.some(digit => !digit)}
            className="verify-btn"
          >
            {isLoading ? '🔄 Verifying...' : '✅ Verify Code'}
          </button>

          <button
            onClick={handleResend}
            disabled={!canResend || isLoading}
            className="resend-btn"
          >
            {isLoading ? '📧 Sending...' : '🔄 Resend Code'}
          </button>

          <button
            onClick={onCancel}
            className="cancel-btn"
          >
            ❌ Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;