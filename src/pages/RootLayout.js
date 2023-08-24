import React, { useMemo, useState } from "react";
import { Outlet } from "react-router";
import { createTheme } from "@mui/material/styles";
import { ThemeProvider, CssBaseline, useMediaQuery, Box } from "@mui/material";

import { themeSettings } from "../theme";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

const RootLayout = () => {
  const theme = useMemo(() => createTheme(themeSettings), []);
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  return (
    <div className="app">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Box display={isNonMobile ? "flex" : "block"} width="100%" height="100%">
          <Sidebar isNonMobile={isNonMobile} drawerWidth="250px" isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
          <Box flexGrow={1}>
            <Navbar isSidebarOpen={isSidebarOpen} setIsSidebarOpen={setIsSidebarOpen} />
            <Outlet />
          </Box>
        </Box>
      </ThemeProvider>
    </div>
  );
};

export default RootLayout;
