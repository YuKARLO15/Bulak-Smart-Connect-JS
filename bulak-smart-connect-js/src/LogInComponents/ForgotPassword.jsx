import React, { useState } from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import OutlinedInput from '@mui/material/OutlinedInput';
import TextField from '@mui/material/TextField';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import './ForgotPassword.css';
import { otpService } from '../services/otpService';

export default function ForgotPassword({ open, handleClose }) {
  // State management
  const [step, setStep] = useState('email'); // 'email', 'otp', 'password', 'success'
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Reset component state when dialog closes
  const resetComponent = () => {
    setStep('email');
    setEmail('');
    setOtp(['', '', '', '', '', '']);
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    setSuccess('');
    setIsLoading(false);
  };

  const handleDialogClose = () => {
    resetComponent();
    handleClose();
  };

  // Handle email submission
  const handleEmailSubmit = async (event) => {
    event.preventDefault();
    
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await otpService.forgotPassword(email);
      setSuccess('Password reset code sent to your email!');
      setStep('otp');
    } catch (error) {
      setError(error.message || 'Failed to send password reset code');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle OTP input changes
  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      const nextInput = document.getElementById(`forgot-otp-${index + 1}`);
      if (nextInput) nextInput.focus();
    }

    // Auto-proceed when OTP is complete
    if (newOtp.every(digit => digit !== '') && newOtp.join('').length === 6) {
      setStep('password');
    }
  };

  // Handle backspace in OTP inputs
  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const prevInput = document.getElementById(`forgot-otp-${index - 1}`);
      if (prevInput) prevInput.focus();
    }
  };

  // Handle password reset
  const handlePasswordReset = async (event) => {
    event.preventDefault();
    
    if (newPassword !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (newPassword.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }

    // Password strength validation
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasNumbers = /\d/.test(newPassword);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChars) {
      setError('Password must contain uppercase, lowercase, numbers, and special characters');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await otpService.resetPassword(email, otp.join(''), newPassword);
      setStep('success');
      setSuccess('Password reset successfully!');
    } catch (error) {
      setError(error.message || 'Failed to reset password');
    } finally {
      setIsLoading(false);
    }
  };

  // Resend OTP
  const handleResendOtp = async () => {
    setIsLoading(true);
    setError('');

    try {
      await otpService.forgotPassword(email);
      setSuccess('New password reset code sent!');
      setOtp(['', '', '', '', '', '']);
      // Focus first OTP input
      setTimeout(() => {
        document.getElementById('forgot-otp-0')?.focus();
      }, 100);
    } catch (error) {
      setError('Failed to resend code. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Get dialog title based on step
  const getDialogTitle = () => {
    switch (step) {
      case 'email': return 'Reset password';
      case 'otp': return 'Enter verification code';
      case 'password': return 'Set new password';
      case 'success': return 'Password reset successful';
      default: return 'Reset password';
    }
  };

  return (
    <Dialog
      open={open}
      className="DialogForgetPassword"
      onClose={handleDialogClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        component: 'form',
        onSubmit: step === 'email' ? handleEmailSubmit : 
                 step === 'password' ? handlePasswordReset : 
                 (e) => e.preventDefault(),
      }}
    >
      <DialogTitle className="DialogTitle">{getDialogTitle()}</DialogTitle>
      
      <DialogContent className="DialogContent">
        {/* Email Step */}
        {step === 'email' && (
          <>
            <DialogContentText className="DialogContentText">
              Enter your account's email address, and we'll send you a verification code to reset your password.
            </DialogContentText>
            <OutlinedInput
              autoFocus
              required
              margin="dense"
              id="email-input"
              name="email"
              placeholder="Email address"
              type="email"
              fullWidth
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="email-input"
              disabled={isLoading}
            />
          </>
        )}

        {/* OTP Step */}
        {step === 'otp' && (
          <>
            <DialogContentText className="DialogContentText">
              We've sent a 6-digit verification code to <strong>{email}</strong>
            </DialogContentText>
            <Box sx={{ 
              display: 'flex', 
              justifyContent: 'center', 
              gap: 1, 
              my: 2 
            }}>
              {otp.map((digit, index) => (
                <TextField
                  key={index}
                  id={`forgot-otp-${index}`}
                  value={digit}
                  onChange={(e) => handleOtpChange(index, e.target.value)}
                  onKeyDown={(e) => handleOtpKeyDown(index, e)}
                  inputProps={{
                    maxLength: 1,
                    style: { 
                      textAlign: 'center', 
                      fontSize: '18px',
                      fontWeight: 'bold'
                    }
                  }}
                  sx={{ width: 50 }}
                  disabled={isLoading}
                />
              ))}
            </Box>
            <Box sx={{ textAlign: 'center', mt: 1 }}>
              <Button
                variant="text"
                onClick={handleResendOtp}
                disabled={isLoading}
                size="small"
              >
                Resend Code
              </Button>
            </Box>
          </>
        )}

        {/* Password Step */}
        {step === 'password' && (
          <>
            <DialogContentText className="DialogContentText">
              Create a new strong password for your account.
            </DialogContentText>
            <TextField
              margin="dense"
              label="New Password"
              type="password"
              fullWidth
              variant="outlined"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              disabled={isLoading}
              sx={{ mb: 2 }}
              helperText="Password must be at least 8 characters with uppercase, lowercase, numbers, and special characters"
            />
            <TextField
              margin="dense"
              label="Confirm New Password"
              type="password"
              fullWidth
              variant="outlined"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={isLoading}
            />
          </>
        )}

        {/* Success Step */}
        {step === 'success' && (
          <>
            <Box sx={{ textAlign: 'center', py: 2 }}>
              <Box sx={{ fontSize: '48px', mb: 2 }}>✅</Box>
              <DialogContentText className="DialogContentText">
                Your password has been reset successfully! You can now log in with your new password.
              </DialogContentText>
            </Box>
          </>
        )}

        {/* Error Message */}
        {error && (
          <Alert severity="error" sx={{ mt: 2 }}>
            {error}
          </Alert>
        )}

        {/* Success Message */}
        {success && step !== 'success' && (
          <Alert severity="success" sx={{ mt: 2 }}>
            {success}
          </Alert>
        )}

        {/* Loading Indicator */}
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <CircularProgress size={24} />
          </Box>
        )}
      </DialogContent>

      <DialogActions className="DialogActions">
        {step === 'success' ? (
          <Button 
            onClick={handleDialogClose} 
            className="ContinueButton"
            variant="contained"
            fullWidth
          >
            Close
          </Button>
        ) : (
          <>
            <Button 
              onClick={handleDialogClose} 
              className="CancelButton"
              disabled={isLoading}
            >
              Cancel
            </Button>
            
            {step === 'email' && (
              <Button 
                variant="contained" 
                className="ContinueButton" 
                type="submit"
                disabled={isLoading || !email}
              >
                {isLoading ? 'Sending...' : 'Send Code'}
              </Button>
            )}
            
            {step === 'otp' && (
              <Button 
                variant="contained" 
                className="ContinueButton"
                onClick={() => setStep('password')}
                disabled={otp.some(digit => !digit)}
              >
                Continue
              </Button>
            )}
            
            {step === 'password' && (
              <Button 
                variant="contained" 
                className="ContinueButton" 
                type="submit"
                disabled={isLoading || !newPassword || !confirmPassword}
              >
                {isLoading ? 'Resetting...' : 'Reset Password'}
              </Button>
            )}
          </>
        )}
      </DialogActions>
    </Dialog>
  );
}
