// src/components/ProfileUpload.jsx
import React, { useRef, useState } from 'react';
import { Box } from '@mui/material';
import '../AccountManagementComponents/ProfileUpload.css';

const UploadProfile = ({ onUpload }) => {
  const fileInputRef = useRef(null);
  const [imageSrc, setImageSrc] = useState('');

  const handleFileUpload = event => {
    const file = event.target.files[0];
    if (file) {
      if (file.type.startsWith('image/')) {
        const url = URL.createObjectURL(file);
        setImageSrc(url);
      } else {
        alert('Please upload a valid image file.');
      }
      onUpload(file);
    }
  };

  const openFileExplorer = () => {
    fileInputRef.current.click();
  };

  return (
    <Box onClick={openFileExplorer} className="profile-upload-container">
      {imageSrc ? (
        <img src={imageSrc} alt="Profile" className="profile-image" />
      ) : (
        <div className="upload-icon">+</div>
      )}
      <input
        type="file"
        accept=".jpg,.jpeg,.png"
        ref={fileInputRef}
        className="hidden-input"
        onChange={handleFileUpload}
        style={{ display: 'none' }} // Hide the input
      />
    </Box>
  );
};

export default UploadProfile;
