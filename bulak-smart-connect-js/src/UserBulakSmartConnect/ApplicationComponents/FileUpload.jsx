import React, { useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';
import './FileUpload.css';

const FileUpload = ({ label, onUpload }) => {
  const [isUploaded, setIsUploaded] = useState(false);
  const [fileName, setFileName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const fileInputRef = useRef(null);

  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const openFileExplorer = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setIsLoading(true);
      setError('');

      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('File size should not exceed 5MB');
        setIsLoading(false);
        return;
      }

      // Check file type (only allow images)
      const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', "pdf"];
      if (!allowedTypes.includes(file.type)) {
        setError('Only JPEG, PNG or pdf files are allowed');
        setIsLoading(false);
        return;
      }

      // Convert file to base64
      const base64File = await convertToBase64(file);
      
      // Update state
      setIsUploaded(true);
      setFileName(file.name);
      setIsLoading(false);
      
      // Pass the file data and upload status to parent component
      onUpload(true, {
        name: file.name,
        type: file.type,
        size: file.size,
        data: base64File
      });
      
    } catch (err) {
      console.error('Error uploading file:', err);
      setError('Error uploading file. Please try again.');
      setIsLoading(false);
    }
  };

  const handleRemoveFile = () => {
    setIsUploaded(false);
    setFileName('');
    // Notify parent that file was removed
    onUpload(false, null);
  };

  return (
    <Box className="file-upload-container">
      <Typography variant="subtitle2" className="file-label">
        {label} <span className="sample-text">Sample</span>
      </Typography>
      <Box className="file-upload-box" onClick={openFileExplorer}>
        {error && (
          <Typography variant="body2" className="error-message" style={{ color: 'red' }}>
            {error}
          </Typography>
        )}
        <Typography variant="body2" className="file-uploaddesc">
          {isLoading ? 'Uploading...' : fileName ? fileName : 'Drop a file, or Click to upload'}
        </Typography>
      </Box>
      <input
        type="file"
        accept=".jpg,.jpeg,.png"
        ref={fileInputRef}
        className="hidden-input"
        onChange={handleFileChange}
      />
    </Box>
  );
};

export default FileUpload;