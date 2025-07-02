import React, { useRef, useState } from 'react';
import { Box, Typography } from '@mui/material';
import './FileUpload.css';

const FileUpload = ({ label, description, onUpload, multiple = false }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
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
    const files = Array.from(event.target.files);
    if (files.length === 0) return;

    try {
      setIsLoading(true);
      setError('');

      const processedFiles = [];
      const errors = [];

      for (const file of files) {
        // Check file size (limit to 5MB)
        if (file.size > 5 * 1024 * 1024) {
          errors.push(`${file.name}: File size should not exceed 5MB`);
          continue;
        }

        // Check file type (only allow images)
        const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
        if (!allowedTypes.includes(file.type)) {
          errors.push(`${file.name}: Only JPEG and PNG files are allowed`);
          continue;
        }

        try {
          // Convert file to base64
          const base64File = await convertToBase64(file);
          
          processedFiles.push({
            name: file.name,
            type: file.type,
            size: file.size,
            data: base64File
          });
        } catch (err) {
          errors.push(`${file.name}: Error processing file`);
        }
      }

      if (errors.length > 0) {
        setError(errors.join(', '));
      }

      // Update state with new files
      if (multiple) {
        const newFiles = [...uploadedFiles, ...processedFiles];
        setUploadedFiles(newFiles);
        onUpload(newFiles.length > 0, newFiles);
      } else {
        setUploadedFiles(processedFiles);
        onUpload(processedFiles.length > 0, processedFiles[0] || null);
      }
      
      setIsLoading(false);
      
    } catch (err) {
      console.error('Error uploading files:', err);
      setError('Error uploading files. Please try again.');
      setIsLoading(false);
    }

    event.target.value = '';
  };

  const handleRemoveFile = (indexToRemove) => {
    const updatedFiles = uploadedFiles.filter((_, index) => index !== indexToRemove);
    setUploadedFiles(updatedFiles);
    
    if (multiple) {
      onUpload(updatedFiles.length > 0, updatedFiles);
    } else {
      onUpload(false, null);
    }
  };

  const handleRemoveAllFiles = () => {
    setUploadedFiles([]);
    onUpload(false, multiple ? [] : null);
  };

  return (
    <Box className="file-upload-container">
      <Typography variant="subtitle2" className="file-label">
        {label} <span className="sample-text"></span>
      </Typography>
      
      {/* Add description below the title */}
      {description && (
        <Typography 
          variant="body2" 
          sx={{ 
            fontSize: '0.875rem', 
            fontStyle: 'italic', 
            marginBottom: '8px',
            marginTop: '4px',
            color: '#666',
            paddingLeft: '4px'
          }}
        >
          {description}
        </Typography>
      )}
      
      <Box className="file-upload-box" onClick={openFileExplorer}>
        {error && (
          <Typography variant="body2" className="error-message" style={{ color: 'red' }}>
            {error}
          </Typography>
        )}
        <Typography variant="body2" className="file-uploaddesc">
          {isLoading 
            ? 'Uploading...' 
            : uploadedFiles.length > 0 
              ? `${uploadedFiles.length} file(s) uploaded`
              : multiple 
                ? 'Click to select multiple files'
                : ' Click to upload'
          }
        </Typography>
        
        {/* Instructions for multiple file selection */}
        {multiple && uploadedFiles.length === 0 && (
          <Typography variant="caption" style={{ 
            color: '#666', 
            fontSize: '11px', 
            marginTop: '5px',
            display: 'block'
          }}>
            Hold Ctrl (Cmd on Mac) to select multiple files at once
          </Typography>
        )}
        
        {/* Display uploaded files */}
        {uploadedFiles.length > 0 && (
          <Box className="uploaded-files-list" style={{ marginTop: '10px' }}>
            {uploadedFiles.map((file, index) => (
              <Box key={index} className="uploaded-file" style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                padding: '5px',
                border: '1px solid #ddd',
                borderRadius: '4px',
                marginBottom: '5px'
              }}>
                <Typography variant="body2">{file.name}</Typography>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRemoveFile(index);
                  }}
                  style={{ 
                    background: 'none', 
                    border: 'none', 
                    cursor: 'pointer',
                    color: '#f44336'
                  }}
                >
                  ✕
                </button>
              </Box>
            ))}
            {multiple && uploadedFiles.length > 1 && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveAllFiles();
                }}
                style={{ 
                  marginTop: '5px',
                  padding: '5px 10px',
                  backgroundColor: '#f44336',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              >
                Remove All Files
              </button>
            )}
          </Box>
        )}
      </Box>
      <input
        type="file"
        accept=".jpg,.jpeg,.png"
        multiple={multiple}
        ref={fileInputRef}
        className="hidden-input"
        onChange={handleFileChange}
      />
    </Box>
  );
};

export default FileUpload;