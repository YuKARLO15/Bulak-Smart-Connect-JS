import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import axios from 'axios';
import './UserAccount.css';

const UserAccount = () => {
  const { user, getCurrentUserId } = useAuth();
  const userId = getCurrentUserId();

  // Form states
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');

  // Password states
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [confirmationPassword, setConfirmationPassword] = useState('');

  // UI states
  const [message, setMessage] = useState({ text: '', type: '' });
  const [isEditing, setIsEditing] = useState({
    email: false,
    phoneNumber: false,
    password: false,
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
        const response = await axios.get(`http://localhost:3000/auth/profile`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const userData = response.data;
        setFirstName(userData.firstName || '');
        setLastName(userData.lastName || '');
        setUsername(userData.username || '');
        setEmail(userData.email || '');
        setPhoneNumber(userData.phoneNumber || '');

        // Check username change timestamp from localStorage
        const usernameChangeDate = localStorage.getItem('lastUsernameChange');
        if (usernameChangeDate) {
          setLastUsernameChange(new Date(usernameChangeDate));
          checkUsernameChangeEligibility(new Date(usernameChangeDate));
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        setMessage({ text: 'Failed to load user data. Please try again.', type: 'error' });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [userId]);

  // Check if user can change username (30-day rule)
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

  // Prepare save profile changes
  const handleSaveProfile = async e => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    const updates = { firstName, lastName };

    // Check if sensitive fields are being edited
    const isSensitiveEdit =
      isEditing.email || isEditing.phoneNumber || (isEditing.username && canChangeUsername);

    // If sensitive fields are being edited, show password confirmation dialog
    if (isSensitiveEdit) {
      // Only include fields being edited
      if (isEditing.email) updates.email = email;
      if (isEditing.phoneNumber) updates.phoneNumber = phoneNumber;
      if (isEditing.username && canChangeUsername) updates.username = username;

      setPendingUpdates(updates);
      setShowPasswordConfirmation(true);
    } else {
      // If only non-sensitive fields (firstName, lastName) are being edited, proceed without confirmation
      await submitProfileUpdates(updates);
    }
  };

  // Submit profile updates after password confirmation (or directly for non-sensitive changes)
  const submitProfileUpdates = async updates => {
    try {
      const token = localStorage.getItem('token');

      // If username is being changed, update local storage
      if (updates.username && canChangeUsername) {
        localStorage.setItem('lastUsernameChange', new Date().toISOString());
        setLastUsernameChange(new Date());
        setCanChangeUsername(false);
      }

      // Use the correct endpoint from your API docs: /auth/update-profile
      await axios.post(`http://localhost:3000/auth/update-profile`, updates, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setMessage({ text: 'Profile updated successfully', type: 'success' });
      setIsEditing({
        email: false,
        phoneNumber: false,
        password: false,
        username: false,
      });

      // Reset confirmation dialog
      setShowPasswordConfirmation(false);
      setConfirmationPassword('');
      setPendingUpdates(null);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage({
        text: error.response?.data?.message || 'Failed to update profile',
        type: 'error',
      });
    }
  };

 const handlePasswordConfirmation = async e => {
  e.preventDefault();

  try {
    console.log('Attempting to verify password');

    const response = await axios.post(`http://localhost:3000/auth/login`, {
      email: email, // Use the email state variable
      emailOrUsername: email, // Use the email state variable here too
      username: username,
      password: confirmationPassword,
    });

    console.log('Verification response received');

    // If login would succeed, we consider the password correct
    if (response.data && response.data.access_token) {
      console.log('Password verification successful');
      // Password is correct, proceed with the update
      await submitProfileUpdates(pendingUpdates);
    } else {
      console.log('Password verification failed - unexpected response format');
      setMessage({ text: 'Incorrect password. Please try again.', type: 'error' });
    }
  } catch (error) {
    console.error('Error verifying password:', error);

    // Match error handling with your login component
    if (error.response) {
      console.log('Error status:', error.response.status);
      console.log('Error data:', error.response.data);
      setMessage({
        text: error.response.data.message || 'Incorrect password. Please try again.',
        type: 'error',
      });
    } else {
      setMessage({
        text: 'Failed to verify password. Please try again.',
        type: 'error',
      });
    }
  }
};
  // Change password
  const handleChangePassword = async e => {
    e.preventDefault();
    setMessage({ text: '', type: '' });

    if (newPassword !== confirmPassword) {
      setMessage({ text: 'New passwords do not match', type: 'error' });
      return;
    }

    // Check password complexity
    if (newPassword.length < 8) {
      setMessage({ text: 'New password must be at least 8 characters long', type: 'error' });
      return;
    }

    // Check for complexity requirements
    const hasUpperCase = /[A-Z]/.test(newPassword);
    const hasLowerCase = /[a-z]/.test(newPassword);
    const hasNumbers = /\d/.test(newPassword);

    if (!hasUpperCase || !hasLowerCase || !hasNumbers) {
      setMessage({
        text: 'Password must contain uppercase, lowercase, and numbers',
        type: 'error',
      });
      return;
    }

    try {
      const token = localStorage.getItem('token');
      // Include password in the update-profile endpoint
      await axios.post(
        `http://localhost:3000/auth/update-profile`,
        {
          password: newPassword,
          oldPassword: currentPassword, // Include current password for verification
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setMessage({ text: 'Password updated successfully', type: 'success' });
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setIsEditing({ ...isEditing, password: false });
    } catch (error) {
      console.error('Error changing password:', error);
      setMessage({
        text:
          error.response?.data?.message ||
          'Failed to change password. Please check your current password.',
        type: 'error',
      });
    }
  };

  // Cancel password confirmation dialog
  const cancelPasswordConfirmation = () => {
    setShowPasswordConfirmation(false);
    setConfirmationPassword('');
    setPendingUpdates(null);
  };

  // Calculate time remaining until username can be changed again
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
    <div className="AccountUAcc">
      <div className="AccountHeaderUAcc">
        <h1>User Account Settings</h1>
      </div>
      <div className="AccountContainerUAcc">
        {message.text && <div className={`MessageUAcc ${message.type}`}>{message.text}</div>}

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

        <form onSubmit={handleSaveProfile} className="AccountFormUAcc">
          <div className="FormGroupUAcc">
            <label htmlFor="firstName">First name</label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={e => setFirstName(e.target.value)}
            />
          </div>

          <div className="FormGroupUAcc">
            <label htmlFor="lastName">Last name</label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={e => setLastName(e.target.value)}
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
                  <i className="fas fa-pen"></i>
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
            <label htmlFor="email">E-mail</label>
            <div className="InputWithActionUAcc">
              <input
                type="email"
                id="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                disabled={!isEditing.email}
              />
              {!isEditing.email ? (
                <button
                  type="button"
                  onClick={() => setIsEditing({ ...isEditing, email: true })}
                  className="EditButtonUAcc"
                >
                  <i className="fas fa-pen"></i>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing({ ...isEditing, email: false })}
                  className="CancelButtonUAcc"
                >
                  <i className="fas fa-times"></i>
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
                  <i className="fas fa-pen"></i>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setIsEditing({ ...isEditing, phoneNumber: false })}
                  className="CancelButtonUAcc"
                >
                  <i className="fas fa-times"></i>
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

        <div className="PasswordSectionUAcc">
          <h2>Change Password</h2>
          <button
            type="button"
            onClick={() => setIsEditing({ ...isEditing, password: !isEditing.password })}
            className={isEditing.password ? 'CancelButtonUAcc' : 'ChangePasswordButtonUAcc'}
          >
            {isEditing.password ? 'Cancel' : 'Change Password'}
          </button>

          {isEditing.password && (
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
          )}
        </div>
      </div>
    </div>
  );
};

export default UserAccount;
