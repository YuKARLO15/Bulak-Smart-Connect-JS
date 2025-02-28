import React from "react";
import { useParams, useLocation } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";
import NavBar from "../UserDashboard/NavBar";
import "./QRCodeAppointment.css";

const QRCodeAppointment = () => {
  const { id } = useParams(); 
  const location = useLocation();
  const { appointment } = location.state || {};

  if (!appointment) return <p>No appointment found.</p>;

  const qrData = JSON.stringify({
    id: appointment.id,
    type: appointment.type,
    date: appointment.date,
    time: appointment.time,
    name: `${appointment.firstName} ${appointment.lastName}`,
  });

  return (
    <div className="QrCodeContainerAppointment">
      <NavBar />
      <div className="QueueInfoAppointment">
        <h2>
          You have scheduled an appointment at <span className="HighlightAppointment">Civil Registrar Office</span>!
          You are currently in queue.
        </h2>
        <p>Your Appointment ID:</p>
        <h1 className="QueueNumberAppointment">{id}</h1>
        <div className="QrSectionAppointment">
          <QRCodeCanvas className="QrCodeAppointment" value={qrData} size={200} />
          <p>Scan this QR Code</p>
          <a href="#requirements" className="RequirementsLinkAppointment">
            Link for Requirements
          </a>
        </div>
        <div className="AppointmentDetailsSectionAppointment">
          <div className="AppointmentDetailsAppointment">
            <p><strong>Appointment Type:</strong> {appointment.type}</p>
            <p><strong>Appointment Date:</strong> {appointment.date}</p>
            <p><strong>Appointment Time:</strong> {appointment.time}</p>
            <p><strong>Client Name:</strong> {appointment.firstName} {appointment.lastName}</p>
            <p><strong>Address:</strong> {appointment.address}</p>
            <p><strong>Phone Number:</strong> {appointment.phoneNumber}</p>
          </div>
        </div>
        <p className="NoteAppointment">
          <strong>Note:</strong> All clients are required to arrive at least 15 minutes before their scheduled
          appointment time. Late arrivals will need to reschedule.
        </p>
      </div>
    </div>
  );
};

export default QRCodeAppointment;
