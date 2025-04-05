// src/components/ProfileUpload.js
import React, { useRef, useState } from "react";
import { Box } from "@mui/material";
import "./ProfileUpload.css"; 

const ProfileUpload = ({ onUpload }) => {
  const fileInputRef = useRef(null);
  const [imageSrc, setImageSrc] = useState(""); 

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const url = URL.createObjectURL(file); 
      setImageSrc(url); 
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
        style={{ display: "none" }} // Hide the input
      />
    </Box>
  );
};

export default ProfileUpload;