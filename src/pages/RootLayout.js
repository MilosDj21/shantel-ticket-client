import React, { Fragment, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { useMediaQuery, Box } from "@mui/material";
import { useSelector } from "react-redux";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const RootLayout = () => {
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const userId = useSelector((state) => state.auth.userId);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      navigate("/login");
    }
  }, [userId, navigate]);

  return (
    <Fragment>
      {userId && (
        <Box display={isNonMobile ? "flex" : "block"} width="100%" height="100%">
          <Sidebar isNonMobile={isNonMobile} drawerWidth="250px" isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
          <Box flexGrow={1} overflow="auto">
            <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            <Outlet />
          </Box>
        </Box>
      )}
    </Fragment>
  );
};

export default RootLayout;
