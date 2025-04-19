import React from 'react';
import './UserInfoCard.css';

const UserInfoCard = ({ data }) => {
  return (
    <div className="info-card">
      <h2>Application Number: <span className="app-number">{data.applicationNumber}</span></h2>
      <div className="details-grid">
        <div><strong>Last Name :</strong> {data.lastName}</div>
        <div><strong>First Name :</strong> {data.firstName}</div>
        <div><strong>Middle Initial:</strong> {data.middleInitial}</div>
        <div><strong>Phone Number:</strong> {data.phone}</div>
        <div><strong>Email Address:</strong> {data.email}</div>
        <div><strong></strong> {data.none}</div>        
        <div><strong>Application Type:</strong> {data.applicationType}<br/><small>{data.subType}</small></div>
        <div><strong>Submission Date:</strong> {data.submissionDate}</div>
      </div>
      <div className="btn-group">
        <button className="back">Back</button>
        <button className="next">Next</button>
      </div>
    </div>
  );
};

export default UserInfoCard;
