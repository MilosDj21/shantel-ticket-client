import { HomeOutlined, Person, SupervisorAccount, Description, Assignment } from "@mui/icons-material";
import { useCallback } from "react";

const useSidebarItems = () => {
  const getSidebarItems = useCallback(async (userRoles) => {
    const rolesNames = [];
    const finishedItems = [];

    const commonItems = [
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
        text: "My Tickets",
        icon: <Description />,
        link: "tickets",
      },
      {
        text: "New Ticket",
        icon: <Description />,
        link: "tickets/new",
      },
    ];
    const salesItems = [
      {
        text: "Projects",
        icon: null,
        link: null,
      },
      {
        text: "All Projects",
        icon: <Assignment />,
        link: "projects",
      },
      {
        text: "New Project",
        icon: <Assignment />,
        link: "projects/new",
      },
    ];
    const websiteCheckerItems = [
      {
        text: "Tasks",
        icon: null,
        link: null,
      },
      {
        text: "All Tasks",
        icon: <Assignment />,
        link: "tasks",
      },
      // {
      //   text: "New Project",
      //   icon: <Assignment />,
      //   link: "projects/new",
      // },
    ];
    const adminItems = [
      {
        text: "Admin",
        icon: null,
        link: null,
      },
      {
        text: "All Users",
        icon: <SupervisorAccount />,
        link: "admin/users",
      },
      {
        text: "New User",
        icon: <Person />,
        link: "admin/users/new",
      },
      {
        text: "All Tickets",
        icon: <Description />,
        link: "admin/tickets",
      },
      {
        text: "New Admin Ticket",
        icon: <Description />,
        link: "admin/tickets/new",
      },
    ];

    for (const r of userRoles) {
      rolesNames.push(r.name);
    }

    finishedItems.push(...commonItems);

    if (rolesNames.includes("Super Admin")) {
      finishedItems.push(...salesItems);
      finishedItems.push(...adminItems);
    } else if (rolesNames.includes("Admin")) {
      finishedItems.push(...salesItems);
      finishedItems.push(...adminItems);
    } else if (rolesNames.includes("Amazon Leader")) {
    } else if (rolesNames.includes("Amazon")) {
    } else if (rolesNames.includes("Sales Leader")) {
      finishedItems.push(...salesItems);
    } else if (rolesNames.includes("Sales")) {
      finishedItems.push(...salesItems);
    } else if (rolesNames.includes("Editor Leader")) {
    } else if (rolesNames.includes("Editor")) {
    } else if (rolesNames.includes("Copywrighter")) {
    } else if (rolesNames.includes("Website Checker")) {
      finishedItems.push(...websiteCheckerItems);
    }
    return finishedItems;
  }, []);

  return getSidebarItems;
};

export default useSidebarItems;
