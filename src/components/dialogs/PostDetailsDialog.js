import React, { useState, useEffect } from "react";
import { Box, Button, Dialog, DialogContent, useTheme, Slide, Divider, Typography, Menu, MenuItem, FormControl, Select, Autocomplete, TextField, Tooltip, IconButton } from "@mui/material";
import { ArrowDropDownOutlined, Add } from "@mui/icons-material";

import TextOrInput from "../TextOrInput";
import useHttp from "../../hooks/use-http";
import NewWebsiteDialog from "./NewWebsiteDialog";
import NewClientWebsiteDialog from "./NewClientWebsiteDialog";
import NewClientLinkDialog from "./NewClientLinkDialog";

const serverAddress = process.env.ENVIRONMENT === "production" ? process.env.REACT_APP_PROD_BASE_URL : process.env.REACT_APP_DEV_BASE_URL;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const PostDetailsDialog = ({ post, setPost, open, setOpen, project, setProject }) => {
  const theme = useTheme();
  const { isLoading, sendRequest } = useHttp();
  const { isLoading: getWebsitesIsLoading, error: getWebsitesError, sendRequest: getWebsitesSendRequest } = useHttp();
  const { isLoading: getClientWebsitesSendIsLoading, error: getClientWebsitesSendError, sendRequest: getClientWebsitesSendRequest } = useHttp();
  const { isLoading: getClientLinksSendIsLoading, error: getClientLinksSendError, sendRequest: getClientLinksSendRequest } = useHttp();
  const [users, setUsers] = useState([]);
  const [userMenuAnchorEl, setUserMenuAnchorEl] = useState(null);
  const [selectedUserRole, setSelectedUserRole] = useState(null);
  const [website, setWebsite] = useState(null);
  const [websiteList, setWebsiteList] = useState(null);
  const [clientWebsite, setClientWebsite] = useState(null);
  const [clientWebsiteList, setClientWebsiteList] = useState(null);
  const [clientLink, setClientLink] = useState(null);
  const [clientLinkList, setClientLinkList] = useState(null);
  const [clientFilteredLinkList, setClientFilteredLinkList] = useState(null);
  const [openWebsiteDialog, setOpenWebsiteDialog] = useState(false);
  const [openClientWebsiteDialog, setOpenClientWebsiteDialog] = useState(false);
  const [openClientLinkDialog, setOpenClientLinkDialog] = useState(false);

  const userMenuIsOpen = Boolean(userMenuAnchorEl);

  const websiteAutocompleteProps = {
    options: websiteList,
    getOptionLabel: (option) => option.url,
  };

  const clientWebsiteAutocompleteProps = {
    options: clientWebsiteList,
    getOptionLabel: (option) => option.url,
  };

  const clientLinkAutocompleteProps = {
    options: clientFilteredLinkList,
    getOptionLabel: (option) => option.url,
  };

  // Set website value from website list
  useEffect(() => {
    if (post && !website && websiteList) {
      for (const w of websiteList) {
        if (post.website._id === w._id) {
          setWebsite(w);
        }
      }
    }
    if (!open) setWebsite(null);
  }, [post, website, websiteList, open]);

  // Set client website value from client website list
  useEffect(() => {
    if (post && !clientWebsite && clientWebsiteList) {
      for (const w of clientWebsiteList) {
        if (post.clientLink.clientWebsite._id === w._id) {
          setClientWebsite(w);
        }
      }
    }
    if (!open) setClientWebsite(null);
  }, [post, clientWebsite, clientWebsiteList, open]);

  // Set client link value from client link list
  useEffect(() => {
    if (post && clientFilteredLinkList) {
      for (const l of clientFilteredLinkList) {
        if (post.clientLink._id === l._id) {
          setClientLink(l);
        }
      }
    }
    if (!open) setClientLink(null);
  }, [post, clientFilteredLinkList, open]);

  // Filter client link list to show only links for that website
  useEffect(() => {
    if (clientWebsite) {
      setClientFilteredLinkList(() => {
        const tempList = clientLinkList.filter((l) => {
          return l.url.includes(clientWebsite.url);
        });
        if (tempList.length === 0) {
          setClientLink(null);
        }
        return tempList;
      });
    }
  }, [clientWebsite, clientLinkList]);

  // Get initial data
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
    getWebsitesSendRequest(
      {
        url: "/websites",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
      (websiteData) => {
        console.log("websites:", websiteData);
        setWebsiteList(websiteData);
      }
    );
    getClientWebsitesSendRequest(
      {
        url: "/clientWebsites",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
      (clientWebsitesData) => {
        console.log("clientWebsites", clientWebsitesData);
        setClientWebsiteList(clientWebsitesData);
      }
    );
    getClientLinksSendRequest(
      {
        url: "/clientLinks",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
      (clientLinkData) => {
        console.log("clientLinks", clientLinkData);
        setClientLinkList(clientLinkData);
      }
    );
  }, [sendRequest, getWebsitesSendRequest, getClientWebsitesSendRequest, getClientLinksSendRequest]);

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

  const setNewWebsite = async (website) => {
    const isLoading = await updatePostHandler(website._id, "website");
    if (!isLoading) {
      setWebsite(website);
    }
  };

  const setNewClientLink = async (link) => {
    const isLoading = await updatePostHandler(link._id, "clientLink");
    if (!isLoading) {
      setClientLink(link);
    }
  };

  const updatePostHandler = async (text, fieldToUpdate) => {
    const body = {};
    body[fieldToUpdate] = text;
    // If previous request is not done set input text to previous value
    if (isLoading) return true;
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
    let requestOkStatus = true;
    const body = {};
    body[selectedUserRole] = user._id;
    // Update assigned editor/copywriter in post
    if (!isLoading) {
      requestOkStatus = false;
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
          requestOkStatus = true;
          setPost(postData);
          setUserMenuAnchorEl(null);
        }
      );
    }
    // Update assigned user in task
    if (!isLoading && requestOkStatus) {
      let taskId = null;
      let assignedUserId = user._id;
      for (const t of post.tasks) {
        if (t.group.title === "Article Writing" && selectedUserRole === "copywriter") {
          taskId = t._id;
          break;
        } else if (t.group.title === "Post Publishing" && selectedUserRole === "editor") {
          taskId = t._id;
          break;
        }
      }
      if (taskId && assignedUserId) {
        requestOkStatus = false;
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
            requestOkStatus = true;
          }
        );
      }
    }
    // Refresh project details
    if (!isLoading && requestOkStatus) {
      requestOkStatus = false;
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
          requestOkStatus = true;
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
              {/* Website */}
              <Box display="flex" gap="1rem" alignItems="center">
                <Typography color={theme.palette.grey[500]}>Website:</Typography>
                {!getWebsitesIsLoading && !getWebsitesError && websiteList && (
                  <Autocomplete
                    {...websiteAutocompleteProps}
                    value={website}
                    onChange={async (event, newValue) => {
                      if (newValue) {
                        setNewWebsite(newValue);
                      }
                    }}
                    renderInput={(params) => <TextField {...params} variant="standard" />}
                    sx={{
                      "& .MuiAutocomplete-input": {
                        width: "100% !important",
                      },
                      "& .MuiInputBase-root": {
                        color: `${theme.palette.grey[500]} !important`,
                      },
                      "& .MuiInputBase-root::before": {
                        borderBottom: `1px solid ${theme.palette.grey[200]}`,
                      },
                      color: theme.palette.grey[500],
                      "& .MuiSvgIcon-root": {
                        color: theme.palette.grey[200],
                      },
                    }}
                  />
                )}
                <Box>
                  <Tooltip title="Add new website" placement="top" arrow>
                    <IconButton
                      onClick={() => {
                        setOpenWebsiteDialog(true);
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
              </Box>
              <Divider sx={{ borderColor: theme.palette.grey[700], mt: "1rem", mb: "1rem" }} />

              {/* Anchor */}
              <Box display="flex" gap="1rem" alignItems="center">
                <Typography color={theme.palette.grey[500]}>Anchor:</Typography>
                <TextOrInput fontSize="14px" textValue={post.anchorKeyword} callback={updatePostHandler} fieldToUpdate="anchorKeyword" />
              </Box>
              <Divider sx={{ borderColor: theme.palette.grey[700], mt: "1rem", mb: "1rem" }} />

              {/* Client Website */}
              <Box display="flex" gap="3rem">
                <Box display="flex" gap="1rem" alignItems="center">
                  <Typography color={theme.palette.grey[500]}>Client Website:</Typography>
                  {!getClientWebsitesSendIsLoading && !getClientWebsitesSendError && clientWebsiteList && (
                    <Autocomplete
                      {...clientWebsiteAutocompleteProps}
                      value={clientWebsite}
                      onChange={async (event, newValue) => {
                        if (newValue) {
                          setClientLink(null);
                          setClientWebsite(newValue);
                        }
                      }}
                      renderInput={(params) => <TextField {...params} variant="standard" />}
                      sx={{
                        "& .MuiAutocomplete-input": {
                          width: "100% !important",
                        },
                        "& .MuiInputBase-root": {
                          color: `${theme.palette.grey[500]} !important`,
                        },
                        "& .MuiInputBase-root::before": {
                          borderBottom: `1px solid ${theme.palette.grey[200]}`,
                        },
                        color: theme.palette.grey[500],
                        "& .MuiSvgIcon-root": {
                          color: theme.palette.grey[200],
                        },
                      }}
                    />
                  )}
                  <Box>
                    <Tooltip title="Add new client website" placement="top" arrow>
                      <IconButton
                        onClick={() => {
                          setOpenClientWebsiteDialog(true);
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
                </Box>

                {/* Client Website Status */}
                <Box display="flex" gap="1rem" alignItems="center">
                  <Typography color={theme.palette.grey[500]}>Client Website Status:</Typography>
                  <Typography color={theme.palette.grey[200]}>{post.clientLink ? post.clientLink.clientWebsite.status : ""}</Typography>
                </Box>
              </Box>
              <Divider sx={{ borderColor: theme.palette.grey[700], mt: "1rem", mb: "1rem" }} />

              {/* Client Link */}
              <Box display="flex" gap="3rem">
                <Box display="flex" gap="1rem" alignItems="center">
                  <Typography color={theme.palette.grey[500]}>Client Link:</Typography>
                  {!getClientLinksSendIsLoading && !getClientLinksSendError && clientLinkList && clientFilteredLinkList && (
                    <Autocomplete
                      {...clientLinkAutocompleteProps}
                      value={clientLink}
                      onChange={async (event, newValue) => {
                        if (newValue) {
                          setNewClientLink(newValue);
                        }
                      }}
                      renderInput={(params) => <TextField {...params} variant="standard" />}
                      sx={{
                        "& .MuiAutocomplete-input": {
                          width: "100% !important",
                        },
                        "& .MuiInputBase-root": {
                          color: `${theme.palette.grey[500]} !important`,
                        },
                        "& .MuiInputBase-root::before": {
                          borderBottom: `1px solid ${theme.palette.grey[200]}`,
                        },
                        color: theme.palette.grey[500],
                        "& .MuiSvgIcon-root": {
                          color: theme.palette.grey[200],
                        },
                      }}
                    />
                  )}
                  <Box>
                    <Tooltip title="Add new client link" placement="top" arrow>
                      <IconButton
                        onClick={() => {
                          setOpenClientLinkDialog(true);
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
                </Box>
              </Box>
              <Divider sx={{ borderColor: theme.palette.grey[700], mt: "1rem", mb: "1rem" }} />

              {/* Post Category */}
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
                    onChange={(event) => updatePostHandler(event.target.value, "postCategory")}
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

              {/* Progress Level */}
              <Box display="flex" gap="1rem" alignItems="center">
                <Typography color={theme.palette.grey[500]}>Progress Level:</Typography>
                <Typography color={theme.palette.grey[200]}>{getProgress(post.progressLevel)}</Typography>
              </Box>
              <Divider sx={{ borderColor: theme.palette.grey[700], mt: "1rem", mb: "1rem" }} />

              {/* Ugrency Level */}
              <Box display="flex" gap="1rem" alignItems="center">
                <Typography color={theme.palette.grey[500]}>Urgency Level:</Typography>
                <TextOrInput fontSize="14px" textValue={post.urgencyLevel} callback={updatePostHandler} fieldToUpdate="urgencyLevel" />
              </Box>
              <Divider sx={{ borderColor: theme.palette.grey[700], mt: "1rem", mb: "1rem" }} />

              {/* Word Num */}
              <Box display="flex" gap="1rem" alignItems="center">
                <Typography color={theme.palette.grey[500]}>Word Number:</Typography>
                <TextOrInput fontSize="14px" textValue={post.wordNum} callback={updatePostHandler} fieldToUpdate="wordNum" />
              </Box>
              <Divider sx={{ borderColor: theme.palette.grey[700], mt: "1rem", mb: "1rem" }} />

              <Box display="flex" gap="3rem">
                {/* Writer */}
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

                {/* Editor */}
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
                    for (const r of u.roles) {
                      if (r.name === "Editor" && selectedUserRole === "editor") {
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
                      } else if (r.name === "Copywriter" && selectedUserRole === "copywriter") {
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
                      }
                    }
                    return "";
                  })}
                </Menu>
              </Box>
              <Divider sx={{ borderColor: theme.palette.grey[700], mt: "1rem", mb: "1rem" }} />

              {/* Created At */}
              <Box display="flex" gap="1rem">
                <Typography color={theme.palette.grey[500]}>Created At:</Typography>
                <Typography color={theme.palette.grey[200]}>{getDate(post.createdAt)}</Typography>
              </Box>
              <Divider sx={{ borderColor: theme.palette.grey[700], mt: "1rem", mb: "1rem" }} />

              {/* Updated At */}
              <Box display="flex" gap="1rem">
                <Typography color={theme.palette.grey[500]}>Updated At:</Typography>
                <Typography color={theme.palette.grey[200]}>{getDate(post.updatedAt)}</Typography>
              </Box>
            </Box>
          </DialogContent>
        </Dialog>
      )}
      {openWebsiteDialog && <NewWebsiteDialog title="Add New Website" open={openWebsiteDialog} setOpen={setOpenWebsiteDialog} setWebsite={setNewWebsite} setWebsiteList={setWebsiteList} />}
      {openClientWebsiteDialog && (
        <NewClientWebsiteDialog
          title="Add New Client Website"
          open={openClientWebsiteDialog}
          setOpen={setOpenClientWebsiteDialog}
          setClientWebsite={setClientWebsite}
          setClientWebsiteList={setClientWebsiteList}
        />
      )}
      {openClientLinkDialog && clientWebsite && (
        <NewClientLinkDialog
          title="Add New Client Link"
          open={openClientLinkDialog}
          setOpen={setOpenClientLinkDialog}
          setClientLink={setNewClientLink}
          setClientLinkList={setClientLinkList}
          clientWebsite={clientWebsite}
        />
      )}
    </Box>
  );
};

export default PostDetailsDialog;
