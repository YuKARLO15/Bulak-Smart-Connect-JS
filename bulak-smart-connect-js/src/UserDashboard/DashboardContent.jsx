import React, { useState } from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./DashboardContent.css";
import { Search } from "@mui/icons-material";

const DashboardContent = () => {
  const [tooltip, setTooltip] = useState({ show: false, x: 0, y: 0 });

  const handleHover = (e, date) => {
    const day = date.getDay(); // 0 = Sunday, 6 = Saturday
    if (day === 0 || day === 6) {
      setTooltip({
        show: true,
        x: e.clientX,
        y: e.clientY,
      });
    }
  };

  const handleMouseLeave = () => {
    setTooltip({ show: false });
  };

  return (
    <Box className="DashboardContainer">
      <div className="DashboardHeader">
        <Typography variant="h4">Dashboard</Typography>
        <div className="SearchBox">
          <Search className="SearchIcon" />
          <input type="text" placeholder="Search" className="SearchInput" />
        </div>
      </div>
    <div className="TopSection">
      <Card className="DashboardCard">
        <CardContent>
          <Typography variant="h6">Appointments</Typography>
          <div style={{ position: "relative" }}>
            <Calendar
              className="Calendar"
              tileClassName={({ date }) => (date.getDay() === 0 || date.getDay() === 6 ? "weekend" : "")}
              tileContent={({ date }) => (
                <div
                  onMouseEnter={(e) => handleHover(e, date)}
                  onMouseLeave={handleMouseLeave}
                  className="hover-area"
                ></div>
              )}
            />
          </div>
        </CardContent>
      </Card>

      {tooltip.show && (
        <div
          className="tooltip"
          style={{
            position: "fixed",
            top: tooltip.y + 10,
            left: tooltip.x + 10,
          }}
        >
          Office is closed
        </div>
      )}

      <Card className="DashboardCard">
        <CardContent>
          <Typography variant="h6">Announcement</Typography>
            <Box className="AnnouncementBox"></Box>
            <Typography variant="body1" className="AnnouncementText">
              There are no announcements at the moment. 
            </Typography>
        </CardContent>
        </Card>
      </div>
    </Box>
  );
};

export default DashboardContent;

