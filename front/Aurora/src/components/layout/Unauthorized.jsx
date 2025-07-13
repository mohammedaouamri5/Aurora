import { Button } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";

const Unauthorized = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Button variant="contained" onClick={() => navigate("/")}>
        Back to Home
      </Button>
    </div>
  );
};

export default Unauthorized;
