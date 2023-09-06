import React, { useState } from "react";
import { Menu as MenuIcon, SettingsOutlined, ArrowDropDownOutlined } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { AppBar, IconButton, Toolbar, useTheme, Button, Menu, MenuItem, Box, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

import FlexBetween from "./FlexBetween";
import useHttp from "../hooks/use-http";
import { authActions } from "../store/auth";

const Navbar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const theme = useTheme();
  const { sendRequest } = useHttp();
  const userFirstName = useSelector((state) => state.firstName);
  const userLastName = useSelector((state) => state.lastName);
  const userProfileImage = useSelector((state) => state.profileImage);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [anchorEl, setAnchorEl] = useState(null);
  const isOpen = Boolean(anchorEl);
  const handleClick = (event) => setAnchorEl(event.currentTarget);

  const handleLogout = () => {
    setAnchorEl(null);

    const logoutUser = () => {
      dispatch(authActions.logout());
      localStorage.removeItem("user");
      navigate("/login");
    };

    sendRequest(
      {
        url: "/logout",
        method: "GET",
      },
      logoutUser
    );
  };

  const serverAddress = process.env.ENVIRONMENT === "production" ? process.env.REACT_APP_PROD_BASE_URL : process.env.REACT_APP_DEV_BASE_URL;

  return (
    <AppBar
      sx={{
        position: "static",
        background: "none",
        boxShadow: "none",
      }}
    >
      <Toolbar sx={{ justifyContent: "space-between" }}>
        <FlexBetween>
          <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
            <MenuIcon
              sx={{
                color: theme.palette.grey.main,
              }}
            />
          </IconButton>
        </FlexBetween>
        <FlexBetween gap="0.5rem">
          <IconButton>
            <SettingsOutlined
              sx={{
                color: theme.palette.grey.main,
              }}
            />
          </IconButton>

          {/* PROFILE */}
          <FlexBetween>
            <Button
              onClick={handleClick}
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                textTransform: "none",
                gap: "1rem",
              }}
            >
              <Box component="img" alt="profile" src={serverAddress + "/" + userProfileImage} crossOrigin="use-credentials" height="32px" width="32px" borderRadius="50%" sx={{ objectFit: "cover" }} />
              <Box textAlign="left">
                <Typography fontWeight="bold" variant="h4">
                  {userFirstName}
                </Typography>
                <Typography fontWeight="bold" variant="h4">
                  {userLastName}
                </Typography>
              </Box>
              <ArrowDropDownOutlined sx={{ color: theme.palette.secondary[300], fontSize: "25px" }} />
            </Button>
            <Menu
              anchorEl={anchorEl}
              open={isOpen}
              onClose={() => setAnchorEl(null)}
              anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
              // sx={{
              //   "& .MuiList-root": {
              //     backgroundColor: "black",
              //   },
              // }}
            >
              <MenuItem
                onClick={handleLogout}
                // sx={{
                //   backgroundColor: "black",
                //   m: "0",
                // }}
              >
                Log Out
              </MenuItem>
            </Menu>
          </FlexBetween>
        </FlexBetween>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
