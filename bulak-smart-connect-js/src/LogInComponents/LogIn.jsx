import React from "react";
import './LogIn.css'
import LogInContent from './LogInContent'
import LogInCard from './LogInCard'
import NavBar from './NavBar'
function LogIn() {
    return (
        <div className="LogIn">
        <div className="Navigation">
            <NavBar />
            </div>
        <div className="LogInContainer">
           
            <LogInContent></LogInContent>
            <LogInCard></LogInCard>
            </div>
            </div>
)
}
export default LogIn