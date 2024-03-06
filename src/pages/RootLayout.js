import React, { Fragment, useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router";
import { useMediaQuery, Box } from "@mui/material";
import { useSelector, useDispatch } from "react-redux";

import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { socket } from "../socket";
import { socketActions } from "../store/socket";

const RootLayout = () => {
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const dispatch = useDispatch();
  const userId = useSelector((state) => state.auth.userId);
  const navigate = useNavigate();

  useEffect(() => {
    if (!userId) {
      navigate("/login");
    }
  }, [userId, navigate]);

  useEffect(() => {
    const onRecieveSocketId = (socketId) => {
      console.log(socketId);
      // Connect current user with socket
      socket.emit("connectWithDb", {
        dbUserId: userId,
        socketUserId: socketId,
      });
    };

    const onPrivateMessage = (message) => {
      dispatch(socketActions.addNotification(message));
      // dispatch(socketActions.addNotification(JSON.parse(message)));
    };
    socket.on("privateMessage", onPrivateMessage);
    socket.on("recieveSocketId", onRecieveSocketId);

    return () => {
      socket.off("privateMessage", onPrivateMessage);
      socket.off("recieveSocketId", onRecieveSocketId);
    };
  });

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
