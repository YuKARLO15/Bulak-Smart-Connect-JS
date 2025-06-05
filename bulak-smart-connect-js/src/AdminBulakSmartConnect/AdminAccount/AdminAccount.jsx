import React, { useState, useEffect } from 'react';
import { Box, Typography, Tabs, Tab, TextField, Button, IconButton, Paper, Container } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import MenuIcon from '@mui/icons-material/Menu';
import './AdminAccount.css';
import { useAuth } from '../../context/AuthContext';
import NavBar from '../../NavigationComponents/NavSide';

const AccountManagement = () => {
  const { currentUser } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  const [editMode, setEditMode] = useState({
    email: false,
    phone: false,
    username: false
  });
  const [profileData, setProfileData] = useState({
    firstName: 'Allan Dave',
    lastName: 'Marcosi',
    username: 'admin02',
    email: 'Marcosi@gmail.com',
    phone: '09126409684'
  });
  const [usernameChangeTimeRemaining, setUsernameChangeTimeRemaining] = useState(16);

  useEffect(() => {
    // In a real app, you would fetch the admin's profile data here
    // setProfileData(fetchedData);
  }, []);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEdit = (field) => {
    setEditMode(prev => ({ ...prev, [field]: true }));
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    // In a real app, you would save changes to backend here
    console.log('Saving profile changes:', profileData);
    setEditMode({
      email: false,
      phone: false,
      username: false
    });
    // Show success notification
    alert('Profile updated successfully!');
  };

  return (
    <Box className="admin-acc-container">
      {/* Add the NavBar component here */}
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
                <Typography className="admin-acc-field-label">First name</Typography>
                <TextField
                  fullWidth
                  name="firstName"
                  value={profileData.firstName}
                  onChange={handleChange}
                  variant="outlined"
                  className="admin-acc-profile-input"
                />
              </Box>

              <Box className="admin-acc-input-field">
                <Typography className="admin-acc-field-label">Last name</Typography>
                <TextField
                  fullWidth
                  name="lastName"
                  value={profileData.lastName}
                  onChange={handleChange}
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
                  onChange={handleChange}
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
                <Typography variant="caption" color="error" className="admin-acc-warning-text">
                  Username can only be changed once every 30 days. Time remaining: {usernameChangeTimeRemaining} days
                </Typography>
              </Box>

              <Box className="admin-acc-input-field">
                <Typography className="admin-acc-field-label">E-mail</Typography>
                <TextField
                  fullWidth
                  name="email"
                  value={profileData.email}
                  onChange={handleChange}
                  variant="outlined"
                  className="admin-acc-profile-input"
                  disabled={!editMode.email}
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
                  onChange={handleChange}
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
                onClick={handleSave}
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
                <Typography className="admin-acc-field-label">Current Password</Typography>
                <TextField
                  fullWidth
                  type="password"
                  name="currentPassword"
                  variant="outlined"
                  className="admin-acc-profile-input"
                />
              </Box>

              <Box className="admin-acc-input-field">
                <Typography className="admin-acc-field-label">New Password</Typography>
                <TextField
                  fullWidth
                  type="password"
                  name="newPassword"
                  variant="outlined"
                  className="admin-acc-profile-input"
                />
              </Box>

              <Box className="admin-acc-input-field">
                <Typography className="admin-acc-field-label">Confirm New Password</Typography>
                <TextField
                  fullWidth
                  type="password"
                  name="confirmPassword"
                  variant="outlined"
                  className="admin-acc-profile-input"
                />
              </Box>

              <Box className="admin-acc-actions-container">
                <Button 
                  variant="contained" 
                  color="primary" 
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