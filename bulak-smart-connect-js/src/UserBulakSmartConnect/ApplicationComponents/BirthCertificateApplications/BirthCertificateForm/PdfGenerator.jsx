import React from "react";
import { Box, Button } from "@mui/material";
import { PDFDownloadLink, Document, Page, Text, View, StyleSheet, Image } from "@react-pdf/renderer";
import birthCertificateTemplate from "./birth-certificate-template.png"; 

const styles = StyleSheet.create({
  page: {
    position: "relative",
    padding: 0,
    margin: 0,
  },
  certificateImage: {
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },

  childName: {
    position: "absolute",
    top: "195px",
    left: "100px",
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
  },
  childLastName: {
    position: "absolute",
    top: "195px",
    left: "620px",
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
  },
  sex: {
    position: "absolute",
    top: "237px",
    left: "150px",
    fontSize: 10,
  },
  birthDate: {
    position: "absolute",
    top: "237px",
    left: "400px",
    fontSize: 10,
  },
  birthPlace: {
    position: "absolute",
    top: "278px",
    left: "150px",
    fontSize: 10,
  },
  birthCity: {
    position: "absolute",
    top: "278px",
    left: "400px",
    fontSize: 10,
  },
  birthProvince: {
    position: "absolute",
    top: "278px",
    left: "580px",
    fontSize: 10,
  },
  typeOfBirth: {
    position: "absolute",
    top: "320px",
    left: "150px",
    fontSize: 10,
  },
  multipleBirthOrder: {
    position: "absolute",
    top: "320px",
    left: "400px",
    fontSize: 10,
  },
  birthOrder: {
    position: "absolute",
    top: "320px",
    left: "580px",
    fontSize: 10,
  },
  birthWeight: {
    position: "absolute",
    top: "320px",
    left: "720px",
    fontSize: 10,
  },
  // Mother section
  motherName: {
    position: "absolute",
    top: "370px",
    left: "100px",
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
  },
  motherLastName: {
    position: "absolute",
    top: "370px",
    left: "620px",
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
  },
  motherCitizenship: {
    position: "absolute",
    top: "410px",
    left: "150px",
    fontSize: 10,
  },
  motherReligion: {
    position: "absolute",
    top: "410px",
    left: "400px",
    fontSize: 10,
  },
  motherChildrenAlive: {
    position: "absolute",
    top: "450px",
    left: "150px",
    fontSize: 10,
  },
  motherLivingChildren: {
    position: "absolute",
    top: "450px",
    left: "350px",
    fontSize: 10,
  },
  motherDeceasedChildren: {
    position: "absolute",
    top: "450px",
    left: "500px",
    fontSize: 10,
  },
  motherOccupation: {
    position: "absolute",
    top: "450px",
    left: "630px",
    fontSize: 10,
  },
  motherAge: {
    position: "absolute",
    top: "450px",
    left: "730px",
    fontSize: 10,
  },
  motherResidence: {
    position: "absolute",
    top: "490px",
    left: "150px",
    fontSize: 10,
  },
  // Father section
  fatherName: {
    position: "absolute",
    top: "540px",
    left: "100px",
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
  },
  fatherLastName: {
    position: "absolute",
    top: "540px",
    left: "620px",
    fontSize: 10,
    fontFamily: "Helvetica-Bold",
  },
  fatherCitizenship: {
    position: "absolute",
    top: "580px",
    left: "150px",
    fontSize: 10,
  },
  fatherReligion: {
    position: "absolute",
    top: "580px",
    left: "400px",
    fontSize: 10,
  },
  fatherOccupation: {
    position: "absolute",
    top: "580px",
    left: "630px",
    fontSize: 10,
  },
  fatherAge: {
    position: "absolute",
    top: "580px",
    left: "730px",
    fontSize: 10,
  },
  fatherResidence: {
    position: "absolute",
    top: "620px",
    left: "150px",
    fontSize: 10,
  },
  // Marriage section
  marriageDate: {
    position: "absolute",
    top: "680px",
    left: "150px",
    fontSize: 10,
  },
  marriagePlace: {
    position: "absolute",
    top: "680px",
    left: "400px",
    fontSize: 10,
  },
  // Attendant section
  attendantType: {
    position: "absolute",
    top: "740px",
    fontSize: 10,
  },
  attendantName: {
    position: "absolute",
    top: "830px",
    left: "150px",
    fontSize: 10,
  },
  attendantTitle: {
    position: "absolute",
    top: "860px",
    left: "150px",
    fontSize: 10,
  },
  certificationDate: {
    position: "absolute",
    top: "860px",
    left: "500px",
    fontSize: 10,
  },
  // Informant section
  informantName: {
    position: "absolute",
    top: "950px",
    left: "150px",
    fontSize: 10,
  },
  informantRelationship: {
    position: "absolute",
    top: "980px",
    left: "150px",
    fontSize: 10,
  },
  informantAddress: {
    position: "absolute",
    top: "1010px",
    left: "150px",
    fontSize: 10,
  },
  informantDate: {
    position: "absolute",
    top: "1040px",
    left: "150px",
    fontSize: 10,
  },
  applicationId: {
    position: "absolute",
    top: "1170px",
    left: "150px",
    fontSize: 8,
    color: "#666666",
  }
});

