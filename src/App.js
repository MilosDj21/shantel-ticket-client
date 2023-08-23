import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
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
      { path: "login", element: <Login /> },
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
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;
