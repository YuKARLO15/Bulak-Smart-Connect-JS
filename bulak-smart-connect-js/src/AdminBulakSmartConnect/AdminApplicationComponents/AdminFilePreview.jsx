import React from "react";
import { Box, Typography, Paper, List, ListItem, Button, Divider } from "@mui/material";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import ImageIcon from "@mui/icons-material/Image";
import VisibilityIcon from "@mui/icons-material/Visibility";
import "./AdminFIlePreview.css";

const FileUploadPreview = ({ formData, applicationType }) => {

  const getRequiredDocuments = () => {
    switch (applicationType) {
      case "Regular application":
        return [
          "Valid ID",
          "Authorization Letter (if applicable)"
        ];
      case "Request copy":
        return [
          "Valid ID",
          "Authorization Letter (if applicable)"
        
        ];
      case "Above 18":
        return [
          "Negative certification from PSA",
          "Two (2) documentary evidences",
          "Affidavit of two (2) disinterested persons with ID",
          "Certificate of marriage (If married)",
          "National ID or ePhil ID",
          "Barangay certification of residency",
          "Unedited front-facing photo (2x2, white background)",
          "Documentary evidences of parents",
          "Certificate of marriage of parents",
          "Affidavit of whereabouts of the mother (if mother cannot personally appear)"
        ];
      case "Below 18":
        return [
          "Negative Certification from PSA",
          "Two (2) Documentary Evidences",
          "Affidavit of Two (2) Disinterested Persons",
          "Unedited Front-Facing Photo",
          "Documentary Evidence/s of Parents",
          "Barangay Certification of Residency",
          "National ID or ePhil ID"
        ];
      case "Foreign Parent":
        return [
          "Negative Certification from PSA",
          "Affidavit of two (2) disinterested persons",
          "Barangay Certification",
          "National ID",
          "Unedited 2x2 front-facing photo",
          "Parent Document 1",
          "Parent Document 2",
          "Documentary Evidence 1",
          "Documentary Evidence 2",
          "Valid Passport or ACR I-CARD of the Foreign Parent"
        ];
      case "Out of town":
        return [
          "Negative Certification from PSA",
          "Affidavit of Two (2) Disinterested Persons",
          "Barangay Certification",
          "National ID",
          "Parent Document 1",
          "Parent Document 2",
          "Documentary Evidence 1",
          "Documentary Evidence 2"
        ];
      case "Clerical Error":
        return [
          "Original Birth Certificate with error",
          "Valid ID",
          "Annotated Birth Certificate",
          "Affidavit of Correction",
          "Publication Certificate"
        ];
      case "Sex DOB":
        return [
          "Original Birth Certificate",
          "Valid ID",
          "Medical Certification",
          "Affidavit of Support",
          "Two Documentary Evidences",
          "Publication Certificate"
        ];
      case "First Name":
        return [
          "Original Birth Certificate",
          "Valid ID",
          "Baptismal Certificate",
          "School Records",
          "Publication Certificate",
          "Affidavit of Correction"
        ];
      default:
        return [];
    }
  };

  
  const getFileIcon = (fileName) => {
    if (!fileName) return <InsertDriveFileIcon />;
    
    const ext = fileName.split('.').pop().toLowerCase();
    if (['pdf'].includes(ext)) {
      return <PictureAsPdfIcon style={{ color: "#F40F02" }} />;
    } else if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(ext)) {
      return <ImageIcon style={{ color: "#00C853" }} />;
    }
    
    return <InsertDriveFileIcon style={{ color: "#1565C0" }} />;
  };


  const getFileData = (docName) => {

    const uploaded = formData?.uploadedFiles && formData.uploadedFiles[docName] || Math.random() > 0.3;
    const fileName = uploaded ? `${docName.replace(/\s+/g, '_')}.${Math.random() > 0.5 ? 'pdf' : 'jpg'}` : null;
    
    return {
      uploaded: !!uploaded,
      fileName: fileName
    };
  };


  const getDocumentNote = (docName) => {
    if (docName.includes("Unedited front-facing photo")) {
      return "(2x2, white background)";
    }
    if (docName.includes("Certificate of marriage") && docName.includes("If married")) {
      return "(If married)";
    }
    if (docName.includes("Affidavit of whereabouts")) {
      return "(if mother cannot personally appear)";
    }
    return "";
  };

  const requiredDocuments = getRequiredDocuments();

  const handleViewDocument = (fileName) => {
   
    alert(`Viewing document: ${fileName}`);
  };

  return (
    <Box className="documentRequirementsContainer">
      <Typography variant="h5" className="documentRequirementsTitle">
        Document Requirements
      </Typography>
      
      <List className="documentList">
        {requiredDocuments.map((doc, index) => {
          const fileData = getFileData(doc);
          const docNumber = index + 1;
          const docNote = getDocumentNote(doc);
          
          return (
            <React.Fragment key={index}>
              <ListItem className="documentListItem">
                <Box className="documentItemContent">
                  <Box className="documentHeader">
                    <Typography className="documentNumberTitle">
                      {docNumber}. {doc}
                    </Typography>
          
                  </Box>
                  
                  {docNote && (
                    <Typography className="documentNote">
                      {docNote}
                    </Typography>
                  )}
                  
                  <Box className="uploadedPreviewBox">
                    {fileData.uploaded ? (
                      <Button 
                        variant="text" 
                        className="uploadedPreviewButton"
                        onClick={() => handleViewDocument(fileData.fileName)}
                        startIcon={<VisibilityIcon fontSize="small" />}
                      >
                        uploaded preview
                      </Button>
                    ) : (
                      <Typography className="notUploadedText">
                        No document uploaded
                      </Typography>
                    )}
                  </Box>
                </Box>
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          );
        })}
      </List>
    </Box>
  );
};

export default FileUploadPreview;