import React from "react";
import { Box, Typography, Dialog, DialogContent, useTheme, Slide } from "@mui/material";
import TaskMessageSingle from "../TaskMessageSingle";

import TextEditor from "../TextEditor";
import useHttp from "../../hooks/use-http";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const TaskMessagesDialog = ({ task, setTask, open, setOpen, project, setProject }) => {
  const theme = useTheme();
  const { isLoading, sendRequest } = useHttp();

  const saveMessageHandler = async (message, image) => {
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

    // Refresh project details, if message saved successfully
    if (!isLoading && newMessage) {
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

            {/* Messages */}
            <Box backgroundColor={theme.palette.background.light} borderRadius="5px" padding="1rem" mb="2rem">
              {task.messages.length > 0 ? (
                task.messages.map((m) => {
                  return <TaskMessageSingle key={m._id} message={m} />;
                })
              ) : (
                <Typography variant="h4" textAlign='center'>No Messages</Typography>
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
