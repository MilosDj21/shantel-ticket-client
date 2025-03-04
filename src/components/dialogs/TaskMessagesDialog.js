import React, { useEffect } from "react";
import { Box, Typography, Dialog, DialogContent, useTheme, Slide, Button, FormControl, Select, MenuItem, Divider } from "@mui/material";
import TaskMessageSingle from "../TaskMessageSingle";
import { toast } from "react-toastify";

import TextEditor from "../TextEditor";
import useHttp from "../../hooks/use-http";
import { useSelector } from "react-redux";
import { socket } from "../../socket";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const TaskMessagesDialog = ({ task, setTask, open, setOpen, project = null, setProject = null, setTasks = null }) => {
  const theme = useTheme();
  const { isLoading, sendRequest } = useHttp();
  const user = useSelector((state) => state.auth);

  const errorNotificaion = (message) => {
    if (!message) {
      message = "Something went wrong!";
    }
    return toast.error(message, {
      position: "top-right",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "dark",
    });
  };

  useEffect(() => {
    sendRequest(
      {
        url: `/postTasks/${task._id}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
      (taskData) => {
        console.log("task", taskData);
        setTask(taskData);
      },
    );
  }, [sendRequest, task._id, setTask]);

  useEffect(() => {
    const onPrivateMessage = (message) => {
      setTask((prevVal) => {
        for (const m of prevVal.messages) {
          if (m._id === message._id) {
            return prevVal;
          }
        }
        const newVal = { ...prevVal };
        newVal.messages = [...prevVal.messages, message];
        return newVal;
      });
    };

    socket.on("privateMessage", onPrivateMessage);
    return () => {
      socket.off("privateMessage", onPrivateMessage);
    };
  });

  const setTaskInProgressAndRefresh = async () => {
    //If task status is not already in progress, then update it
    if (task.status !== "In Progress" && !isLoading) {
      await sendRequest(
        {
          url: `/postTasks/${task._id}`,
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: {
            status: "In Progress",
          },
        },
        (taskData) => {
          console.log("tasks:", taskData);
        },
      );
    }

    //Refresh tasks data
    await sendRequest(
      {
        url: "/postTasks",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
      (tasksData) => {
        console.log("tasks:", tasksData);
        setTasks(tasksData);
        for (const t of tasksData) {
          if (t._id === task._id) {
            setTask(t);
          }
        }
      },
    );
  };

  const updateClienWebsiteStatusHandler = async (status) => {
    // console.log(status);
    let clientWebsite = null;

    // Change client website status
    await sendRequest(
      {
        url: `/clientWebsites/${task.post.clientLink.clientWebsite._id}`,
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          status,
        },
      },
      (clientWebsiteData) => {
        console.log("clientWebsite:", clientWebsiteData);
        clientWebsite = clientWebsiteData;
      },
    );

    //Update task to be in progress and refresh tasks data if client website is updated
    if (clientWebsite && !isLoading) {
      await setTaskInProgressAndRefresh();
    }
  };

  const saveMessageHandler = async (message, image) => {
    if (!message || message === "<p></p>") {
      errorNotificaion("Message can't be empty!");
      return;
    }

    if (!task.assignedUser) {
      errorNotificaion("Task not assigned!");
      return;
    }

    let newMessage = null;

    const formData = new FormData();
    formData.append("message", message);
    formData.append("task", task._id);
    if (image) {
      formData.append("image", image);
    }

    // Save message
    await sendRequest(
      {
        url: "/postTaskMessages",
        method: "POST",
        formData: formData,
      },
      (messageData) => {
        newMessage = messageData;

        // Check user to which message needs to be sent
        let sendMsgTo = null;
        if (user.roles[0].name === "Sales") {
          sendMsgTo = task.assignedUser._id;
        } else {
          sendMsgTo = task.post.project.user._id;
        }

        // After saving message successfully emit message to socket io
        socket.emit("privateMessage", {
          to: sendMsgTo,
          data: messageData,
        });
      },
    );

    if (!isLoading && newMessage) {
      // Refresh project details if user is from sales, if message saved successfully
      if (user.roles[0].name === "Sales") {
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
            setTask((prevVal) => {
              const newVal = { ...prevVal };
              newVal.messages = [...prevVal.messages, newMessage];
              return newVal;
            });
          },
        );
        // Refresh tasks data if user is website checker
      } else if (user.roles[0].name === "Website Checker") {
        await setTaskInProgressAndRefresh();
      }
    }
  };

  const assignUserHandler = async () => {
    if (!isLoading) {
      //Assign current user
      await sendRequest(
        {
          url: `/postTasks/${task._id}`,
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: {
            assignedUser: user.userId,
          },
        },
        (taskData) => {
          console.log("tasks:", taskData);
        },
      );

      //Refresh tasks data
      await sendRequest(
        {
          url: "/postTasks",
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
        (tasksData) => {
          console.log("tasks:", tasksData);
          setTasks(tasksData);
          for (const t of tasksData) {
            if (t._id === task._id) {
              setTask(t);
            }
          }
        },
      );
    }
  };

  const closeTaskHandler = async () => {
    if (task.post.clientLink.clientWebsite.status === "Neproveren") return;
    if (!isLoading) {
      //Close Task
      await sendRequest(
        {
          url: `/postTasks/${task._id}`,
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: {
            status: "Closed",
          },
        },
        (taskData) => {
          console.log("tasks:", taskData);
        },
      );

      //Refresh tasks data
      await sendRequest(
        {
          url: "/postTasks",
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
        (tasksData) => {
          console.log("tasks:", tasksData);
          setTasks(tasksData);
          for (const t of tasksData) {
            if (t._id === task._id) {
              setTask(t);
            }
          }
        },
      );
    }
  };

  return (
    <Box>
      {task && (
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
              color: theme.palette.grey[200],
            },
          }}>
          <DialogContent
            sx={{
              backgroundColor: theme.palette.background.default,
              display: "flex",
              justifyContent: "start",
              flexDirection: "column",
              pt: "0",
            }}>
            {/* Title */}
            <Box display="flex" justifyContent="center" p="3rem 0">
              <Typography variant="h2">{task.post.title}</Typography>
            </Box>

            {/* Client Website, show only for website checker role  */}
            {user.roles[0].name === "Website Checker" && (
              <Box display="flex" flexDirection="column" gap="1rem">
                <Typography fontSize="18px" color={theme.palette.grey[500]}>
                  Client Website:
                </Typography>
                <Box display="flex" justifyContent="space-between">
                  <Box display="flex" gap="3rem" alignItems="center">
                    <Typography variant="h3">{task.post.clientLink.clientWebsite.url}</Typography>
                    <FormControl
                      variant="standard"
                      sx={{
                        "& .MuiFormControl-root": {
                          width: "100%",
                        },
                      }}>
                      <Select
                        value={task.post.clientLink.clientWebsite.status}
                        onChange={(event) => updateClienWebsiteStatusHandler(event.target.value)}
                        sx={{
                          fontSize: "16px",
                          "::before": {
                            borderBottom: `1px solid ${theme.palette.grey[200]}`,
                          },
                          color: theme.palette.grey[500],
                          "& .MuiSvgIcon-root": {
                            color: theme.palette.grey[200],
                          },
                        }}>
                        <MenuItem value="Neproveren">Neproveren</MenuItem>
                        <MenuItem value="Odobren">Odobren</MenuItem>
                        <MenuItem value="Semafor">Semafor</MenuItem>
                        <MenuItem value="Pijaca">Pijaca</MenuItem>
                        <MenuItem value="Odbijen">Odbijen</MenuItem>
                      </Select>
                    </FormControl>
                  </Box>
                  <Box display="flex" gap="1rem">
                    <Button
                      variant="contained"
                      disabled={isLoading || Boolean(task.assignedUser)}
                      onClick={(e) => {
                        e.stopPropagation();
                        assignUserHandler();
                      }}>
                      {task.status === "Closed" || Boolean(task.assignedUser) ? "Disabled" : "Take Over"}
                    </Button>
                    <Button
                      variant="outlined"
                      disabled={isLoading || task.status === "Closed"}
                      onClick={(e) => {
                        e.stopPropagation();
                        closeTaskHandler();
                      }}>
                      {task.status === "Closed" ? "Disabled" : "Close Task"}
                    </Button>
                  </Box>
                </Box>
                <Divider sx={{ borderColor: theme.palette.grey[700], mt: "1rem", mb: "1rem" }} />
              </Box>
            )}

            {/* Messages */}
            <Box backgroundColor={theme.palette.background.light} borderRadius="5px" padding="1rem" mb="2rem">
              {task.messages.length > 0 ? (
                task.messages.map((m) => {
                  return <TaskMessageSingle key={m._id} message={m} />;
                })
              ) : (
                <Typography variant="h4" textAlign="center">
                  No Messages
                </Typography>
              )}
            </Box>

            {/* TEXT EDITOR */}
            <Box>
              <Typography variant="h3" mb="1rem">
                Reply To Task
              </Typography>
              <TextEditor isLoading={isLoading} saveMessage={saveMessageHandler} />
            </Box>
          </DialogContent>
        </Dialog>
      )}
    </Box>
  );
};

export default TaskMessagesDialog;
