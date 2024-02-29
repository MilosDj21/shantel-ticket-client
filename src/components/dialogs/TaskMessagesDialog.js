import React, { useMemo } from "react";
import { Box, Typography, Dialog, DialogContent, useTheme, Slide, FormControl, Select, MenuItem, Divider } from "@mui/material";
import TaskMessageSingle from "../TaskMessageSingle";

import TextEditor from "../TextEditor";
import useHttp from "../../hooks/use-http";
import { useSelector } from "react-redux";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const TaskMessagesDialog = ({ task, setTask, open, setOpen, project = null, setProject = null, setTasks = null }) => {
  const theme = useTheme();
  const { isLoading, sendRequest } = useHttp();
  const userRoles = useSelector((state) => state.roles);

  const isWebsiteChecker = useMemo(() => {
    for (const r of userRoles) {
      if (r.name === "Website Checker") return true;
    }
    return false;
  }, [userRoles]);

  const saveMessageHandler = async (message, image) => {
    //TODO: proveri da ne bude prazna poruka
    if (!message) return;

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
      },
    );

    if (!isLoading && newMessage) {
      // Refresh project details if user is from sales, if message saved successfully
      if (setProject) {
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
      } else if (setTasks) {
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

            {/* Client Website  */}
            {isWebsiteChecker && (
              <Box display="flex" flexDirection="column" gap="1rem">
                <Typography fontSize="18px" color={theme.palette.grey[500]}>
                  Client Website:
                </Typography>
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
                      onChange={(event) => {}}
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
