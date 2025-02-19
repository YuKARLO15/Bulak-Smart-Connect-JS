import React, { useRef, useState } from "react";
import { Box, Button, Typography } from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import "./CorrectionClericalError.css";

const FileUpload = ({ label }) => {
  const fileInputRef = useRef(null);
  const [fileName, setFileName] = useState("");

  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const openFileExplorer = () => {
    fileInputRef.current.click();
  };

  return (
    <Box className="file-upload-container">
      <Typography variant="subtitle2" className="file-label">
        {label} <span className="sample-text">Sample</span>
      </Typography>
      <Box className="file-upload-box" onClick={openFileExplorer}>
        <CloudUploadIcon className="upload-icon" />
        <Typography variant="body2" className="file-uploaddesc">
          {fileName ? fileName : "Drop a file, or Click to upload"}
        </Typography>
      </Box>
      <input
        type="file"
        accept=".jpg,.jpeg,.png"
        ref={fileInputRef}
        className="hidden-input"
        onChange={handleFileUpload}
      />
    </Box>
  );
};

export default FileUpload;
