import React from "react";
import NavBar from "../UserDashBoard/NavBar";
import "./AppoinmentForm.css"; 
import AppointmentContainer from "./AppointmentContent";


const AppoionmentForm = () => {
    return (
        <div className="AppoinmentFormContainer">
        <NavBar />
        <AppointmentContainer />
        </div>
    );
}
    export default AppoionmentForm;