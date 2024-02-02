import { Fragment, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { DataGrid } from "@mui/x-data-grid";
import { Button, Box, Typography, useTheme, useMediaQuery, Divider, Select, MenuItem, FormControl, IconButton, Tooltip } from "@mui/material";
import { Add } from "@mui/icons-material";
import parse from "html-react-parser";

import useHttp from "../../hooks/use-http";
import FlexBetween from "../../components/FlexBetween";
import TextOrInput from "../../components/TextOrInput";
import TaskColumn from "../../components/TaskColumn";
import NewPostDialog from "../../components/NewPostDialog";

const serverAddress = process.env.ENVIRONMENT === "production" ? process.env.REACT_APP_PROD_BASE_URL : process.env.REACT_APP_DEV_BASE_URL;

const ProjectDetails = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const userId = useSelector((state) => state.userId);
  const { projectId } = useParams();
  const { isLoading, sendRequest } = useHttp();
  const { sendRequest: saveTitleSendRequest } = useHttp();
  const { sendRequest: changeProgressSendRequest } = useHttp();
  const { sendRequest: createGroupSendRequest } = useHttp();
  const { sendRequest: createTaskSendRequest } = useHttp();
  const { sendRequest: createPostSendRequest } = useHttp();
  const { sendRequest: createWebsiteSendRequest } = useHttp();
  const [data, setData] = useState("");
  const [search, setSearch] = useState("");
  const [openDialog, setOpenDialog] = useState(false);

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

  const confirmDialogHandle = async (postTitle, website, postCategory, anchor, link, urgency, wordNum, clientHasText) => {
    // TODO: treba da se implementira da cuva prvo sajt, i onda taj id od sajta da se ubaci u post
    // createWebsiteSendRequest(
    //   {
    //     url: `/websites`,
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: {
    //       title: postTitle,
    //       website,
    //       postCategory,
    //       anchor,
    //       clientPaidLink: link,
    //       urgencyLevel: urgency,
    //       wordNum,
    //       project: projectId,
    //       clientHasText,
    //     },
    //   },
    //   (postData) => {
    //     console.log("post:", postData);
    //   }
    // );
    // createPostSendRequest(
    //   {
    //     url: `/postRequests`,
    //     method: "POST",
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //     body: {
    //       title: postTitle,
    //       website,
    //       postCategory,
    //       anchor,
    //       clientPaidLink: link,
    //       urgencyLevel: urgency,
    //       wordNum,
    //       project: projectId,
    //       clientHasText,
    //     },
    //   },
    //   (postData) => {
    //     console.log("post:", postData);
    //   }
    // );
    console.log(postTitle, website, postCategory, anchor, link, urgency, wordNum, clientHasText);
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
    let nextStep = "";
    let groupTitle = "";
    let groupId = null;
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
      }
    }

    const createTask = (finalGroupId) => {
      // create new task for next step
      createTaskSendRequest(
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
            group: finalGroupId,
          },
        },
        (taskData) => {
          // TODO: privremeno resenje posto kad se kreira novi ne povlaci poruke
          taskData.messages = [];
          for (const group of data.groups) {
            if (group._id === finalGroupId) {
              group.tasks.push(taskData);
            }
          }
          console.log("task:", taskData);
        }
      );
    };

    // change progress level
    changeProgressSendRequest(
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
        for (const post of data.postRequests) {
          if (post._id === params._id) {
            post.progressLevel = nextStep;
          }
        }
        // if group is not already in project create new group
        if (!groupId) {
          // create new task group for next step
          createGroupSendRequest(
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
              // TODO: privremeno resenje posto kad se kreira novi ne povlaci taskove
              groupData.tasks = [];
              data.groups.push(groupData);
              console.log("group:", groupData);
              // create new task for next step
              createTask(groupData._id);
            }
          );
        } else {
          createTask(groupId);
        }
      }
    );

    console.log(params);
  };

  const saveTitleHandler = async (text) => {
    // save updated project title
    saveTitleSendRequest(
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
            buttonText = "Waiting For Writer";
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
            onClick={(e) => {
              e.stopPropagation();
              buttonClickHandle(params.row);
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
                  setOpenDialog(true);
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
            <NewPostDialog title="Add New Post" content="Create New Post" open={openDialog} setOpen={setOpenDialog} handleConfirm={confirmDialogHandle} />
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
    </Fragment>
  );
};

export default ProjectDetails;
