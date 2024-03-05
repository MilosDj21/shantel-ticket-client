import React, { useState } from "react";
import { Menu as MenuIcon, SettingsOutlined, ArrowDropDownOutlined, Notifications } from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import { AppBar, IconButton, Toolbar, useTheme, Button, Menu, MenuItem, Box, Typography, Badge } from "@mui/material";
import { useNavigate } from "react-router-dom";
import parse from "html-react-parser";

import FlexBetween from "./FlexBetween";
import useHttp from "../hooks/use-http";
import { authActions } from "../store/auth";
import { socketActions } from "../store/socket";

const Navbar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const theme = useTheme();
  const { sendRequest } = useHttp();
  const userFirstName = useSelector((state) => state.auth.firstName);
  const userLastName = useSelector((state) => state.auth.lastName);
  const userProfileImage = useSelector((state) => state.auth.profileImage);
  const unreadNotifications = useSelector((state) => state.socket.unreadNotifications);
  const notificationList = useSelector((state) => state.socket.notificationList);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);

  const isOpen = Boolean(anchorEl);
  const isNotificationOpen = Boolean(notificationAnchorEl);

  const handleClick = (event) => setAnchorEl(event.currentTarget);
  const notificationClickHandle = (event) => {
    setNotificationAnchorEl(event.currentTarget);
    dispatch(socketActions.readAllNotifications());
  };

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
      logoutUser,
    );
  };

  const serverAddress = process.env.ENVIRONMENT === "production" ? process.env.REACT_APP_PROD_BASE_URL : process.env.REACT_APP_DEV_BASE_URL;

  return (
    <AppBar
      sx={{
        position: "static",
        background: "none",
        boxShadow: "none",
      }}>
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

          {/*Notification*/}
          <IconButton onClick={notificationClickHandle}>
            <Badge badgeContent={unreadNotifications} color="success">
              <Notifications
                sx={{
                  color: theme.palette.grey.main,
                }}
              />
            </Badge>
          </IconButton>
          <Menu
            anchorEl={notificationAnchorEl}
            open={isNotificationOpen}
            onClose={() => setNotificationAnchorEl(null)}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
            sx={{
              "& .MuiList-root": {
                backgroundColor: theme.palette.background.light,
                borderRadius: "5px",
                border: `1px solid ${theme.palette.grey.main}`,
              },
            }}>
            {notificationList.length > 0 ? (
              notificationList.map((n) => {
                let notification = parse(n.message);
                // if parse into array and array not empty
                if (notification instanceof Array && notification.length > 0) {
                  //if first <p> of array longer than 35 chars
                  if (notification[0].props.children.length > 35) {
                    notification = notification[0].props.children.substring(0, 35) + "...";
                  } else {
                    notification = notification[0].props.children + "...";
                  }
                }
                // if parse into object
                else if (notification instanceof Object) {
                  //if longer than 35 chars
                  if (notification.props.children.length > 35) {
                    notification = notification.props.children.substring(0, 35) + "...";
                  } else {
                    notification = notification.props.children;
                  }
                }
                return (
                  <MenuItem
                    key={n._id}
                    // onClick={handleLogout}
                    sx={{
                      backgroundColor: theme.palette.background.light,
                      color: theme.palette.grey.main,
                      m: "0",
                      ":hover": {
                        backgroundColor: theme.palette.background.default,
                      },
                      "& p": {
                        margin: 0,
                      },
                    }}>
                    <Box display="flex" gap="0.5rem">
                      <Box
                        component="img"
                        alt="profile"
                        src={serverAddress + "/" + n.user.profileImage}
                        crossOrigin="use-credentials"
                        height="22px"
                        width="22px"
                        borderRadius="50%"
                        sx={{ objectFit: "cover" }}
                      />
                      <Box>{notification}</Box>
                    </Box>
                  </MenuItem>
                );
              })
            ) : (
              <MenuItem
                sx={{
                  backgroundColor: theme.palette.background.light,
                  color: theme.palette.grey.main,
                  m: "0",
                  ":hover": {
                    backgroundColor: theme.palette.background.default,
                  },
                }}>
                No Notifications
              </MenuItem>
            )}
          </Menu>

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
              }}>
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
