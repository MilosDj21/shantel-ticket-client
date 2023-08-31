import React, { Fragment, useEffect, useState } from "react";
import { useSelector } from "react-redux";
import useHttp from "../hooks/use-http";
import { Outlet, Navigate } from "react-router-dom";

const ProtectedRoutes = () => {
  const userRoles = useSelector((state) => state.roles);
  const { sendRequest } = useHttp();
  const [isLoading, setIsLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const request = async () => {
      for (const role of userRoles) {
        await sendRequest(
          {
            url: `/roles/${role}`,
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
          (roleData) => {
            if (roleData.name === "Super Admin" || roleData.name === "Admin") {
              setIsAdmin(true);
            }
          }
        );
      }
      setIsLoading(false);
    };
    request();
  }, [sendRequest, userRoles, isAdmin]);

  return <Fragment>{!isLoading && (isAdmin ? <Outlet /> : <Navigate to="/" replace />)}</Fragment>;
};

export default ProtectedRoutes;
