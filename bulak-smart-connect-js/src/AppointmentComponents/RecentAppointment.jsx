import React from "react";
import { Box, Typography, Card, CardContent, Button } from "@mui/material";
import { getRecentAppointments } from "./RecentAppointmentData";
import "./RecentAppointment.css";

const RecentAppointments = () => {
  const appointmentsData = getRecentAppointments();

  return (
    <Card className="RecentAppointmentsAppointment">
      <CardContent>
        <Typography variant="h6" className="SectionTitleAppointment">
          RECENT APPOINTMENTS
        </Typography>
        {appointmentsData.map((appointment, index) => (
          
          <Box key={index} className="AppointmentItemAppointment">
              <div className="AppointmentDivider">
            <Typography variant="body1" className="AppointmentTypeAppointment">
              {appointment.type}
            </Typography>
            <Typography variant="body2" className="AppointmentDateAppointment">
              {appointment.date} 
              </Typography>
              <Typography variant="body2" className="AppointmentTimeAppointment">
                {appointment.time}
              </Typography>
            </div>
            <Button size="small" className="SeeMoreAppointment">
              See More
            </Button>
          </Box>
        ))}
      </CardContent>
    </Card>
  );
};

export default RecentAppointments;
