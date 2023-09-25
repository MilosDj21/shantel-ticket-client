import React, { Fragment, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();
  const isLoading = true;
  useEffect(() => {
    navigate("/tickets");
  });
  return <Fragment>{!isLoading && <div>Dashboard</div>}</Fragment>;
};

export default Dashboard;
