import React from "react";
import NavBar from "../UserDashBoard/NavBar";
import "./ApplicationForm.css"; // Import the CSS file
import ApplicationContent from "./ApplicationContent";


const ApplicationForm = () => {
    return (
        <div className="ApplicationFormContainer">
        <NavBar />
   <ApplicationContent />
        </div>
    );
}
    export default ApplicationForm;