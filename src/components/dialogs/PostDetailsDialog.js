import React, { useState, useEffect } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, useTheme, Slide, Divider, Typography, Menu, MenuItem, FormControl, Select } from "@mui/material";
import { ArrowDropDownOutlined } from "@mui/icons-material";

import TextOrInput from "../TextOrInput";
import useHttp from "../../hooks/use-http";

const serverAddress = process.env.ENVIRONMENT === "production" ? process.env.REACT_APP_PROD_BASE_URL : process.env.REACT_APP_DEV_BASE_URL;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const PostDetailsDialog = ({ post, setPost, open, setOpen, project, setProject }) => {
  const theme = useTheme();
  const { isLoading, error, sendRequest } = useHttp();
  const [users, setUsers] = useState([]);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
  const [selectedUserRole, setSelectedUserRole] = useState(null);

  const userMenuIsOpen = Boolean(userMenuAnchorEl);

  useEffect(() => {
    sendRequest(
      {
        url: "/users/",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
      (userData) => {
        setUsers(userData);
        console.log("users:", userData);
      }
    );
  }, [sendRequest]);

  const getDate = (dateStr) => {
    const date = new Date(dateStr);
    const day = String(date.getDate()).padStart(2, "0");
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const year = date.getFullYear();
    const hour = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");
    const seconds = String(date.getSeconds()).padStart(2, "0");
    return `${day}-${month}-${year} ${hour}:${minutes}:${seconds}`;
  };

  const updatePostHandler = async (text, fieldToUpdate, tableToUpdate) => {
    const id = tableToUpdate === "postRequests" ? post._id : tableToUpdate === "websites" ? post.website._id : post.clientPaidLink._id;
    const body = {};
    body[fieldToUpdate] = text;
    // If previous request is not done set input text to previous value
    if (isLoading) return true;
    await sendRequest(
      {
        url: `/${tableToUpdate}/${id}`,
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body,
      },
      (data) => {
        console.log(data);
      }
    );
    // Refresh project details
    await sendRequest(
      {
        url: `/projects/${project._id}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
      (projectData) => {
        console.log("project:", projectData);
        setProject(projectData);
        for (const p of projectData.postRequests) {
          if (p._id === post._id) {
            setPost(p);
            break;
          }
        }
      }
    );
    return false;
  };

  const openUserMenuHandler = (event) => {
    setUserMenuAnchorEl(event.currentTarget);
  };

  const setUserMenuItemHandler = async (user) => {
    if (isLoading) return;
    const body = {};
    body[selectedUserRole] = user._id;
    if (!isLoading && !error) {
      await sendRequest(
        {
          url: `/postRequests/${post._id}`,
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body,
        },
        (postData) => {
          console.log("post:", postData);
          setPost(postData);
          setUserMenuAnchorEl(null);
          // setProject((prevVal) => {
          //   const tempList = [];
          //   const newData = { ...prevVal };
          //   for (const p of prevVal.postRequests) {
          //     if (p._id !== postData._id) {
          //       tempList.push(p);
          //     }
          //   }
          //   newData.postRequests = [postData, ...tempList];
          //   return newData;
          // });
        }
      );
    }
    // Update assigned user in task
    if (!isLoading && !error) {
      let taskId = null;
      let assignedUserId = null;
      for (const t of post.tasks) {
        // TODO: ne radi trenutno, uvek isti task menja, proveriti
        if (t.group.title === "Article Writing") {
          taskId = t._id;
          if (post.copywriter) assignedUserId = post.copywriter._id;
          console.log("writer", post.copywriter._id);
          break;
        } else if (t.group.title === "Post Publishing") {
          taskId = t._id;
          if (post.editor) assignedUserId = post.editor._id;
          console.log("editor", post.editor._id);
          break;
        }
      }
      if (taskId && assignedUserId) {
        await sendRequest(
          {
            url: `/postTasks/${taskId}`,
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: {
              assignedUser: assignedUserId,
            },
          },
          (taskData) => {
            console.log("task:", taskData);
            // setProject((prevVal) => {
            //   let tempList = [];
            //   const newData = { ...prevVal };
            //   for (const p of prevVal.postRequests) {
            //     tempList = [];
            //     for(const t of p.tasks){
            //       if (t._id !== taskData._id) {
            //         tempList.push(t);
            //       }
            //     }

            //   }
            //   newData.postRequests = [taskData, ...tempList];
            //   return newData;
            // });
          }
        );
      }
    }
    // Refresh project details
    if (!isLoading && !error) {
      await sendRequest(
        {
          url: `/projects/${project._id}`,
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
        (projectData) => {
          console.log("project:", projectData);
          setProject(projectData);
          for (const p of projectData.postRequests) {
            if (p._id === post._id) {
              setPost(p);
              break;
            }
          }
        }
      );
    }
  };

  const getProgress = (progress) => {
    let progressDisplay = "";
    switch (progress) {
      case "new":
        progressDisplay = "Novi";
        break;
      case "pendingCheck":
        progressDisplay = "Ceka Na Proveru";
        break;
      case "doneCheck":
        progressDisplay = "Provera Zavrsena";
        break;
      case "pendingWrite":
        progressDisplay = "Ceka Pisanje";
        break;
      case "doneWrite":
        progressDisplay = "Pisanje Zavrseno";
        break;
      case "pendingPublish":
        progressDisplay = "Ceka Na Objavu";
        break;
      case "donePublish":
        progressDisplay = "Objavljen";
        break;
      default:
    }
    return progressDisplay;
  };

  return (
    <Box>
      {post && (
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          aria-labelledby="alert-dialog-title"
          fullWidth
          maxWidth="md"
          TransitionComponent={Transition}
          sx={{
            "& .MuiDialog-container": {
              justifyContent: "end",
            },
          }}
          PaperProps={{
            sx: {
              height: "100%",
              maxHeight: "100%",
              m: "0",
            },
          }}
        >
          <DialogContent
            sx={{
              backgroundColor: theme.palette.background.default,
              display: "flex",
              justifyContent: "start",
              flexDirection: "column",
              pt: "0",
            }}
          >
            {/* Title */}
            <Box display="flex" justifyContent="center" p="3rem 0">
              <Typography variant="h2">{post.title}</Typography>
            </Box>
            {/* Content */}
            <Box display="flex" flexDirection="column" p="2rem" backgroundColor={theme.palette.background.light} borderRadius="5px" width="100%">
              <Box display="flex" gap="1rem" alignItems="center">
                <Typography color={theme.palette.grey[500]}>Website:</Typography>
                <TextOrInput fontSize="14px" textValue={post.website.url} callback={updatePostHandler} fieldToUpdate="url" tableToUpdate="websites" />
              </Box>
              <Divider sx={{ borderColor: theme.palette.grey[700], mt: "1rem", mb: "1rem" }} />
              <Box display="flex" gap="1rem" alignItems="center">
                <Typography color={theme.palette.grey[500]}>Anchor:</Typography>
                {/* <Typography color={theme.palette.grey[200]}>{post.anchorKeyword}</Typography> */}
                <TextOrInput fontSize="14px" textValue={post.anchorKeyword} callback={updatePostHandler} fieldToUpdate="anchorKeyword" tableToUpdate="postRequests" />
              </Box>
              <Divider sx={{ borderColor: theme.palette.grey[700], mt: "1rem", mb: "1rem" }} />
              <Box display="flex" gap="3rem">
                <Box display="flex" gap="1rem" alignItems="center">
                  <Typography color={theme.palette.grey[500]}>Client Link:</Typography>
                  {/* <Typography color={theme.palette.grey[200]}>{post.clientPaidLink.url}</Typography> */}
                  <TextOrInput fontSize="14px" textValue={post.clientPaidLink.url} callback={updatePostHandler} fieldToUpdate="url" tableToUpdate="clientLinks" />
                </Box>
                <Box display="flex" gap="1rem" alignItems="center">
                  <Typography color={theme.palette.grey[500]}>Link Status:</Typography>
                  <Typography color={theme.palette.grey[200]}>{post.clientPaidLink.status}</Typography>
                </Box>
              </Box>
              <Divider sx={{ borderColor: theme.palette.grey[700], mt: "1rem", mb: "1rem" }} />
              <Box display="flex" gap="1rem" alignItems="center">
                <Typography color={theme.palette.grey[500]}>Post Category:</Typography>
                <FormControl
                  variant="standard"
                  sx={{
                    "& .MuiFormControl-root": {
                      width: "100%",
                    },
                  }}
                >
                  <Select
                    value={post.postCategory}
                    onChange={(event) => updatePostHandler(event.target.value, "postCategory", "postRequests")}
                    sx={{
                      "::before": {
                        borderBottom: `1px solid ${theme.palette.grey[200]}`,
                      },
                      color: theme.palette.grey[500],
                      "& .MuiSvgIcon-root": {
                        color: theme.palette.grey[200],
                      },
                    }}
                  >
                    <MenuItem value="Placeni">Placeni</MenuItem>
                    <MenuItem value="Insercija">Insercija</MenuItem>
                    <MenuItem value="Wayback">Wayback</MenuItem>
                    <MenuItem value="Redovni">Redovni</MenuItem>
                    <MenuItem value="Ostalo">Ostalo</MenuItem>
                  </Select>
                </FormControl>
              </Box>
              <Divider sx={{ borderColor: theme.palette.grey[700], mt: "1rem", mb: "1rem" }} />
              <Box display="flex" gap="1rem" alignItems="center">
                <Typography color={theme.palette.grey[500]}>Progress Level:</Typography>
                <Typography color={theme.palette.grey[200]}>{getProgress(post.progressLevel)}</Typography>
              </Box>
              <Divider sx={{ borderColor: theme.palette.grey[700], mt: "1rem", mb: "1rem" }} />
              <Box display="flex" gap="1rem" alignItems="center">
                <Typography color={theme.palette.grey[500]}>Urgency Level:</Typography>
                <TextOrInput fontSize="14px" textValue={post.urgencyLevel} callback={updatePostHandler} fieldToUpdate="urgencyLevel" tableToUpdate="postRequests" />
              </Box>
              <Divider sx={{ borderColor: theme.palette.grey[700], mt: "1rem", mb: "1rem" }} />
              <Box display="flex" gap="1rem" alignItems="center">
                <Typography color={theme.palette.grey[500]}>Word Number:</Typography>
                <TextOrInput fontSize="14px" textValue={post.wordNum} callback={updatePostHandler} fieldToUpdate="wordNum" tableToUpdate="postRequests" />
              </Box>
              <Divider sx={{ borderColor: theme.palette.grey[700], mt: "1rem", mb: "1rem" }} />
              <Box display="flex" gap="3rem">
                <Box display="flex" gap="1rem" alignItems="center">
                  <Typography color={theme.palette.grey[500]}>Writer:</Typography>
                  <Button
                    onClick={(event) => {
                      setSelectedUserRole("copywriter");
                      openUserMenuHandler(event);
                    }}
                  >
                    {post.copywriter && (
                      <Box
                        component="img"
                        alt="profile"
                        src={serverAddress + "/" + post.copywriter.profileImage}
                        crossOrigin="use-credentials"
                        height="32px"
                        width="32px"
                        borderRadius="50%"
                        sx={{ objectFit: "cover" }}
                      />
                    )}
                    <ArrowDropDownOutlined sx={{ color: theme.palette.secondary[300], fontSize: "25px" }} />
                  </Button>
                </Box>
                <Box display="flex" gap="1rem" alignItems="center">
                  <Typography color={theme.palette.grey[500]}>Editor:</Typography>

                  <Button
                    onClick={(event) => {
                      setSelectedUserRole("editor");
                      openUserMenuHandler(event);
                    }}
                  >
                    {post.editor && (
                      <Box
                        component="img"
                        alt="profile"
                        src={serverAddress + "/" + post.editor.profileImage}
                        crossOrigin="use-credentials"
                        height="32px"
                        width="32px"
                        borderRadius="50%"
                        sx={{ objectFit: "cover" }}
                      />
                    )}
                    <ArrowDropDownOutlined sx={{ color: theme.palette.secondary[300], fontSize: "25px" }} />
                  </Button>
                </Box>
                <Menu anchorEl={userMenuAnchorEl} open={userMenuIsOpen} onClose={() => setUserMenuAnchorEl(null)} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
                  {users.map((u) => {
                    return (
                      <MenuItem
                        key={u._id}
                        onClick={() => {
                          setUserMenuItemHandler(u);
                        }}
                      >
                        <Typography mr="0.4rem">{u.firstName}</Typography>
                        <Typography>{u.lastName}</Typography>
                      </MenuItem>
                    );
                  })}
                </Menu>
              </Box>
              <Divider sx={{ borderColor: theme.palette.grey[700], mt: "1rem", mb: "1rem" }} />
              <Box display="flex" gap="1rem">
                <Typography color={theme.palette.grey[500]}>Created At:</Typography>
                <Typography color={theme.palette.grey[200]}>{getDate(post.createdAt)}</Typography>
              </Box>
              <Divider sx={{ borderColor: theme.palette.grey[700], mt: "1rem", mb: "1rem" }} />
              <Box display="flex" gap="1rem">
                <Typography color={theme.palette.grey[500]}>Updated At:</Typography>
                <Typography color={theme.palette.grey[200]}>{getDate(post.updatedAt)}</Typography>
              </Box>
            </Box>
          </DialogContent>
          {/* <DialogActions
            sx={{
              backgroundColor: theme.palette.background.default,
              p: "1.5rem",
            }}
          >
            <Button
              onClick={() => {
                setOpen(false);
              }}
              sx={{
                color: theme.palette.grey[200],
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                // handleConfirm(email);
                // setEmail("");
              }}
              autoFocus
            >
              Next Step
            </Button>
          </DialogActions> */}
        </Dialog>
      )}
    </Box>
  );
};

export default PostDetailsDialog;
