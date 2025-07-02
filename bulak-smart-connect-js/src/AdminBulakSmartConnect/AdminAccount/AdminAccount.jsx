import React, { useState, useEffect } from 'react';
import { Box, Typography, Tabs, Tab, TextField, Button, IconButton, Paper, Container, Alert, CircularProgress } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import MenuIcon from '@mui/icons-material/Menu';
import './AdminAccount.css';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import NavBar from '../../NavigationComponents/NavSide';
import OTPVerification from '../../components/OTPVerification';
import { otpService } from '../../services/otpService';
import axios from 'axios';
import config from '../../config/env.js';

const AccountManagement = () => {
  const { user: currentUser, logout } = useAuth();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ text: '', type: '' });
  const [editMode, setEditMode] = useState({
    email: false,
    phone: false,
    username: false
  });
  
  // OTP states
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [pendingPasswordChange, setPendingPasswordChange] = useState(null);
  const [otpPurpose, setOtpPurpose] = useState('password_reset');
  
  // Profile data state
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    username: '',
    email: '',
    phone: '',
    middleName: '',
    nameExtension: ''
  });
  
  // Password change state
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [lastUsernameChange, setLastUsernameChange] = useState(null);
  const [canChangeUsername, setCanChangeUsername] = useState(true);

  // Fetch admin profile data on component mount
  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        
        if (!token) {
          setMessage({ text: '❌ No authentication token found', type: 'error' });
          return;
        }

        const response = await axios.get(`${config.API_BASE_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const userData = response.data;
        setProfileData({
          firstName: userData.firstName || '',
          lastName: userData.lastName || '',
          username: userData.username || '',
          email: userData.email || '',
          phone: userData.contactNumber || '',
          middleName: userData.middleName || '',
          nameExtension: userData.nameExtension || ''
        });

        // Check username change eligibility
        const usernameChangeDate = localStorage.getItem('lastUsernameChange');
        if (usernameChangeDate) {
          setLastUsernameChange(new Date(usernameChangeDate));
          checkUsernameChangeEligibility(new Date(usernameChangeDate));
        }

      } catch (error) {
        console.error('Error fetching admin profile:', error);
        setMessage({ 
          text: error.response?.data?.message || '❌ Failed to load profile data', 
          type: 'error' 
        });
      } finally {
        setLoading(false);
      }
    };

    fetchAdminProfile();
  }, []);

  const checkUsernameChangeEligibility = (lastChangeDate) => {
    if (!lastChangeDate) {
      setCanChangeUsername(true);
      return;
    }

    const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
    const timeSinceLastChange = Date.now() - lastChangeDate.getTime();
    const canChange = timeSinceLastChange > thirtyDaysInMs;

    setCanChangeUsername(canChange);
  };

  const getTimeUntilUsernameChange = () => {
    if (!lastUsernameChange) return null;

    const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
    const eligibleDate = new Date(lastUsernameChange.getTime() + thirtyDaysInMs);
    const today = new Date();

    if (today >= eligibleDate) return null;

    const remaining = eligibleDate - today;
    const days = Math.floor(remaining / (24 * 60 * 60 * 1000));

    return `${days} days`;
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    setMessage({ text: '', type: '' }); // Clear messages when switching tabs
  };

  const handleEdit = (field) => {
    if (field === 'username' && !canChangeUsername) {
      setMessage({ 
        text: `❌ Username can only be changed once every 30 days. Time remaining: ${getTimeUntilUsernameChange()}`, 
        type: 'error' 
      });
      return;
    }
    setEditMode(prev => ({ ...prev, [field]: true }));
  };

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
    setMessage({ text: '', type: '' }); // Clear messages when typing
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
    setMessage({ text: '', type: '' }); // Clear messages when typing
  };

  const handleSaveProfile = async () => {
    try {
      setMessage({ text: '', type: '' });
      const token = localStorage.getItem('token');

      if (!token) {
        setMessage({ text: '❌ Authentication required', type: 'error' });
        return;
      }

      const updates = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        middleName: profileData.middleName,
        nameExtension: profileData.nameExtension
      };

      // Add email and phone if being edited
      if (editMode.email) {
        updates.email = profileData.email;
      }
      if (editMode.phone) {
        updates.contactNumber = profileData.phone;
      }
      if (editMode.username && canChangeUsername) {
        updates.username = profileData.username;
        localStorage.setItem('lastUsernameChange', new Date().toISOString());
        setLastUsernameChange(new Date());
        setCanChangeUsername(false);
      }

      await axios.post(`${config.API_BASE_URL}/auth/update-profile`, updates, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setMessage({ text: '✅ Profile updated successfully!', type: 'success' });
      setEditMode({
        email: false,
        phone: false,
        username: false
      });

    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({
        text: `❌ ${error.response?.data?.message || 'Failed to update profile'}`,
        type: 'error'
      });
    }
  };

  // ✅ ENHANCED: Verify current password before sending OTP
  const verifyCurrentPassword = async (currentPasswordToVerify) => {
    try {
      const response = await axios.post(`${config.API_BASE_URL}/auth/login`, {
        email: profileData.email,
        emailOrUsername: profileData.email,
        username: profileData.username,
        password: currentPasswordToVerify,
      });

      return response.data && response.data.access_token;
    } catch (error) {
      console.error('Current password verification failed:', error);
      return false;
    }
  };

  // Enhanced password change with OTP verification
  const handleChangePassword = async () => {
    try {
      setMessage({ text: '', type: '' });

      // Validation
      if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
        setMessage({ text: '❌ All password fields are required', type: 'error' });
        return;
      }

      if (passwordData.newPassword !== passwordData.confirmPassword) {
        setMessage({ text: '❌ New passwords do not match', type: 'error' });
        return;
      }

      if (passwordData.newPassword.length < 8) {
        setMessage({ text: '❌ New password must be at least 8 characters long', type: 'error' });
        return;
      }

      // ✅ NEW: Check if new password is same as current password
      if (passwordData.currentPassword === passwordData.newPassword) {
        setMessage({ 
          text: '❌ New password must be different from your current password', 
          type: 'error' 
        });
        return;
      }

      // Password complexity validation
      const hasUpperCase = /[A-Z]/.test(passwordData.newPassword);
      const hasLowerCase = /[a-z]/.test(passwordData.newPassword);
      const hasNumbers = /\d/.test(passwordData.newPassword);
      const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(passwordData.newPassword);

      if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChars) {
        setMessage({
          text: '❌ Password must contain uppercase, lowercase, numbers, and special characters',
          type: 'error'
        });
        return;
      }

      setMessage({ text: '⏳ Verifying current password...', type: 'success' });

      // ✅ NEW: Verify current password first
      const isCurrentPasswordValid = await verifyCurrentPassword(passwordData.currentPassword);
      
      if (!isCurrentPasswordValid) {
        setMessage({ 
          text: '❌ Current password is incorrect. Please check and try again.', 
          type: 'error' 
        });
        return;
      }

      setMessage({ text: '✅ Current password verified. Sending OTP...', type: 'success' });

      // Send OTP for password change verification
      await otpService.sendOTP(profileData.email, 'password_reset');
      
      // Store pending password change data
      setPendingPasswordChange({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      
      setShowOTPModal(true);
      setMessage({ text: '📧 OTP sent to your email for verification', type: 'success' });

    } catch (error) {
      console.error('Error in password change process:', error);
      setMessage({
        text: `❌ Failed to send verification code: ${error.message}`,
        type: 'error'
      });
    }
  };

  // Handle OTP verification success
  const handleOTPVerified = async () => {
    try {
      setShowOTPModal(false);
      setMessage({ text: '⏳ Updating password...', type: 'success' });

      const token = localStorage.getItem('token');
      await axios.post(`${config.API_BASE_URL}/auth/update-profile`, {
        password: pendingPasswordChange.newPassword,
        oldPassword: pendingPasswordChange.currentPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // Clear form
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
      setPendingPasswordChange(null);

      setMessage({ 
        text: '✅ Password updated successfully! You will be logged out in 3 seconds for security...', 
        type: 'success' 
      });

      // Auto logout and redirect after password change
      setTimeout(async () => {
        try {
          await logout();
          navigate('/LogIn', { 
            replace: true,
            state: { 
              message: '✅ Password changed successfully. Please log in with your new password.',
              type: 'success'
            }
          });
        } catch (error) {
          console.error('Logout error:', error);
          // Force logout even if API call fails
          localStorage.clear();
          navigate('/LogIn', { replace: true });
        }
      }, 3000);

    } catch (error) {
      console.error('Error changing password:', error);
      setMessage({
        text: `❌ ${error.response?.data?.message || 'Failed to change password. Please try again.'}`,
        type: 'error'
      });
      setPendingPasswordChange(null);
    }
  };

  // Handle OTP verification cancel
  const handleOTPCancel = () => {
    setShowOTPModal(false);
    setPendingPasswordChange(null);
    setMessage({ text: '❌ Password change cancelled', type: 'error' });
  };

  if (loading) {
    return (
      <Box className="admin-acc-container" sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <CircularProgress />
        <Typography sx={{ ml: 2 }}>Loading profile...</Typography>
      </Box>
    );
  }

  return (
    <Box className="admin-acc-container">
      <NavBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      
      {/* Header */}
      <Box className="admin-acc-header">
        <IconButton 
          className="admin-acc-menu-button" 
          onClick={() => setIsSidebarOpen(true)}
        >
          <MenuIcon />
        </IconButton>
        <Typography variant="h5" component="h1" className="admin-acc-header-title">
          Admin Account Settings
        </Typography>
      </Box>

      <Container>
        <Paper elevation={3} className="admin-acc-paper">
          {/* Message Display */}
          {message.text && (
            <Alert severity={message.type} sx={{ mb: 2 }}>
              {message.text}
            </Alert>
          )}

          {/* OTP Verification Modal */}
          {showOTPModal && (
            <OTPVerification
              email={profileData.email}
              purpose={otpPurpose}
              onVerified={handleOTPVerified}
              onCancel={handleOTPCancel}
              title="Verify Password Change"
            />
          )}

          {/* Tabs */}
          <Tabs 
            value={tabValue} 
            onChange={handleTabChange} 
            aria-label="account settings tabs"
            className="admin-acc-tabs"
          >
            <Tab label="Profile Information" className={tabValue === 0 ? "admin-acc-active-tab" : ""} />
            <Tab label="Change Password" className={tabValue === 1 ? "admin-acc-active-tab" : ""} />
          </Tabs>

          {/* Profile Information Tab */}
          <Box className="admin-acc-tab-content" hidden={tabValue !== 0}>
            <Box className="admin-acc-input-row">
              <Box className="admin-acc-input-field">
                <Typography className="admin-acc-field-label">First name*</Typography>
                <TextField
                  fullWidth
                  name="firstName"
                  value={profileData.firstName}
                  onChange={handleProfileChange}
                  variant="outlined"
                  className="admin-acc-profile-input"
                  required
                />
              </Box>

              <Box className="admin-acc-input-field">
                <Typography className="admin-acc-field-label">Last name*</Typography>
                <TextField
                  fullWidth
                  name="lastName"
                  value={profileData.lastName}
                  onChange={handleProfileChange}
                  variant="outlined"
                  className="admin-acc-profile-input"
                  required
                />
              </Box>
            </Box>

            <Box className="admin-acc-input-row">
              <Box className="admin-acc-input-field">
                <Typography className="admin-acc-field-label">Middle name</Typography>
                <TextField
                  fullWidth
                  name="middleName"
                  value={profileData.middleName}
                  onChange={handleProfileChange}
                  variant="outlined"
                  className="admin-acc-profile-input"
                />
              </Box>

              <Box className="admin-acc-input-field">
                <Typography className="admin-acc-field-label">Name extension</Typography>
                <TextField
                  fullWidth
                  name="nameExtension"
                  value={profileData.nameExtension}
                  onChange={handleProfileChange}
                  variant="outlined"
                  className="admin-acc-profile-input"
                />
              </Box>
            </Box>

            <Box className="admin-acc-input-row">
              <Box className="admin-acc-input-field">
                <Typography className="admin-acc-field-label">Username</Typography>
                <TextField
                  fullWidth
                  name="username"
                  value={profileData.username}
                  onChange={handleProfileChange}
                  variant="outlined"
                  className="admin-acc-profile-input"
                  disabled={!editMode.username}
                  InputProps={{
                    endAdornment: (
                      <IconButton onClick={() => handleEdit('username')}>
                        <EditIcon />
                      </IconButton>
                    )
                  }}
                />
                {!canChangeUsername && (
                  <Typography variant="caption" color="error" className="admin-acc-warning-text">
                    Username can only be changed once every 30 days. Time remaining: {getTimeUntilUsernameChange()}
                  </Typography>
                )}
              </Box>

              <Box className="admin-acc-input-field">
                <Typography className="admin-acc-field-label">E-mail*</Typography>
                <TextField
                  fullWidth
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  variant="outlined"
                  className="admin-acc-profile-input"
                  disabled={!editMode.email}
                  required
                  InputProps={{
                    endAdornment: (
                      <IconButton onClick={() => handleEdit('email')}>
                        <EditIcon />
                      </IconButton>
                    )
                  }}
                />
              </Box>
            </Box>

            <Box className="admin-acc-input-row">
              <Box className="admin-acc-input-field">
                <Typography className="admin-acc-field-label">Phone number</Typography>
                <TextField
                  fullWidth
                  name="phone"
                  value={profileData.phone}
                  onChange={handleProfileChange}
                  variant="outlined"
                  className="admin-acc-profile-input"
                  disabled={!editMode.phone}
                  InputProps={{
                    endAdornment: (
                      <IconButton onClick={() => handleEdit('phone')}>
                        <EditIcon />
                      </IconButton>
                    )
                  }}
                />
              </Box>
            </Box>

            <Box className="admin-acc-actions-container">
              <Button 
                variant="contained" 
                color="primary" 
                onClick={handleSaveProfile}
                className="admin-acc-save-button"
              >
                Save Changes
              </Button>
            </Box>
          </Box>

          {/* Change Password Tab */}
          {tabValue === 1 && (
            <Box className="admin-acc-tab-content">
              <Box className="admin-acc-input-field">
                <Typography className="admin-acc-field-label">Current Password*</Typography>
                <TextField
                  fullWidth
                  type="password"
                  name="currentPassword"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                  variant="outlined"
                  className="admin-acc-profile-input"
                  required
                />
              </Box>

              <Box className="admin-acc-input-field">
                <Typography className="admin-acc-field-label">New Password*</Typography>
                <TextField
                  fullWidth
                  type="password"
                  name="newPassword"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                  variant="outlined"
                  className="admin-acc-profile-input"
                  required
                />
                <Typography variant="caption" color="textSecondary">
                  Password must be at least 8 characters and include uppercase, lowercase, numbers, and special characters.
                </Typography>
              </Box>

              <Box className="admin-acc-input-field">
                <Typography className="admin-acc-field-label">Confirm New Password*</Typography>
                <TextField
                  fullWidth
                  type="password"
                  name="confirmPassword"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                  variant="outlined"
                  className="admin-acc-profile-input"
                  required
                />
              </Box>

              <Box className="admin-acc-actions-container">
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleChangePassword}
                  className="admin-acc-save-button"
                >
                  Update Password
                </Button>
              </Box>
            </Box>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default AccountManagement;
