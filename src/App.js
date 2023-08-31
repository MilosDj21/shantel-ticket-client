import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import React, { useMemo, useEffect, useState } from "react";
import { createTheme } from "@mui/material/styles";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { useDispatch } from "react-redux";
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
import Dashboard from "./pages/Dashboard";
import ProtectedRoutes from "./components/ProtectedRoutes";
import { authActions } from "./store/auth";

const router = createBrowserRouter([
  {
    path: "/",
    element: <RootLayout />,
    children: [
      { index: true, element: <Dashboard /> },
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
        element: <ProtectedRoutes />,
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
  const dispatch = useDispatch();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (user !== null) {
      dispatch(authActions.login(JSON.parse(user)));
    }
    setIsLoading(false);
  }, [dispatch]);

  return (
    <div className="app">
      {!isLoading && (
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <RouterProvider router={router} />
          <ToastContainer />
        </ThemeProvider>
      )}
    </div>
  );
}

export default App;
