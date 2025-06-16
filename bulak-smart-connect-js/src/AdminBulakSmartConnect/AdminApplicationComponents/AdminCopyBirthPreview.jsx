import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { documentApplicationService } from "../../services/documentApplicationService";
import "./AdminCopyBirthPreview.css";

const uiTitleMap = {
  "Copy of Birth Certificate": "Copy of Birth Certificate Request",
  "Correction - Clerical Errors": "Correction of Clerical Error",
  "Correction - Sex/Date of Birth": "Correction of Child's Sex / Date of Birth",
  "Correction - First Name": "Correction of First Name"
};

const AdminCopyBirthPreview = () => {
  const { id } = useParams();
  const [application, setApplication] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    async function fetchApplication() {
      try {
        const app = await documentApplicationService.getApplication(id);
        if (isMounted) {
          setApplication(app);
        }
      } catch (err) {
        setError("Error loading application details: " + err.message);
      } finally {
        if (isMounted) setLoading(false);
      }
    }
    if (id) fetchApplication();
    return () => { isMounted = false; };
  }, [id]);

  if (loading) {
    return <div className="AdminCopyBirthPreviewCBPreviewRoot">Loading...</div>;
  }
  if (error) {
    return <div className="AdminCopyBirthPreviewCBPreviewRoot" style={{ color: "red" }}>{error}</div>;
  }
  if (!application) {
    return <div className="AdminCopyBirthPreviewCBPreviewRoot">No application found.</div>;
  }

  const { formData } = application;
  const fullName = [formData?.firstName, formData?.lastName].filter(Boolean).join(' ');
  const motherMaidenName = [formData?.motherFirstName, formData?.motherMiddleName, formData?.motherLastName].filter(Boolean).join(' ')
  const fatherName = [formData?.fatherFirstName, formData?.fatherMiddleName, formData?.fatherLastName].filter(Boolean).join(' ')
  const dob = formData?.birthMonth && formData?.birthDay && formData?.birthYear
    ? `${formData.birthMonth} ${formData.birthDay}, ${formData.birthYear}`
    : '';
  const placeOfBirth = [formData?.city, formData?.province].filter(Boolean).join(', ');

  const appSubtype =
    application.applicationSubtype ||
    (application.formData && application.formData.applicationSubtype) ||
    application.subtype ||
    "Copy of Birth Certificate";
  const title = uiTitleMap[appSubtype] || "Copy of Birth Certificate Request";

  return (
    <div className="AdminCopyBirthPreviewCBPreviewRoot">
      <div className="AdminCopyBirthPreviewCBPreviewHeader">
        <h2 className="AdminCopyBirthPreviewCBPreviewTitle">
          {title}
        </h2>
        <div className="AdminCopyBirthPreviewCBPreviewSubInfo">
          Application ID: {application.id || 'N/A'} | Status: {application.status || 'N/A'}
        </div>
      </div>

      <hr className="AdminCopyBirthPreviewCBPreviewDivider" />

      <div className="AdminCopyBirthPreviewCBPreviewSection">
        <div className="AdminCopyBirthPreviewCBPreviewSectionTitle">Personal Information</div>
        <div className="AdminCopyBirthPreviewCBPreviewRow">
          <div className="AdminCopyBirthPreviewCBPreviewCol">
            <div className="AdminCopyBirthPreviewCBPreviewLabel">Full Name:</div>
            <div className="AdminCopyBirthPreviewCBPreviewValue">{fullName || 'N/A'}</div>
          </div>
          <div className="AdminCopyBirthPreviewCBPreviewCol">
            <div className="AdminCopyBirthPreviewCBPreviewLabel">Date of Birth:</div>
            <div className="AdminCopyBirthPreviewCBPreviewValue">{dob || 'N/A'}</div>
          </div>
          <div className="AdminCopyBirthPreviewCBPreviewCol">
            <div className="AdminCopyBirthPreviewCBPreviewLabel">Place of Birth:</div>
            <div className="AdminCopyBirthPreviewCBPreviewValue">{placeOfBirth || 'N/A'}</div>
          </div>
        </div>
      </div>

      <div className="AdminCopyBirthPreviewCBPreviewSection">
        <div className="AdminCopyBirthPreviewCBPreviewSectionTitle">Parents Information</div>
        <div className="AdminCopyBirthPreviewCBPreviewRow">
          <div className="AdminCopyBirthPreviewCBPreviewCol">
            <div className="AdminCopyBirthPreviewCBPreviewLabel">Mother's Maiden Name:</div>
            <div className="AdminCopyBirthPreviewCBPreviewValue">
              {motherMaidenName || 'N/A'}
            </div>
          </div>
          <div className="AdminCopyBirthPreviewCBPreviewCol">
            <div className="AdminCopyBirthPreviewCBPreviewLabel">Father's Name:</div>
            <div className="AdminCopyBirthPreviewCBPreviewValue">
              {fatherName || 'N/A'}
            </div>
          </div>
        </div>
      </div>

      <div className="AdminCopyBirthPreviewCBPreviewSection">
        <div className="AdminCopyBirthPreviewCBPreviewSectionTitle">Request Information</div>
        <div className="AdminCopyBirthPreviewCBPreviewRow">
          <div className="AdminCopyBirthPreviewCBPreviewCol" style={{flex: 1.5}}>
            <div className="AdminCopyBirthPreviewCBPreviewLabel">Purpose of Request:</div>
            <div className="AdminCopyBirthPreviewCBPreviewValue">{formData?.purpose || 'N/A'}</div>
          </div>
          <div className="AdminCopyBirthPreviewCBPreviewCol" style={{flex: 2}}>
            <div className="AdminCopyBirthPreviewCBPreviewLabel">Uploaded Documents:</div>
            <div className="AdminCopyBirthPreviewCBPreviewValue">
              <div>
                <strong>Valid ID:</strong>
                <span style={{marginLeft: 8, fontWeight: 400}}>(See "Uploaded Documents" Tab)</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      
    </div>
  );
};

export default AdminCopyBirthPreview;