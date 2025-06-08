import React from 'react';
import './AdminCopyBirthPreview.css';

const AdminCopyBirthPreview = ({ application }) => {
  // application prop shape:
  // {
  //   id: "BC-549324",
  //   status: "Approved",
  //   formData: {
  //     firstName: "Dennisse dasd",
  //     lastName: "Dennisse",
  //     birthMonth: "February",
  //     birthDay: "17",
  //     birthYear: "2009",
  //     city: "asdasd",
  //     province: "asdasd",
  //     motherMaidenName: "Dennisse dasd Dennisse",
  //     fatherName: "Dennisse dasd Dennisse",
  //     purpose: "Passport Application",
  //   },
  //   uploadedFiles: [ ... ]
  // }

  const { id, status, formData } = application || {};
  const fullName = [formData?.firstName, formData?.lastName].filter(Boolean).join(' ');
  const dob = formData?.birthMonth && formData?.birthDay && formData?.birthYear
    ? `${formData.birthMonth} ${formData.birthDay}, ${formData.birthYear}`
    : '';
  const placeOfBirth = [formData?.city, formData?.province].filter(Boolean).join(', ');

  return (
    <div className="AdminCopyBirthPreviewCBPreviewRoot">
      <div className="AdminCopyBirthPreviewCBPreviewHeader">
        <h2 className="AdminCopyBirthPreviewCBPreviewTitle">
          Copy of Birth Certificate Request
        </h2>
        <div className="AdminCopyBirthPreviewCBPreviewSubInfo">
          Application ID: {id || 'N/A'} | Status: {status || 'N/A'}
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
              {formData?.motherMaidenName || 'N/A'}
            </div>
          </div>
          <div className="AdminCopyBirthPreviewCBPreviewCol">
            <div className="AdminCopyBirthPreviewCBPreviewLabel">Father's Name:</div>
            <div className="AdminCopyBirthPreviewCBPreviewValue">
              {formData?.fatherName || 'N/A'}
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
         
            
          </div>
        </div>
      </div>

      <div className="AdminCopyBirthPreviewCBPreviewFooter">
        <span className="AdminCopyBirthPreviewCBPreviewInfoIcon">i</span>
        <span>
          Your request for a copy of birth certificate is being processed. Please wait for approval. You will be notified once your request has been processed.
        </span>
      </div>
    </div>
  );
};

export default AdminCopyBirthPreview;