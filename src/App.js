import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import React, { useMemo, useEffect, useState } from "react";
import { createTheme } from "@mui/material/styles";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { useDispatch } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { themeSettings } from "./theme";
import Login from "./pages/Login";
import AllUsers from "./pages/admin/users/AllUsers";
import NewUser from "./pages/admin/users/NewUser";
import UserDetails from "./pages/admin/users/UserDetails";
import AdminAllTickets from "./pages/admin/tech-ticket/AllTickets";
import AdminNewTicket from "./pages/admin/tech-ticket/NewTicket";
import AdminTicketDetails from "./pages/admin/tech-ticket/TicketDetails";
import MyTickets from "./pages/tech-ticket/AllTickets";
import NewTicket from "./pages/tech-ticket/NewTicket";
import TicketDetails from "./pages/tech-ticket/TicketDetails";
import RootLayout from "./pages/RootLayout";
import Dashboard from "./pages/Dashboard";
import ProtectedRoutes from "./components/ProtectedRoutes";
import { authActions } from "./store/auth";
import EditTicket from "./pages/admin/tech-ticket/EditTicket";
import EditMessage from "./pages/admin/tech-ticket/EditMessage";
import AllProjects from "./pages/project/AllProjects";
import NewProject from "./pages/project/NewProject";
import ProjectDetails from "./pages/project/ProjectDetails";
import AllTasks from "./pages/project/AllTasks";

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
          { index: true, element: <MyTickets /> },
          { path: "new", element: <NewTicket /> },
          { path: ":ticketId", element: <TicketDetails /> },
        ],
      },
      {
        path: "projects",
        element: <Outlet />,
        children: [
          { index: true, element: <AllProjects /> },
          { path: "new", element: <NewProject /> },
          { path: ":projectId", element: <ProjectDetails /> },
        ],
      },
      {
        path: "tasks",
        element: <Outlet />,
        children: [
          { index: true, element: <AllTasks /> },
          // { path: "new", element: <NewProject /> },
          // { path: ":projectId", element: <ProjectDetails /> },
        ],
      },
      {
        path: "admin",
        element: <ProtectedRoutes />,
        children: [
          {
            path: "users",
            element: <Outlet />,
            children: [
              { index: true, element: <AllUsers /> },
              { path: "new", element: <NewUser /> },
              { path: ":userId", element: <UserDetails /> },
            ],
          },
          {
            path: "tickets",
            element: <Outlet />,
            children: [
              { index: true, element: <AdminAllTickets /> },
              { path: "new", element: <AdminNewTicket /> },
              { path: "edit/:ticketId", element: <EditTicket /> },
              { path: "message/edit/:messageId", element: <EditMessage /> },
              { path: ":ticketId", element: <AdminTicketDetails /> },
            ],
          },
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
