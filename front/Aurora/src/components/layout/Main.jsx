import React from "react";
import Appointments from "../appointments/Appointments";
import Dashboard from "../Dashboard";
import Patients from "../patients/Patients";
import Rapports from "../Rapports";
import Facturation from "../Facturation";
import Calendar from "../calendar/Calendar";

const Main = ({ selected }) => {


  const renderContent = () => {
    switch (selected) {
      case 0:
        return (
            <Dashboard />
        );
      case 1:
        return (
            <Patients />
        );
      case 2:
        return (
            <Appointments />
        );
      case 3:
        return (
            <Rapports />
        );
      case 4:
        return (
            <Facturation />
        );
        
      case 5:
        return (
            <Calendar />
        );
      default:
        return null;
    }
  };

  return renderContent();
};

export default Main;
