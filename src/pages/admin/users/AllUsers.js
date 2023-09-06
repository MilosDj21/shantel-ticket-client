import React, { useEffect, useState } from "react";
import { Box, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";

import useHttp from "../../../hooks/use-http";
import TableHeader from "../../../components/TableHeader";

const AllUsers = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const { isLoading, sendRequest } = useHttp();
  const [search, setSearch] = useState("");

  useEffect(() => {
    const getUsers = (usersData) => {
      setData(usersData);
    };

    sendRequest(
      {
        url: "/users",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
      getUsers
    );
  }, [sendRequest]);

  const searchInput = (event) => {
    setSearch(event.target.value);
  };

  const searchHandle = async () => {
    const getUsers = (usersData) => {
      setData(usersData);
    };

    if (search) {
      sendRequest(
        {
          url: `/users/search/${search}`,
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
        getUsers
      );
    } else {
      sendRequest(
        {
          url: "/users",
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
        getUsers
      );
    }
  };

  const rowClickHandle = async (params) => {
    navigate(`/users/${params.id}`);
  };

  const columns = [
    {
      field: "_id",
      headerName: "ID",
      flex: 1,
    },
    {
      field: "email",
      headerName: "Email",
      flex: 1,
    },
    {
      field: "roles",
      headerName: "Roles",
      flex: 1,
    },
    {
      field: "firstName",
      headerName: "First Name",
      flex: 1,
    },
    {
      field: "lastName",
      headerName: "Last Name",
      flex: 1,
    },
  ];

  return (
    <Box m="2.5rem 2.5rem">
      <TableHeader title="Users" subtitle={`${data.length} Users`} searchInput={searchInput} searchHandle={searchHandle} />
      <Box
        mt="40px"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            color: theme.palette.grey[300],
            border: "none",
          },
          "& .MuiDataGrid-cell": {
            borderBottom: `1px solid ${theme.palette.grey[800]} !important`,
          },
          "& .MuiDataGrid-columnHeaders": {
            borderBottom: `1px solid ${theme.palette.grey[800]} !important`,
          },
          "& .MuiDataGrid-columnSeparator": {
            visibility: "hidden",
          },
          "& .MuiTablePagination-root": {
            color: theme.palette.grey[300],
          },
          "& .MuiSelect-icon": {
            color: theme.palette.grey[300],
          },
          "& .MuiIconButton-root": {
            color: `${theme.palette.grey[300]} !important`,
          },
        }}
      >
        <DataGrid loading={isLoading || !data} getRowId={(row) => row._id} rows={data || []} columns={columns} onRowClick={rowClickHandle} />
      </Box>
    </Box>
  );
};

export default AllUsers;