// PDF Document Component
const BirthCertificatePDF = ({ formData, applicationId }) => {
  // Helper function to format date
  const formatDate = (month, day, year) => {
    if (!month || !day || !year) return "";
    return `${month} ${day}, ${year}`;
  };

  // Helper function to set attendant type position
  const getAttendantPosition = (type) => {
    switch (type) {
      case "Physician":
        return { left: "130px" };
      case "Nurse":
        return { left: "270px" };
      case "Midwife":
        return { left: "350px" };
      case "Traditional Birth Attendant":
        return { left: "450px" };
      default:
        return { left: "620px" };
    }
  };

  const attendantStyle = {
    ...styles.attendantType,
    ...getAttendantPosition(formData?.attendantType)
  };

  return (
    <Document>
      <Page size="LEGAL" style={styles.page}>
        {/* Background certificate template */}
        <Image src={birthCertificateTemplate} style={styles.certificateImage} />
        
        {/* Overlay with form data */}
        <View style={styles.overlay}>
          {/* Child Information */}
          <Text style={styles.childName}>
            {`${formData?.firstName || ""} ${formData?.middleName ||  ""}`}
          </Text>
          <Text style={styles.childLastName}>
            {`${formData?.lastName || ""} ${formData?.extension || ""}`}
          </Text>
          <Text style={styles.sex}>{formData?.sex || ""}</Text>
          <Text style={styles.birthDate}>
            {formatDate(formData?.birthMonth, formData?.birthDay, formData?.birthYear)}
          </Text>
          <Text style={styles.birthPlace}>{formData?.hospital || ""}</Text>
          <Text style={styles.birthCity}>{formData?.city || ""}</Text>
          <Text style={styles.birthProvince}>{formData?.province || ""}</Text>
          <Text style={styles.typeOfBirth}>{formData?.typeOfBirth || ""}</Text>
          <Text style={styles.multipleBirthOrder}>{formData?.multipleBirthOrder || ""}</Text>
          <Text style={styles.birthOrder}>{formData?.birthOrder || ""}</Text>
          <Text style={styles.birthWeight}>{formData?.birthWeight ? `${formData.birthWeight} grams` : ""}</Text>
          
          {/* Mother Information */}
          <Text style={styles.motherName}>
            {`${formData?.motherFirstName || ""} ${formData?.motherMiddleName || ""}`}
          </Text>
          <Text style={styles.motherLastName}>
            {`${formData?.motherLastName || ""} ${formData?.motherExtension || ""}`}
          </Text>
          <Text style={styles.motherCitizenship}>{formData?.motherCitizenship || ""}</Text>
          <Text style={styles.motherReligion}>{formData?.motherReligion || ""}</Text>
          <Text style={styles.motherChildrenAlive}>{formData?.motherTotalChildren || ""}</Text>
          <Text style={styles.motherLivingChildren}>{formData?.motherLivingChildren || ""}</Text>
          <Text style={styles.motherDeceasedChildren}>{formData?.motherDeceasedChildren || ""}</Text>
          <Text style={styles.motherOccupation}>{formData?.motherOccupation || ""}</Text>
          <Text style={styles.motherAge}>{formData?.motherAge || ""}</Text>
          <Text style={styles.motherResidence}>
            {`${formData?.motherStreet || ""}, ${formData?.motherBarangay || ""}, ${formData?.motherCity || ""}, ${formData?.motherProvince || ""}, ${formData?.motherCountry || ""}`}
          </Text>
          
          {/* Father Information */}
          <Text style={styles.fatherName}>
            {`${formData?.fatherFirstName || ""} ${formData?.fatherMiddleName || ""}`}
          </Text>
          <Text style={styles.fatherLastName}>
            {`${formData?.fatherLastName || ""} ${formData?.fatherExtension || ""}`}
          </Text>
          <Text style={styles.fatherCitizenship}>{formData?.fatherCitizenship || ""}</Text>
          <Text style={styles.fatherReligion}>{formData?.fatherReligion || ""}</Text>
          <Text style={styles.fatherOccupation}>{formData?.fatherOccupation || ""}</Text>
          <Text style={styles.fatherAge}>{formData?.fatherAge || ""}</Text>
          <Text style={styles.fatherResidence}>
            {`${formData?.fatherStreet || ""}, ${formData?.fatherBarangay || ""}, ${formData?.fatherCity || ""}, ${formData?.fatherProvince || ""}, ${formData?.fatherCountry || ""}`}
          </Text>
          
          {/* Marriage Information */}
          <Text style={styles.marriageDate}>
            {formatDate(formData?.marriageMonth, formData?.marriageDay, formData?.marriageYear)}
          </Text>
          <Text style={styles.marriagePlace}>
            {`${formData?.marriageCity || ""}, ${formData?.marriageProvince || ""}, ${formData?.marriageCountry || ""}`}
          </Text>
          
          {/* Attendant Information */}
          <Text style={attendantStyle}>X</Text>
          <Text style={styles.attendantName}>{formData?.attendantName || ""}</Text>
          <Text style={styles.attendantTitle}>{formData?.attendantTitle || ""}</Text>
          <Text style={styles.certificationDate}>
            {formatDate(formData?.certificationMonth, formData?.certificationDay, formData?.certificationYear)}
          </Text>
          
          {/* Informant Information */}
          <Text style={styles.informantName}>
            {`${formData?.informantFirstName || ""} ${formData?.informantMiddleName || ""} ${formData?.informantLastName || ""} ${formData?.informantSuffix || ""}`}
          </Text>
          <Text style={styles.informantRelationship}>{formData?.informantRelationship || ""}</Text>
          <Text style={styles.informantAddress}>
            {`${formData?.informantStreet || ""}, ${formData?.informantBarangay || ""}, ${formData?.informantCity || ""}, ${formData?.informantProvince || ""}, ${formData?.informantCountry || ""}`}
          </Text>
          <Text style={styles.informantDate}>{new Date().toLocaleDateString()}</Text>
          
          {/* Application ID for reference */}
          <Text style={styles.applicationId}>Application ID: {applicationId}</Text>
        </View>
      </Page>
    </Document>
  );
};

// PDF Print Button component that you can add to your BirthApplicationSummary component
const PDFPrintButton = ({ formData, applicationId }) => {
  return (
    <Box sx={{ mt: 2 }}>
      <PDFDownloadLink
        document={<BirthCertificatePDF formData={formData} applicationId={applicationId} />}
        fileName={`birth-certificate-${applicationId}.pdf`}
        style={{ textDecoration: "none" }}
      >
        {({ blob, url, loading, error }) => (
          <Button 
            variant="contained" 
            color="primary" 
            disabled={loading}
            sx={{ 
              backgroundColor: "#4caf50", 
              "&:hover": { backgroundColor: "#388e3c" } 
            }}
          >
            {loading ? "Generating PDF..." : "Print/Download Certificate"}
          </Button>
        )}
      </PDFDownloadLink>
    </Box>
  );
};

export default PDFPrintButton;