import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import config from '../../config/env.js';
import './UserAccount.css';
import NavBar from '../../NavigationComponents/NavSide';
import EditIcon from '@mui/icons-material/Edit';
import CloseIcon from '@mui/icons-material/Close';
import OTPVerification from '../../components/OTPVerification';
import { otpService } from '../../services/otpService';

const UserAccount = () => {
  const { user, getCurrentUserId, logout } = useAuth();
  const navigate = useNavigate();
  const userId = getCurrentUserId();

  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  // Password states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmationPassword, setConfirmationPassword] = useState('');

  // OTP states
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [pendingPasswordChange, setPendingPasswordChange] = useState(null);
  const [otpPurpose, setOtpPurpose] = useState('password_reset');

  // Tab state
  const [activeTab, setActiveTab] = useState('profile');

  // UI states
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isEditing, setIsEditing] = useState({
    email: false,
    phoneNumber: false,
    username: false,
  });
  const [lastUsernameChange, setLastUsernameChange] = useState(null);
  const [canChangeUsername, setCanChangeUsername] = useState(true);
  const [loading, setLoading] = useState(true);
  const [showPasswordConfirmation, setShowPasswordConfirmation] = useState(false);
  const [pendingUpdates, setPendingUpdates] = useState(null);

  // Fetch user data on component mount
  useEffect(() => {
    const fetchUserData = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const token = localStorage.getItem('token');
        if (!token) {
          setMessage({ text: '❌ No authentication token found', type: 'error' });
          setLoading(false);
          return;
        }

        const response = await axios.get(`${config.API_BASE_URL}/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = response.data;
        setFirstName(userData.firstName || '');
        setLastName(userData.lastName || '');
        setUsername(userData.username || '');
        setEmail(userData.email || '');
        setPhoneNumber(userData.contactNumber || '');

        const usernameChangeDate = localStorage.getItem('lastUsernameChange');
        if (usernameChangeDate) {
          setLastUsernameChange(new Date(usernameChangeDate));
          checkUsernameChangeEligibility(new Date(usernameChangeDate));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setMessage({ text: '❌ Failed to load user data. Please try again.', type: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  const checkUsernameChangeEligibility = lastChangeDate => {
    if (!lastChangeDate) {
      setCanChangeUsername(true);
      return;
    }

    const thirtyDaysInMs = 30 * 24 * 60 * 60 * 1000;
    const timeSinceLastChange = Date.now() - lastChangeDate.getTime();
    const canChange = timeSinceLastChange > thirtyDaysInMs;

    setCanChangeUsername(canChange);
  };

  const handleSaveProfile = async e => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    const updates = { firstName, lastName };

    const isSensitiveEdit =
      isEditing.email || isEditing.phoneNumber || (isEditing.username && canChangeUsername);

    if (isSensitiveEdit) {
      if (isEditing.email) updates.email = email;
      if (isEditing.phoneNumber) updates.contactNumber = phoneNumber; 

      setPendingUpdates(updates);
      setShowPasswordConfirmation(true);
    } else {
      await submitProfileUpdates(updates);
    }
  };

  const submitProfileUpdates = async updates => {
    try {
      const token = localStorage.getItem('token');

      if (updates.username && canChangeUsername) {
        localStorage.setItem('lastUsernameChange', new Date().toISOString());
        setLastUsernameChange(new Date());
        setCanChangeUsername(false);
      }

      await axios.post(`${config.API_BASE_URL}/auth/update-profile`, updates, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage({ text: '✅ Profile updated successfully!', type: 'success' });
      setIsEditing({
        email: false,
        phoneNumber: false,
        password: false,
        username: false,
      });

      setShowPasswordConfirmation(false);
      setConfirmationPassword('');
      setPendingUpdates(null);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({
        text: `❌ ${error.response?.data?.message || 'Failed to update profile'}`,
        type: 'error',
      });
    }
  };

  const handlePasswordConfirmation = async e => {
    e.preventDefault();

    try {
      console.log('Attempting to verify password');

      const response = await axios.post(`${config.API_BASE_URL}/auth/login`, {
        email: email,
        emailOrUsername: email,
        username: username,
        password: confirmationPassword,
      });

      console.log('Verification response received');

      if (response.data && response.data.access_token) {
        console.log('Password verification successful');
        await submitProfileUpdates(pendingUpdates);
      } else {
        console.log('Password verification failed - unexpected response format');
        setMessage({ text: '❌ Incorrect password. Please try again.', type: 'error' });
      }
    } catch (error) {
      console.error('Error verifying password:', error);

      if (error.response) {
        console.log('Error status:', error.response.status);
        console.log('Error data:', error.response.data);
        setMessage({
          text: `❌ ${error.response.data.message || 'Incorrect password. Please try again.'}`,
          type: 'error',
        });
      } else {
        setMessage({
          text: '❌ Failed to verify password. Please try again.',
          type: 'error',
        });
      }
    }
  };

  // ✅ ENHANCED: Verify current password before sending OTP
  const verifyCurrentPassword = async (currentPasswordToVerify) => {
    try {
      const response = await axios.post(`${config.API_BASE_URL}/auth/login`, {
        email: email,
        emailOrUsername: email,
        username: username,
        password: currentPasswordToVerify,
      });

      return response.data && response.data.access_token;
    } catch (error) {
      console.error('Current password verification failed:', error);
      return false;
    }
  };

  // Enhanced password change with proper validation and OTP verification
  const handleChangePassword = async e => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    // Input validation
    if (!currentPassword.trim()) {
      setMessage({ text: '❌ Current password is required', type: 'error' });
      return;
    }

    if (!newPassword.trim()) {
      setMessage({ text: '❌ New password is required', type: 'error' });
      return;
    }

    if (!confirmPassword.trim()) {
      setMessage({ text: '❌ Password confirmation is required', type: 'error' });
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage({ text: '❌ New passwords do not match', type: 'error' });
      return;
    }

    if (newPassword.length < 8) {
      setMessage({ text: '❌ New password must be at least 8 characters long', type: 'error' });
      return;
    }

    // ✅ NEW: Check if new password is same as current password
    if (currentPassword === newPassword) {
      setMessage({ 
        text: '❌ New password must be different from your current password', 
        type: 'error' 
      });
      return;
    }

    // Password strength validation
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasNumbers = /\d/.test(newPassword);
    const hasSpecialChars = /[!@#$%^&*(),.?":{}|<>]/.test(newPassword);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChars) {
      setMessage({
        text: '❌ Password must contain uppercase, lowercase, numbers, and special characters',
        type: 'error',
      });
      return;
    }

    try {
      setMessage({ text: '⏳ Verifying current password...', type: 'success' });

      // ✅ NEW: Verify current password first
      const isCurrentPasswordValid = await verifyCurrentPassword(currentPassword);
      
      if (!isCurrentPasswordValid) {
        setMessage({ 
          text: '❌ Current password is incorrect. Please check and try again.', 
          type: 'error' 
        });
        return;
      }

      setMessage({ text: '✅ Current password verified. Sending OTP...', type: 'success' });

      // Send OTP for password change verification
      await otpService.sendOTP(email, 'password_reset');
      
      // Store pending password change data
      setPendingPasswordChange({
        currentPassword,
        newPassword
      });
      
      setShowOTPModal(true);
      setMessage({ text: '📧 OTP sent to your email for verification', type: 'success' });
    } catch (error) {
      console.error('Error in password change process:', error);
      setMessage({
        text: `❌ Failed to send verification code: ${error.message}`,
        type: 'error',
      });
    }
  };

  // Handle OTP verification success
  const handleOTPVerified = async () => {
    try {
      setShowOTPModal(false);
      setMessage({ text: '⏳ Updating password...', type: 'success' });

      const token = localStorage.getItem('token');
      await axios.post(
        `${config.API_BASE_URL}/auth/update-profile`,
        {
          password: pendingPasswordChange.newPassword,
          oldPassword: pendingPasswordChange.currentPassword, 
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Clear form
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
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
        type: 'error',
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

  const cancelPasswordConfirmation = () => {
    setShowPasswordConfirmation(false);
    setConfirmationPassword('');
    setPendingUpdates(null);
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

  if (loading) {
    return <div className="AccountLoaderUAcc">Loading...</div>;
  }

  return (
    <div className={`AccountUAcc ${isSidebarOpen ? 'sidebar-open' : ''}`}>
      <NavBar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
      <div className="AccountHeaderUAcc">
        <h1 className="AccountHeaderUAcc"> User Account Settings</h1>
      </div>
      
      <div className="AccountContainerUAcc">
        {message.text && <div className={`MessageUAcc ${message.type}`}>{message.text}</div>}

        {/* Tab Navigation */}
        <div className="AccountTabsUAcc">
          <button 
            className={`TabButtonUAcc ${activeTab === 'profile' ? 'active' : ''}`}
            onClick={() => setActiveTab('profile')}
          >
            Profile Information
          </button>
          <button 
            className={`TabButtonUAcc ${activeTab === 'password' ? 'active' : ''}`}
            onClick={() => setActiveTab('password')}
          >
            Change Password
          </button>
        </div>

        {/* OTP Verification Modal */}
        {showOTPModal && (
          <OTPVerification
            email={email}
            purpose={otpPurpose}
            onVerified={handleOTPVerified}
            onCancel={handleOTPCancel}
            title="Verify Password Change"
          />
        )}

        {/* Password Confirmation Dialog */}
        {showPasswordConfirmation && (
          <div className="PasswordConfirmationOverlayUAcc">
            <div className="PasswordConfirmationDialogUAcc">
              <h3>Confirm Changes</h3>
              <p>Please enter your password to confirm these changes to your account.</p>
              <form className="DialogFormGroupUAcc" onSubmit={handlePasswordConfirmation}>
                <div className="DialogFormGroupUAcc">
                  <label className="DialogLabel" htmlFor="confirmationPassword">
                    Password*
                  </label>
                  <input
                    type="password"
                    id="confirmationPassword"
                    value={confirmationPassword}
                    onChange={e => setConfirmationPassword(e.target.value)}
                    autoFocus
                    required
                  />
                </div>
                <div className="DialogActionsUAcc">
                  <button
                    type="button"
                    className="CancelButtonUAcc"
                    onClick={cancelPasswordConfirmation}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="SaveButtonUAcc">
                    Confirm
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Profile Tab Content */}
        {activeTab === 'profile' && (
          <div className="TabContentUAcc">
            <form onSubmit={handleSaveProfile} className="AccountFormUAcc">
              <div className="FormGroupUAcc">
                <label htmlFor="firstName">First name*</label>
                <input
                  type="text"
                  id="firstName"
                  value={firstName}
                  onChange={e => setFirstName(e.target.value)}
                  required
                />
              </div>

              <div className="FormGroupUAcc">
                <label htmlFor="lastName">Last name*</label>
                <input
                  type="text"
                  id="lastName"
                  value={lastName}
                  onChange={e => setLastName(e.target.value)}
                  required
                />
              </div>

              <div className="FormGroupUAcc">
                <label htmlFor="username">Username</label>
                <div className="InputWithActionUAcc">
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    disabled={!canChangeUsername || !isEditing.username}
                  />
                  {!isEditing.username ? (
                    <button
                      type="button"
                      onClick={() => setIsEditing({ ...isEditing, username: true })}
                      className="EditButtonUAcc"
                      disabled={!canChangeUsername}
                    >
                       <EditIcon fontSize="small" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsEditing({ ...isEditing, username: false })}
                      className="CancelButtonUAcc"
                    >
                      <i className="fas fa-times"></i>
                    </button>
                  )}
                </div>
                {!canChangeUsername && (
                  <p className="RestrictionNoteUAcc">
                    Username can only be changed once every 30 days.
                    {getTimeUntilUsernameChange() && ` Time remaining: ${getTimeUntilUsernameChange()}`}
                  </p>
                )}
              </div>

              <div className="FormGroupUAcc">
                <label htmlFor="email">E-mail*</label>
                <div className="InputWithActionUAcc">
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    disabled={!isEditing.email}
                    required
                  />
                  {!isEditing.email ? (
                    <button
                      type="button"
                      onClick={() => setIsEditing({ ...isEditing, email: true })}
                      className="EditButtonUAcc"
                    >
                       <EditIcon fontSize="small" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsEditing({ ...isEditing, email: false })}
                      className="CancelButtonUAcc"
                    >
                      <CloseIcon fontSize="small" />
                    </button>
                  )}
                </div>
              </div>

              <div className="FormGroupUAcc">
                <label htmlFor="phoneNumber">Phone number</label>
                <div className="InputWithActionUAcc">
                  <input
                    type="tel"
                    id="phoneNumber"
                    value={phoneNumber}
                    onChange={e => setPhoneNumber(e.target.value)}
                    disabled={!isEditing.phoneNumber}
                  />
                  {!isEditing.phoneNumber ? (
                    <button
                      type="button"
                      onClick={() => setIsEditing({ ...isEditing, phoneNumber: true })}
                      className="EditButtonUAcc"
                    >
                       <EditIcon fontSize="small" />
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setIsEditing({ ...isEditing, phoneNumber: false })}
                      className="CancelButtonUAcc"
                    >
                    <CloseIcon fontSize="small" />
                    </button>
                  )}
                </div>
              </div>

              <div className="ActionsUAcc">
                <button type="submit" className="SaveButtonUAcc">
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Password Tab Content */}
        {activeTab === 'password' && (
          <div className="TabContentUAcc">
            <div className="PasswordTabCardUAcc">
              <form onSubmit={handleChangePassword} className="PasswordFormUAcc">
                <div className="FormGroupUAcc">
                  <label htmlFor="currentPassword">Current Password*</label>
                  <input
                    type="password"
                    id="currentPassword"
                    value={currentPassword}
                    onChange={e => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="FormGroupUAcc">
                  <label htmlFor="newPassword">New Password*</label>
                  <input
                    type="password"
                    id="newPassword"
                    value={newPassword}
                    onChange={e => setNewPassword(e.target.value)}
                    required
                  />
                  <p className="PasswordRequirementsUAcc">
                    Password must be at least 8 characters long and include uppercase, lowercase, numbers, and special characters.
                  </p>
                </div>

                <div className="FormGroupUAcc">
                  <label htmlFor="confirmPassword">Confirm New Password*</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="ActionsUAcc">
                  <button type="submit" className="SaveButtonUAcc">
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserAccount;
