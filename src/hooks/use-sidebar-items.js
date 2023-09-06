import { HomeOutlined, Person, SupervisorAccount, Description } from "@mui/icons-material";
import { useCallback } from "react";

import useHttp from "../hooks/use-http";

const useSidebarItems = () => {
  const { sendRequest } = useHttp();

  const getSidebarItems = useCallback(
    async (userRoles) => {
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

      const saveRole = (roleData) => {
        rolesNames.push(roleData.name);
      };

      for (const r of userRoles) {
        await sendRequest(
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

      finishedItems.push(...commonItems);

      if (rolesNames.includes("Super Admin")) {
        finishedItems.push(...adminItems);
      } else if (rolesNames.includes("Admin")) {
        finishedItems.push(...adminItems);
      } else if (rolesNames.includes("Amazon Leader")) {
      } else if (rolesNames.includes("Amazon")) {
      } else if (rolesNames.includes("Manager Leader")) {
      } else if (rolesNames.includes("Manager")) {
      } else if (rolesNames.includes("Editor Leader")) {
      } else if (rolesNames.includes("Editor")) {
      } else if (rolesNames.includes("Copywrighter")) {
      } else if (rolesNames.includes("Website Checker")) {
      }
      return finishedItems;
    },
    [sendRequest]
  );

  return getSidebarItems;
};

export default useSidebarItems;
