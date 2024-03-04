import React, { useEffect, useState } from "react";
import { Box, useTheme } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

import useHttp from "../../hooks/use-http";
import TableHeader from "../../components/TableHeader";

const AllProjects = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [data, setData] = useState([]);
  const { isLoading, sendRequest } = useHttp();
  const [search, setSearch] = useState("");
  const userId = useSelector((state) => state.auth.userId);

  useEffect(() => {
    sendRequest(
      {
        url: `/projects`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
      (projectsData) => {
        console.log(projectsData);
        setData(projectsData);
      },
    );
  }, [sendRequest, userId]);

  const searchInput = (event) => {
    setSearch(event.target.value);
  };

  const searchHandle = async () => {
    console.log(search);
    sendRequest(
      {
        url: search ? `/projects/search/${search}` : "/projects",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
      (projectsData) => {
        setData(projectsData);
      },
    );
  };

  const rowClickHandle = async (params) => {
    navigate(`/projects/${params.id}`);
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
        if (params.value === "New") return "new-project";
        if (params.value === "In Progress") return "in-progress-project";
        if (params.value === "Closed") return "closed-project";
        else return "";
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
      <TableHeader title="Projects" subtitle={`${data.length} Projects`} searchInput={searchInput} searchHandle={searchHandle} />
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
          "& .new-project": {
            backgroundColor: "#34488e",
          },
          "& .in-progress-project": {
            backgroundColor: theme.palette.secondary[700],
          },
          "& .closed-project": {
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

export default AllProjects;
