import { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Box, useTheme, IconButton, Tooltip, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";

import useHttp from "../../hooks/use-http";
import TextOrInput from "../../components/TextOrInput";
import TaskColumn from "../../components/TaskColumn";
import NewPostDialog from "../../components/dialogs/NewPostDialog";
import PostDetailsDialog from "../../components/dialogs/PostDetailsDialog";

const serverAddress = process.env.ENVIRONMENT === "production" ? process.env.REACT_APP_PROD_BASE_URL : process.env.REACT_APP_DEV_BASE_URL;

const ProjectDetails = () => {
  const theme = useTheme();
  const { projectId } = useParams();
  const { isLoading, error, sendRequest } = useHttp();
  const [data, setData] = useState("");
  const [selectedPost, setSelectedPost] = useState(null);
  const [openNewPostDialog, setOpenNewPostDialog] = useState(false);
  const [openSelectedPostDialog, setOpenSelectedPostDialog] = useState(false);

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
        console.log("project:", projectData);
        setData(projectData);
      }
    );
  }, [sendRequest, projectId]);

  const rowClickHandle = async (params) => {
    console.log(params.row);
    setSelectedPost(params.row);
    setOpenSelectedPostDialog(true);
  };

  const tableButtonClickHandle = async (params) => {
    let nextStep = "";
    let groupTitle = "";
    let groupId = null;
    let taskId = null;
    if (params.progressLevel === "doneCheck") {
      nextStep = "pendingWrite";
      groupTitle = "Article Writing";
    } else if (params.progressLevel === "doneWrite") {
      nextStep = "pendingPublish";
      groupTitle = "Post Publishing";
    }
    for (const group of data.groups) {
      if (group.title === groupTitle) {
        groupId = group._id;
        break;
      }
    }

    // If group is not already in project create new group
    if (!groupId && !isLoading && !error) {
      // create new task group for next step
      await sendRequest(
        {
          url: `/postTaskGroups`,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: {
            title: groupTitle,
            project: projectId,
          },
        },
        (groupData) => {
          console.log("group:", groupData);
          groupId = groupData._id;
        }
      );
    }

    // Create new task for next step
    if (groupId && !isLoading && !error) {
      await sendRequest(
        {
          url: `/postTasks`,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: {
            title: params.title,
            dueTime: params.urgencyLevel,
            post: params._id,
            group: groupId,
          },
        },
        (taskData) => {
          console.log("task:", taskData);
          taskId = taskData._id;
        }
      );
    }

    // Change progress level if group and task are successfully created
    if (groupId && taskId && !isLoading && !error) {
      await sendRequest(
        {
          url: `/postRequests/${params._id}`,
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: {
            progressLevel: nextStep,
          },
        },
        (postData) => {
          console.log("post", postData);
        }
      );
    }

    // Refresh project details
    if (!isLoading && !error) {
      await sendRequest(
        {
          url: `/projects/${projectId}`,
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
        (projectData) => {
          console.log("project:", projectData);
          setData(projectData);
        }
      );
    }
  };

  const saveTitleHandler = async (text) => {
    // save updated project title
    if (!isLoading && !error) {
      await sendRequest(
        {
          url: `/projects/${projectId}`,
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: {
            title: text,
          },
        },
        (projectData) => {
          console.log(projectData);
        }
      );
      console.log(text);
    }
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
      renderCell: (params) => {
        let linkStatusColor = theme.palette.grey.main;
        switch (params.value) {
          case "Odobren":
            linkStatusColor = theme.palette.primary.main;
            break;
          case "Semafor":
            linkStatusColor = "#eddd50";
            break;
          case "Pijaca":
            linkStatusColor = "#b14fea";
            break;
          case "Odbijen":
            linkStatusColor = "#e84e4e";
            break;
          default:
            linkStatusColor = theme.palette.grey.main;
        }
        return (
          <Typography color={linkStatusColor} fontSize="0.75rem">
            {params.value}
          </Typography>
        );
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
        let ready = false;
        switch (params.value) {
          case "pendingCheck":
            buttonText = "Waiting For Check";
            break;
          case "doneCheck":
            buttonText = "Send to Write";
            ready = true;
            break;
          case "pendingWrite":
            buttonText = "Waiting For Write";
            break;
          case "doneWrite":
            buttonText = "Send to Publish";
            ready = true;
            break;
          case "pendingPublish":
            buttonText = "Waiting For Publish";
            break;
          case "donePublish":
            buttonText = "Published";
            break;
          default:
            buttonText = "";
        }
        return ready > 0 ? (
          <Button
            variant="contained"
            disabled={isLoading}
            onClick={(e) => {
              e.stopPropagation();
              tableButtonClickHandle(params.row);
            }}
          >
            {buttonText}
          </Button>
        ) : buttonText.length > 0 ? (
          <Button
            disabled
            sx={{
              color: "#000 !important",
              backgroundColor: theme.palette.grey[600],
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
      <Box m="2.5rem">
        {data && !isLoading && (
          <Box display="flex">
            <TextOrInput fontSize="20px" textValue={data.title} callback={saveTitleHandler} />
            <Tooltip title="Add new post" placement="top" arrow>
              <IconButton
                onClick={() => {
                  setOpenNewPostDialog(true);
                }}
              >
                <Add
                  sx={{
                    color: theme.palette.grey.main,
                    fontSize: "30px",
                    border: `1px solid ${theme.palette.grey.main}`,
                    borderRadius: "5px",
                    ":hover": {
                      color: theme.palette.grey[900],
                      backgroundColor: theme.palette.grey.main,
                    },
                  }}
                />
              </IconButton>
            </Tooltip>
          </Box>
        )}
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
            // "& .new-project": {
            //   backgroundColor: "#34488e",
            // },
            // "& .in-progress-project": {
            //   backgroundColor: theme.palette.secondary[700],
            // },
            // "& .closed-project": {
            //   backgroundColor: "#913232",
            // },
          }}
        >
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
      {data && !isLoading && (
        <Box display="flex" m="2.5rem">
          {data.groups.map((c) => {
            return <TaskColumn key={c._id} column={c} />;
          })}
        </Box>
      )}
      <NewPostDialog title="Add New Post" open={openNewPostDialog} setOpen={setOpenNewPostDialog} project={data} setProject={setData} />
      <PostDetailsDialog post={selectedPost} setPost={setSelectedPost} open={openSelectedPostDialog} setOpen={setOpenSelectedPostDialog} project={data} setProject={setData} />
    </Fragment>
  );
};

export default ProjectDetails;
