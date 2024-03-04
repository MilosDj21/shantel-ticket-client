import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Box, useTheme, Tooltip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";

import useHttp from "../../../hooks/use-http";
import TableHeader from "../../../components/TableHeader";

const serverAddress = process.env.ENVIRONMENT === "production" ? process.env.REACT_APP_PROD_BASE_URL : process.env.REACT_APP_DEV_BASE_URL;

const AllTickets = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const userEmail = useSelector((state) => state.auth.email);
  const [data, setData] = useState([]);
  const { isLoading, sendRequest } = useHttp();
  const [search, setSearch] = useState("");

  useEffect(() => {
    // TODO: Interval should be set only if user is TV where monitoring will be
    let intervalId = null;
    if (userEmail === "monitoringTv@aaa.sss") {
      intervalId = setInterval(async () => {
        sendRequest(
          {
            url: "/techTickets",
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
          (ticketsData) => {
            setData(ticketsData);
          },
        );
      }, 60000);
    } else {
      sendRequest(
        {
          url: "/techTickets",
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
        (ticketsData) => {
          setData(ticketsData);
        },
      );
    }
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [sendRequest, userEmail]);

  const searchInput = (event) => {
    setSearch(event.target.value);
  };

  const searchHandle = async () => {
    const getTickets = (ticketsData) => {
      setData(ticketsData);
    };

    if (search) {
      sendRequest(
        {
          url: `/techTickets/search/${search}`,
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
        getTickets,
      );
    } else {
      sendRequest(
        {
          url: "/techTickets",
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
        getTickets,
      );
    }
  };

  const rowClickHandle = async (params) => {
    navigate(`/admin/tickets/${params.id}`);
  };

  const columns = [
    {
      field: "_id",
      headerName: "ID",
      flex: 0.5,
    },
    {
      field: "title",
      headerName: "Title",
      flex: 1,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 0.3,
      cellClassName: (params) => {
        if (params.value === "New") return "new-ticket";
        if (params.value === "In Progress") return "in-progress-ticket";
        if (params.value === "Closed") return "closed-ticket";
        else return "";
      },
    },
    {
      field: "category",
      headerName: "Category",
      flex: 0.4,
    },
    {
      field: "user",
      headerName: "User",
      flex: 0.2,
      renderCell: (params) => {
        return (
          <Tooltip title={params.value.firstName} placement="top" arrow>
            <Box
              component="img"
              alt="profile"
              src={serverAddress + "/" + params.value.profileImage}
              crossOrigin="use-credentials"
              height="32px"
              width="32px"
              borderRadius="50%"
              sx={{ objectFit: "cover" }}
            />
          </Tooltip>
        );
      },
    },
    {
      field: "messages",
      headerName: "Last Reply",
      flex: 0.2,
      renderCell: (params) => {
        const lastItem = params.value[params.value.length - 1];
        return lastItem ? (
          <Tooltip title={lastItem.user.firstName} placement="top" arrow>
            <Box
              component="img"
              alt="profile"
              src={serverAddress + "/" + lastItem.user.profileImage}
              crossOrigin="use-credentials"
              height="32px"
              width="32px"
              borderRadius="50%"
              sx={{ objectFit: "cover" }}
            />
          </Tooltip>
        ) : (
          ""
        );
      },
    },
    {
      field: "updatedAt",
      headerName: "Updated At",
      flex: 0.5,
      renderCell: (params) => {
        const date = new Date(params.value);
        const day = String(date.getDate()).padStart(2, "0");
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const year = date.getFullYear();
        const hour = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");
        const seconds = String(date.getSeconds()).padStart(2, "0");
        return `${day}-${month}-${year} ${hour}:${minutes}:${seconds}`;
      },
    },
  ];

  return (
    <Box m="2.5rem 2.5rem">
      <TableHeader title="All Tickets" subtitle={`${data.length} Tickets`} searchInput={searchInput} searchHandle={searchHandle} />
      <Box
        mt="40px"
        height="75vh"
        sx={{
          "& .MuiDataGrid-root": {
            color: theme.palette.grey[300],
            border: "none",
            cursor: "pointer",
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
          "& .new-ticket": {
            backgroundColor: "#34488e",
          },
          "& .in-progress-ticket": {
            backgroundColor: theme.palette.secondary[700],
          },
          "& .closed-ticket": {
            backgroundColor: "#913232",
          },
        }}>
        <DataGrid
          loading={isLoading || !data}
          getRowId={(row) => row._id}
          rows={data || []}
          columns={columns}
          onRowClick={rowClickHandle}
          initialState={{
            sorting: {
              sortModel: [{ field: "updatedAt", sort: "desc" }],
            },
          }}
        />
      </Box>
    </Box>
  );
};

export default AllTickets;
