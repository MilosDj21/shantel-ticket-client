import React from "react";
import { LightModeOutlined, DarkModeOutlined, Menu as MenuIcon, Search, SettingsOutlined, ArrowDropDownOutlined } from "@mui/icons-material";
import FlexBetween from "./FlexBetween";
import { useDispatch } from "react-redux";
import profileImage from "../assets/profile.jpg";
import { AppBar, IconButton, InputBase, Toolbar, useTheme } from "@mui/material";

const Navbar = ({ isSidebarOpen, setIsSidebarOpen }) => {
  const theme = useTheme();
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
          <FlexBetween backgroundColor={theme.palette.background.light} borderRadius="9px" gap="3rem" p="0.1rem 1.5rem">
            <InputBase
              placeholder="Search..."
              sx={{
                color: theme.palette.grey[300],
              }}
            />
            <IconButton>
              <Search
                sx={{
                  color: theme.palette.grey.main,
                }}
              />
            </IconButton>
          </FlexBetween>
        </FlexBetween>
        <FlexBetween gap="0.5rem">
          {/* TODO: 1:00:22 crvena, 45:02 zelena  */}
          <IconButton>
            <SettingsOutlined
              sx={{
                color: theme.palette.grey.main,
              }}
            />
          </IconButton>
        </FlexBetween>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
