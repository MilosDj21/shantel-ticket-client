import { Fragment, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Box, Typography, useTheme, useMediaQuery, Divider, Select, MenuItem, FormControl, IconButton, Tooltip } from "@mui/material";
import { SettingsOutlined, Delete } from "@mui/icons-material";
import parse from "html-react-parser";

import useHttp from "../../hooks/use-http";
import TextEditor from "../../components/TextEditor";
import FlexBetween from "../../components/FlexBetween";

const serverAddress = process.env.ENVIRONMENT === "production" ? process.env.REACT_APP_PROD_BASE_URL : process.env.REACT_APP_DEV_BASE_URL;

const ProjectDetails = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const userId = useSelector((state) => state.userId);
  const { projectId } = useParams();
  const { isLoading, sendRequest } = useHttp();
  const [data, setData] = useState("");
  const [search, setSearch] = useState("");

  // RETRIEVE INITIAL DATA FROM SERVER
  useEffect(() => {
    sendRequest(
      {
        url: `/projects/${projectId}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
      (projectData) => {
        console.log(projectData);
        setData(projectData);
      }
    );
  }, [sendRequest, projectId]);

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
        // setData(tasksData);
      }
    );
  };

  const rowClickHandle = async (params) => {
    navigate(`/postRequests/${params.id}`);
  };

  const buttonClickHandle = async (params) => {
    console.log(params);
  };

  const columns = [
    {
      field: "_id",
      headerName: "ID",
      flex: 0.2,
    },
    {
      field: "title",
      headerName: "Title",
      flex: 1,
    },
    {
      field: "website",
      headerName: "Website",
      flex: 0.7,
      renderCell: (params) => {
        return params.value.url;
      },
    },
    {
      field: "editor",
      headerName: "Editor",
      flex: 0.2,
      renderCell: (params) => {
        return params.value?.profileImage ? (
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
        ) : (
          ""
        );
      },
    },
    {
      field: "copywriter",
      headerName: "Writer",
      flex: 0.2,
      renderCell: (params) => {
        return params.value?.profileImage ? (
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
        ) : (
          ""
        );
      },
    },
    {
      field: "anchorKeyword",
      headerName: "Anchor",
      flex: 0.5,
    },
    {
      field: "clientPaidLink",
      headerName: "Client Link",
      flex: 1,
      renderCell: (params) => {
        return params.value.url;
      },
    },
    {
      field: "linkCategory",
      headerName: "Link Status",
      flex: 0.4,
      valueGetter: (params) => {
        return params.row.clientPaidLink.status;
      },
    },
    {
      field: "textLink",
      headerName: "Text",
      flex: 0.7,
    },
    {
      field: "postLink",
      headerName: "Post URL",
      flex: 0.7,
    },
    {
      field: "urgencyLevel",
      headerName: "Urg. Lvl",
      flex: 0.4,
    },
    {
      field: "wordNum",
      headerName: "Word Num",
      flex: 0.3,
    },
    {
      field: "progressLevel",
      headerName: "Next Step",
      flex: 0.7,
      renderCell: (params) => {
        let buttonText = "";
        switch (params.value) {
          case "doneCheck":
            buttonText = "Send to Write";
            break;
          case "doneWrite":
            buttonText = "Send to Publish";
            break;
          default:
            buttonText = "";
        }
        return buttonText.length > 0 ? (
          <Button
            onClick={(e) => {
              e.stopPropagation();
              buttonClickHandle(params.id);
            }}
          >
            {buttonText}
          </Button>
        ) : (
          ""
        );
      },
    },
  ];

  return (
    <Fragment>
      <Box m="2.5rem 2.5rem">
        <Box
          height="55vh"
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
          }}
        >
          <Typography variant="h3" mb="2rem">
            {data.title}
          </Typography>
          <DataGrid
            loading={isLoading || !data}
            getRowId={(row) => row._id}
            rows={data.postRequests || []}
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
      {/* TASKS DETAILS */}
      {/* {data && !isLoading && <Box display="flex" m="2.5rem 2.5rem" backgroundColor="grey" height="20vh"></Box>} */}
    </Fragment>
  );
};

export default ProjectDetails;
