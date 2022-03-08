import React from "react";
import { Card, CardContent, Typography } from "@mui/material";
import "./InfoBox.css";

const InfoBox = ({ title, cases, total, active, isRed, ...props }) => {
  return (
    <Card
      onClick={props.onClick}
      className={`InfoBox ${active && "InfoBox_selected"} 
      ${isRed && active &&"InfoBox_red"}`}
    >
      <CardContent>
        <Typography color="textSecondary" className="Title">
          {title}
        </Typography>
        <h2 className={`Cases ${!isRed && "Cases_green"}`}>{cases}</h2>
        <Typography className="Total" color="textSecondary">
          {total} Total
        </Typography>
      </CardContent>
    </Card>
  );
};

export default InfoBox;
