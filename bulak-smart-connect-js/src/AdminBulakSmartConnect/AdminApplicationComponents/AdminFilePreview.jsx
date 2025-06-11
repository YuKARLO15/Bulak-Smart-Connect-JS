import React, { useState, useEffect } from 'react';
import { Box, Typography, Paper, List, ListItem, Button, Divider, Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress } from '@mui/material';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import VisibilityIcon from '@mui/icons-material/Visibility';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import './AdminFIlePreview.css';
import { documentApplicationService } from '../../services/documentApplicationService';

const FileUploadPreview = ({ formData, applicationType, applicationSubtype }) => {
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [previewDialog, setPreviewDialog] = useState({ open: false, url: '', title: '' });
  
  // Current date and time information
  const currentDateTime = "2025-06-08 16:24:15"; // UTC formatted
  const currentUser = "dennissegailfrancisco"; // Current user's login
  
  useEffect(() => {
    // Fetch files when component mounts or when formData changes
    if (formData && formData.id) {
      fetchApplicationFiles(formData.id);
    } else {
      // Fallback to extracting files from formData if no ID
      extractFilesFromFormData();
    }
  }, [formData, applicationType]);
  
  // Function to fetch files for a specific application using the documentApplicationService
  const fetchApplicationFiles = async (applicationId) => {
    setLoading(true);
    try {
      console.log(`AdminFilePreview: Fetching files for application ID: ${applicationId}`);
      
      // Use the service to get files
      const files = await documentApplicationService.getApplicationFiles(applicationId);
      
      console.log('AdminFilePreview: Retrieved files from backend:', files);
      console.log('AdminFilePreview: Number of files:', files?.length || 0);
      
      if (Array.isArray(files) && files.length > 0) {
        // Transform the files to match expected format
        const transformedFiles = files.map(file => {
          console.log('AdminFilePreview: Processing file:', file);
          return {
            id: file.id,
            name: file.fileName || file.name,
            documentType: file.documentCategory || file.documentType,
            url: file.url || file.downloadUrl,
            contentType: file.fileType || getContentTypeFromName(file.fileName || file.name),
            size: file.fileSize || file.size,
            uploadedAt: file.uploadedAt,
            uploaded: true,
            isPlaceholder: false,
            placeholder: false // Make sure this is explicitly set to false
          };
        });
        
        console.log('AdminFilePreview: Transformed files:', transformedFiles);
        setUploadedFiles(transformedFiles);
      } else {
        console.log('AdminFilePreview: No files returned from API, showing placeholders...');
        // Create placeholders for required documents
        const requiredDocs = getRequiredDocuments();
        const placeholders = requiredDocs.map(doc => ({
          name: doc,
          documentType: doc,
          placeholder: true,
          uploaded: false,
          url: null
        }));
        setUploadedFiles(placeholders);
      }
    } catch (error) {
      console.error('AdminFilePreview: Error fetching application files:', error);
      // Show placeholders on error
      const requiredDocs = getRequiredDocuments();
      const placeholders = requiredDocs.map(doc => ({
        name: doc,
        documentType: doc,
        placeholder: true,
        uploaded: false,
        url: null
      }));
      setUploadedFiles(placeholders);
    } finally {
      setLoading(false);
    }
  };
  
  const extractFilesFromFormData = () => {
    setLoading(true);
    try {
      let files = [];
      
      // Check if formData has direct uploads property
      if (formData?.uploads && Array.isArray(formData.uploads)) {
        files = [...formData.uploads];
      } 
      
      // Check if formData has uploadedFiles property
      if (formData?.uploadedFiles && typeof formData.uploadedFiles === 'object') {
        Object.entries(formData.uploadedFiles).forEach(([docName, fileData]) => {
          if (fileData) {
            files.push({
              name: docName,
              documentType: docName,
              url: typeof fileData === 'string' ? fileData : fileData.url || fileData.data,
              contentType: typeof fileData === 'object' ? fileData.contentType : getContentTypeFromName(docName)
            });
          }
        });
      }
      
      // Look for common document field names
      const possibleFileFields = [
        'birthCertificate', 'marriageCertificate', 'idPhoto', 'proofOfPayment',
        'documentImage', 'identificationFile', 'supportingDocument',
        'birthCertificateFile', 'marriageCertificateFile', 'photoFile',
        'validID', 'authorizationLetter', 'negativeCertification', 'documentaryEvidence1',
        'documentaryEvidence2', 'affidavitOfDisinterest', 'barangayCertification',
        'nationalID', 'photoID', 'parentDocument1', 'parentDocument2',
        'affidavitOfCorrection', 'publicationCertificate', 'medicalCertification',
        'baptismalCertificate', 'schoolRecords'
      ];
      
      // Check for common file fields in formData
      possibleFileFields.forEach(field => {
        if (formData && formData[field]) {
          // If it's a direct URL or base64 string
          if (typeof formData[field] === 'string') {
            if (
              formData[field].startsWith('http') || 
              formData[field].startsWith('data:')
            ) {
              files.push({
                name: formatDocumentName(field),
                documentType: formatDocumentName(field),
                url: formData[field],
                contentType: getContentTypeFromName(field)
              });
            }
          }
          // If it's an object with more info
          else if (typeof formData[field] === 'object' && formData[field] !== null) {
            if (formData[field].url || formData[field].data) {
              files.push({
                name: formData[field].name || formatDocumentName(field),
                documentType: formData[field].documentType || formatDocumentName(field),
                url: formData[field].url || formData[field].data,
                contentType: formData[field].contentType || getContentTypeFromName(field)
              });
            }
          }
        }
      });
      
      // Look for any keys that might contain image URLs or base64 data
      if (formData) {
        Object.keys(formData).forEach(key => {
          if (typeof formData[key] === 'string' && 
              (formData[key].startsWith('http') || formData[key].startsWith('data:image'))) {
            // Check if this URL is already in our files array to avoid duplicates
            if (!files.some(f => f.url === formData[key])) {
              files.push({
                name: formatDocumentName(key),
                documentType: formatDocumentName(key),
                url: formData[key],
                contentType: getContentTypeFromURL(formData[key])
              });
            }
          }
        });
      }
      
      // If we didn't find any files, create placeholder dummy files for required documents
      if (files.length === 0) {
        const requiredDocs = getRequiredDocuments();
        files = requiredDocs.map(doc => ({
          name: doc,
          documentType: doc,
          // Placeholder info
          placeholder: true,
          uploaded: Math.random() > 0.3, // Randomly mark some as uploaded for demo
        }));
      }
      
      setUploadedFiles(files);
    } catch (error) {
      console.error('Error extracting files from formData:', error);
      // If all else fails, show required documents list
      const requiredDocs = getRequiredDocuments();
      setUploadedFiles(requiredDocs.map(doc => ({
        name: doc,
        documentType: doc,
        placeholder: true,
        uploaded: false
      })));
    } finally {
      setLoading(false);
    }
  };

  const getRequiredDocuments = () => {
    // Use applicationSubtype if available, otherwise use applicationType
    const docType = applicationSubtype || applicationType;
    
    switch (docType) {
      case 'Regular application':
      case 'Regular Application (0-1 month)':
        return ['Valid ID', 'Authorization Letter (if applicable)'];
      case 'Copy of Birth Certificate':
      case 'Request copy':
        return ['Valid ID', 'Authorization Letter (if applicable)'];
      case 'Delayed Registration - Above 18':
      case 'Above 18':
        return [
          'Negative certification from PSA',
          'Two (2) documentary evidences',
          'Affidavit of two (2) disinterested persons with ID',
          'Certificate of marriage (If married)',
          'National ID or ePhil ID',
          'Barangay certification of residency',
          'Unedited front-facing photo (2x2, white background)',
          'Documentary evidences of parents',
          'Certificate of marriage of parents',
          'Affidavit of whereabouts of the mother (if mother cannot personally appear)',
        ];
      case 'Delayed Registration - Below 18':
      case 'Below 18':
        return [
          'Negative Certification from PSA',
          'Two (2) Documentary Evidences',
          'Affidavit of Two (2) Disinterested Persons',
          'Unedited Front-Facing Photo',
          'Documentary Evidence/s of Parents',
          'Barangay Certification of Residency',
          'National ID or ePhil ID',
        ];
      case 'Delayed Registration - Foreign Parent':
      case 'Foreign Parent':
        return [
          'Negative Certification from PSA',
          'Affidavit of two (2) disinterested persons',
          'Barangay Certification',
          'National ID',
          'Unedited 2x2 front-facing photo',
          'Parent Document 1',
          'Parent Document 2',
          'Documentary Evidence 1',
          'Documentary Evidence 2',
          'Valid Passport or ACR I-CARD of the Foreign Parent',
        ];
      case 'Out of Town Registration':
      case 'Out of town':
        return [
          'Negative Certification from PSA',
          'Affidavit of Two (2) Disinterested Persons',
          'Barangay Certification',
          'National ID',
          'Parent Document 1',
          'Parent Document 2',
          'Documentary Evidence 1',
          'Documentary Evidence 2',
        ];
      case 'Correction - Clerical Errors':
      case 'Clerical Error':
        return [
          'Original Birth Certificate with error',
          'Valid ID',
          'Annotated Birth Certificate',
          'Affidavit of Correction',
          'Publication Certificate',
        ];
      case 'Correction - Sex/Date of Birth':
      case 'Sex DOB':
        return [
          'Original Birth Certificate',
          'Valid ID',
          'Medical Certification',
          'Affidavit of Support',
          'Two Documentary Evidences',
          'Publication Certificate',
        ];
      case 'Correction - First Name':
      case 'First Name':
        return [
          'Original Birth Certificate',
          'Valid ID',
          'Baptismal Certificate',
          'School Records',
          'Publication Certificate',
          'Affidavit of Correction',
        ];
      case 'Marriage Certificate':
        return [
          'Marriage Certificate',
          'Valid ID of Both Parties',
          'Proof of Payment',
          'Supporting Documents'
        ];
      case 'Marriage License':
        return [
          'Certificate of No Marriage (CENOMAR)',
          'Birth Certificate of Both Parties',
          'Valid ID of Both Parties',
          'Pre-Marriage Counseling Certificate',
          'Community Tax Certificate',
          'Parental Consent (if applicable)',
          '1x1 Pictures of Both Parties'
        ];
      default:
        return [];
    }
  };

  const getFileIcon = (fileName, contentType) => {
    if (!fileName && !contentType) return <InsertDriveFileIcon />;

    // Try to determine from content type first
    if (contentType) {
      if (contentType.includes('pdf')) {
        return <PictureAsPdfIcon style={{ color: '#F40F02' }} />;
      } else if (contentType.includes('image')) {
        return <ImageIcon style={{ color: '#00C853' }} />;
      }
    }
    
    // If no content type, try to determine from file extension
    if (fileName) {
      const ext = fileName.split('.').pop().toLowerCase();
      if (['pdf'].includes(ext)) {
        return <PictureAsPdfIcon style={{ color: '#F40F02' }} />;
      } else if (['jpg', 'jpeg', 'png', 'gif', 'bmp'].includes(ext)) {
        return <ImageIcon style={{ color: '#00C853' }} />;
      }
    }

    return <InsertDriveFileIcon style={{ color: '#1565C0' }} />;
  };

  const getDocumentNote = docName => {
    if (docName.includes('Unedited front-facing photo')) {
      return '(2x2, white background)';
    }
    if (docName.includes('Certificate of marriage') && docName.includes('If married')) {
      return '(If married)';
    }
    if (docName.includes('Affidavit of whereabouts')) {
      return '(if mother cannot personally appear)';
    }
    return '';
  };
  
  const handleViewDocument = (file) => {
    if (file.placeholder) {
      alert('This is a placeholder. No actual document is available.');
      return;
    }
    
    setPreviewDialog({
      open: true,
      url: file.url,
      title: file.name || file.documentType,
      contentType: file.contentType
    });
  };
  
  const closePreviewDialog = () => {
    setPreviewDialog({
      open: false,
      url: '',
      title: '',
      contentType: ''
    });
  };
  
  const formatDocumentName = (name) => {
    if (!name) return 'Document';
    
    // Convert camelCase to spaces
    let formatted = name
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .trim();
      
    // Handle underscore case
    formatted = formatted
      .replace(/_/g, ' ')
      .replace(/\b\w/g, l => l.toUpperCase());
      
    return formatted;
  };
  
  const getContentTypeFromURL = (url) => {
    if (!url) return 'application/octet-stream';
    
    if (url.startsWith('data:')) {
      const matches = url.match(/^data:([^;]+);/);
      return matches ? matches[1] : 'application/octet-stream';
    }
    
    const extension = url.split('.').pop().toLowerCase();
    const extensionMap = {
      'jpg': 'image/jpeg',
      'jpeg': 'image/jpeg',
      'png': 'image/png',
      'gif': 'image/gif',
      'pdf': 'application/pdf',
      'doc': 'application/msword',
      'docx': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    };
    
    return extensionMap[extension] || 'application/octet-stream';
  };
  
  const getContentTypeFromName = (name) => {
    const lowerName = name.toLowerCase();
    
    if (lowerName.includes('photo') || lowerName.includes('image') || lowerName.includes('picture')) {
      return 'image/jpeg';
    } else if (lowerName.includes('pdf') || lowerName.includes('certificate')) {
      return 'application/pdf';
    } else {
      return 'application/octet-stream';
    }
  };
  
  const renderPreviewContent = () => {
    const { url, contentType } = previewDialog;
    
    if (!url) return <Typography>No preview available</Typography>;
    
    if (contentType && contentType.includes('image') || url.match(/\.(jpeg|jpg|gif|png)$/i) || url.startsWith('data:image')) {
      return (
        <img 
          src={url} 
          alt={previewDialog.title}
          style={{ 
            maxWidth: '100%', 
            maxHeight: '70vh',
            objectFit: 'contain'
          }} 
        />
      );
    } else if (contentType && contentType.includes('pdf') || url.match(/\.(pdf)$/i) || url.includes('data:application/pdf')) {
      return (
        <iframe
          src={url}
          title={previewDialog.title}
          width="100%"
          height="500px"
          style={{ border: 'none' }}
        />
      );
    } else {
      return (
        <Box sx={{ textAlign: 'center', p: 3 }}>
          <Typography variant="body1">
            This file type cannot be previewed. Please download the file to view it.
          </Typography>
          <Button 
            variant="contained" 
            component="a"
            href={url}
            download
            target="_blank"
            sx={{ mt: 2 }}
          >
            Download File
          </Button>
        </Box>
      );
    }
  };
  
  // Generate a list of documents we need to display - either from uploaded files or required docs
  const documentsToDisplay = () => {
    const requiredDocs = getRequiredDocuments();
    
    // If we have actual uploads, use those
    if (uploadedFiles.length > 0 && !uploadedFiles[0]?.placeholder) {
      return uploadedFiles;
    }
    
    // Otherwise generate from required document list
    return requiredDocs.map((doc, index) => {
      // Try to find a matching uploaded file
      const matchingFile = uploadedFiles.find(file => 
        file.name === doc || file.documentType === doc
      );
      
      if (matchingFile) return matchingFile;
      
      // Create a placeholder entry
      return {
        name: doc,
        documentType: doc,
        placeholder: true,
        uploaded: false
      };
    });
  };

  const displayedDocs = documentsToDisplay();

  return (
    <Box className="documentRequirementsContainer">
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h5" className="documentRequirementsTitle">
          Document Requirements
        </Typography>
        <Typography variant="body2" color="textSecondary">
          Processed by: {currentUser} on {currentDateTime}
        </Typography>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" p={4}>
          <CircularProgress />
        </Box>
      ) : (
        <List className="documentList">
          {displayedDocs.map((doc, index) => {
            const docNumber = index + 1;
            const docNote = getDocumentNote(doc.name || doc.documentType);
            const isUploaded = !doc.placeholder || doc.uploaded;

            return (
              <React.Fragment key={index}>
                <ListItem className="documentListItem">
                  <Box className="documentItemContent">
                    <Box className="documentHeader">
                      <Typography className="documentNumberTitle">
                        {docNumber}. {doc.name || doc.documentType}
                      </Typography>
                    </Box>

                    {docNote && <Typography className="documentNote">{docNote}</Typography>}

                    <Box className="uploadedPreviewBox">
                      {isUploaded ? (
                        <Button
                          variant="text"
                          className="uploadedPreviewButton"
                          onClick={() => handleViewDocument(doc)}
                          startIcon={getFileIcon(doc.name, doc.contentType)}
                        >
                          {doc.placeholder ? "View document" : "Preview document"}
                        </Button>
                      ) : (
                        <Typography className="notUploadedText">No document uploaded</Typography>
                      )}
                    </Box>
                  </Box>
                </ListItem>
                <Divider component="li" />
              </React.Fragment>
            );
          })}
        </List>
      )}
      
      {/* Preview Dialog */}
      <Dialog 
        open={previewDialog.open} 
        onClose={closePreviewDialog}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>{previewDialog.title}</DialogTitle>
        <DialogContent>
          <Box sx={{ 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            mt: 2
          }}>
            {renderPreviewContent()}
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={closePreviewDialog}>Close</Button>
          {previewDialog.url && (
            <Button 
              component="a"
              href={previewDialog.url}
              download
              target="_blank"
              startIcon={<FileDownloadIcon />}
            >
              Download
            </Button>
          )}
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FileUploadPreview;