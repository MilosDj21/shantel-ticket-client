import { Box, Drawer, IconButton, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography, useTheme } from "@mui/material";
import { ChevronLeft, ChevronRightOutlined, HomeOutlined, Person, SupervisorAccount, Description } from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import FlexBetween from "./FlexBetween";
import useHttp from "../hooks/use-http";
import ShantelLogo from "../assets/ShantelLogo.png";

const Sidebar = ({ drawerWidth, isSidebarOpen, setIsSidebarOpen, isNonMobile }) => {
  const theme = useTheme();
  const userRoles = useSelector((state) => state.roles);
  const { pathname } = useLocation();
  const { sendRequest } = useHttp();
  const navigate = useNavigate();
  const [active, setActive] = useState("");
  const [adminSidebarItems, setAdminSidebarItems] = useState(false);

  let navItems = [];

  if (adminSidebarItems) {
    navItems = [
      {
        text: "Dashboard",
        icon: <HomeOutlined />,
        link: "",
      },
      {
        text: "Ticket",
        icon: null,
        link: null,
      },
      {
        text: "All Tickets",
        icon: <Description />,
        link: "tickets",
      },
      {
        text: "New Ticket",
        icon: <Description />,
        link: "tickets/new",
      },
      {
        text: "Admin",
        icon: null,
        link: null,
      },
      {
        text: "All Users",
        icon: <SupervisorAccount />,
        link: "users",
      },
      {
        text: "New User",
        icon: <Person />,
        link: "users/new",
      },
    ];
  } else {
    navItems = [
      {
        text: "Dashboard",
        icon: <HomeOutlined />,
        link: "",
      },
      {
        text: "Ticket",
        icon: null,
        link: null,
      },
      {
        text: "All Tickets",
        icon: <Description />,
        link: "tickets",
      },
      {
        text: "New Ticket",
        icon: <Description />,
        link: "tickets/new",
      },
    ];
  }

  useEffect(() => {
    setActive(pathname.substring(1));
  }, [pathname]);

  useEffect(() => {
    const saveRole = (roleData) => {
      if (roleData.name === "Super Admin" || roleData.name === "Admin") {
        setAdminSidebarItems(true);
      }
    };

    for (const r of userRoles) {
      sendRequest(
        {
          url: `/roles/${r}`,
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
        saveRole
      );
    }
  }, [sendRequest, userRoles]);

  return (
    <Box component="nav">
      {isSidebarOpen && (
        <Drawer
          open={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          variant="persistent"
          anchor="left"
          sx={{
            width: drawerWidth,
            "& .MuiDrawer-paper": {
              color: theme.palette.primary.light,
              backgroundColor: theme.palette.background.light,
              boxSizing: "border-box",
              borderWidth: isNonMobile ? 0 : "2px",
              width: drawerWidth,
            },
          }}
        >
          <Box width="100%">
            <Box m="1.5rem 2rem 2rem 3rem">
              <FlexBetween color={theme.palette.grey[300]}>
                <Box display="flex" alignItems="center" gap="0.5rem">
                  <Box
                    component="img"
                    src={ShantelLogo}
                    alt="Logo"
                    sx={{
                      width: "40px",
                    }}
                  />
                  <Typography variant="h4" fontWeight="bold">
                    Shantel Ticket
                  </Typography>
                </Box>
                {!isNonMobile && (
                  <IconButton onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
                    <ChevronLeft sx={{ color: theme.palette.grey[300] }} />
                  </IconButton>
                )}
              </FlexBetween>
            </Box>
            <List>
              {navItems.map(({ text, icon, link }) => {
                if (!icon) {
                  return (
                    <Typography key={text} sx={{ m: "2.25rem 0 1rem 3rem", color: theme.palette.grey[300] }}>
                      {text}
                    </Typography>
                  );
                }
                return (
                  <ListItem key={text} disablePadding>
                    <ListItemButton
                      onClick={() => {
                        navigate("/" + link);
                        setActive(link);
                      }}
                      sx={{
                        backgroundColor: active === link ? theme.palette.primary[400] : "transparent",
                        color: active === link ? theme.palette.primary[900] : theme.palette.grey[300],
                        ":hover": { color: theme.palette.primary.main, "& .MuiSvgIcon-root": { color: theme.palette.primary.main } },
                      }}
                    >
                      <ListItemIcon
                        sx={{
                          ml: "2rem",
                          color: active === link ? theme.palette.primary[900] : theme.palette.grey[300],
                        }}
                      >
                        {icon}
                      </ListItemIcon>
                      <ListItemText primary={text} />
                      {active === link && <ChevronRightOutlined sx={{ ml: "auto" }} />}
                    </ListItemButton>
                  </ListItem>
                );
              })}
            </List>
          </Box>
        </Drawer>
      )}
    </Box>
  );
};

export default Sidebar;
