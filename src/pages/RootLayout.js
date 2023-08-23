import React, { useMemo } from "react";
import { Outlet } from "react-router";
import { createTheme } from "@mui/material/styles";
import { themeSettings } from "../theme";
import { ThemeProvider, CssBaseline } from "@mui/material";

const RootLayout = () => {
  const theme = useMemo(() => createTheme(themeSettings), []);
  return (
    <div className="app">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Outlet />
      </ThemeProvider>
    </div>
  );
};

export default RootLayout;
