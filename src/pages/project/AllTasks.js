import { Box, useTheme, Tooltip } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import TableHeader from "../../components/TableHeader";
import TaskMessagesDialog from "../../components/dialogs/TaskMessagesDialog";
import useHttp from "../../hooks/use-http";

const serverAddress = process.env.ENVIRONMENT === "production" ? process.env.REACT_APP_PROD_BASE_URL : process.env.REACT_APP_DEV_BASE_URL;

const AllTasks = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { isLoading, sendRequest } = useHttp();
  const [tasks, setTasks] = useState([]);
  const [search, setSearch] = useState("");
  const userId = useSelector((state) => state.auth.userId);
  const [selectedTask, setSelectedTask] = useState(null);
  const [openSelectedTaskDialog, setOpenSelectedTaskDialog] = useState(null);

  useEffect(() => {
    sendRequest(
      {
        url: "/postTasks",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
      (tasksData) => {
        console.log(tasksData);
        setTasks(tasksData);
      },
    );
  }, [sendRequest]);

  const searchInput = (event) => {
    setSearch(event.target.value);
  };

  const searchHandle = async () => {
    console.log(search);
    sendRequest(
      {
        url: search ? `/postTasks/search/${search}` : "/postTasks",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
      (tasksData) => {
        setTasks(tasksData);
      },
    );
  };

  const rowClickHandle = async (params) => {
    // console.log(params);
    for (const t of tasks) {
      if (t._id === params.row._id) {
        setSelectedTask(t);
        setOpenSelectedTaskDialog(true);
      }
    }
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
      valueGetter: (params) => {
        if (params.row.post) {
          return params.row.post.title;
        } else {
          return null;
        }
      },
    },
    {
      field: "clientWebsite",
      headerName: "Client Website",
      flex: 0.5,
      valueGetter: (params) => {
        if (params.row.post.clientLink) {
          if (params.row.post.clientLink.clientWebsite) {
            return params.row.post.clientLink.clientWebsite.url;
          }
        }
        return null;
      },
    },
    {
      field: "user",
      headerName: "User",
      flex: 0.2,
      valueGetter: (params) => {
        try {
          return params.row.post.project.user;
        } catch (error) {
          return null;
        }
      },
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
      field: "status",
      headerName: "Status",
      flex: 0.3,
      cellClassName: (params) => {
        if (params.value === "New") return "new-task";
        if (params.value === "In Progress") return "in-progress-task";
        if (params.value === "Closed") return "closed-task";
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
      <TableHeader title="Tasks" subtitle={`${tasks.length} Tasks`} searchInput={searchInput} searchHandle={searchHandle} />
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
          "& .new-task": {
            backgroundColor: "#34488e",
          },
          "& .in-progress-task": {
            backgroundColor: theme.palette.secondary[700],
          },
          "& .closed-task": {
            backgroundColor: "#913232",
          },
        }}>
        <DataGrid
          loading={isLoading || !tasks}
          getRowId={(row) => row._id}
          rows={tasks || []}
          columns={columns}
          onRowClick={rowClickHandle}
          initialState={{
            sorting: {
              sortModel: [{ field: "status", sort: "desc" }],
            },
          }}
        />
      </Box>
      {openSelectedTaskDialog && <TaskMessagesDialog task={selectedTask} setTask={setSelectedTask} open={openSelectedTaskDialog} setOpen={setOpenSelectedTaskDialog} setTasks={setTasks} />}
    </Box>
  );
};
export default AllTasks;
