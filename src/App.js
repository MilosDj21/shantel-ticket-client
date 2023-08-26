import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import React, { useMemo } from "react";
import { createTheme } from "@mui/material/styles";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { themeSettings } from "./theme";
import Login from "./pages/Login";
import AllUsers from "./pages/admin/AllUsers";
import NewUser from "./pages/admin/NewUser";
import UserDetails from "./pages/admin/UserDetails";
import AllTickets from "./pages/tech-ticket/AllTickets";
import NewTicket from "./pages/tech-ticket/NewTicket";
import TicketDetails from "./pages/tech-ticket/TicketDetails";
import RootLayout from "./pages/RootLayout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        path: "tickets",
        element: <Outlet />,
        children: [
          { index: true, element: <AllTickets /> },
          { path: "new", element: <NewTicket /> },
          { path: ":ticketId", element: <TicketDetails /> },
        ],
      },
      {
        path: "users",
        element: <Outlet />,
        children: [
          { index: true, element: <AllUsers /> },
          { path: "new", element: <NewUser /> },
          { path: ":userId", element: <UserDetails /> },
        ],
      },
    ],
  },
  { path: "login", element: <Login /> },
]);

function App() {
  const theme = useMemo(() => createTheme(themeSettings), []);

  return (
    <div className="app">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider router={router} />
        <ToastContainer />
      </ThemeProvider>
    </div>
  );
}

export default App;
