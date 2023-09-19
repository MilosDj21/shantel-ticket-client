import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, Typography, useTheme, IconButton, Tooltip } from "@mui/material";
import { SettingsOutlined, Delete } from "@mui/icons-material";
import parse from "html-react-parser";

import useHttp from "../hooks/use-http";
import FlexBetween from "./FlexBetween";
import AlertDialog from "./AlertDialog";

const serverAddress = process.env.ENVIRONMENT === "production" ? process.env.REACT_APP_PROD_BASE_URL : process.env.REACT_APP_DEV_BASE_URL;

const TicketMessage = ({ element, setData, setTicketLogs, ticketId, userId, enableModifyButtons }) => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const { sendRequest } = useHttp();

  const deleteMessageHandler = async () => {
    if (!enableModifyButtons) return;
    sendRequest(
      {
        url: `/techTickets/${ticketId}/ticketMessage/${element._id}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      },
      (messageData) => {
        setData((prevVal) => {
          const newVal = prevVal;
          const newMessages = newVal.messages.filter((m) => m._id !== element._id);
          newVal.messages = newMessages;
          return newVal;
        });
        // UPDATE DELETE MESSAGE TICKET LOGS
        sendRequest(
          {
            url: `/techTickets/${ticketId}/ticketLog`,
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: {
              message: `Ticket reply was deleted:${element.message}`,
              userId,
            },
          },
          (logData) => {
            setTicketLogs((prevVal) => {
              return [...prevVal, logData];
            });
            console.log("message deleted");
          }
        );
      }
    );
  };

  return (
    <Box height="fit-content" backgroundColor={theme.palette.background.light} p="1rem" borderRadius="5px">
      <FlexBetween gap="1rem">
        <Box display="flex" gap="1rem" alignItems="center">
          <Box
            component="img"
            alt="profile"
            src={serverAddress + "/" + element.user.profileImage}
            crossOrigin="use-credentials"
            height="32px"
            width="32px"
            borderRadius="50%"
            sx={{ objectFit: "cover" }}
          />
          <Typography variant="h3">{element.user.firstName}</Typography>
        </Box>
        {enableModifyButtons && (
          <Box>
            <Tooltip title="Edit" placement="top" arrow>
              <IconButton
                onClick={() => {
                  navigate(`/admin/tickets/message/edit/${element._id}`);
                }}
              >
                <SettingsOutlined
                  sx={{
                    color: theme.palette.grey.main,
                  }}
                />
              </IconButton>
            </Tooltip>
            <Tooltip title="Delete" placement="top" arrow>
              <IconButton
                onClick={() => {
                  setOpenDialog(true);
                }}
              >
                <Delete
                  sx={{
                    color: theme.palette.grey.main,
                  }}
                />
              </IconButton>
            </Tooltip>
            <AlertDialog title="Delete Message?" content="Are you sure you want to delete this message?" open={openDialog} setOpen={setOpenDialog} handleConfirm={deleteMessageHandler} />
          </Box>
        )}
      </FlexBetween>
      {parse(element.message)}
      {element.image && <Box component="img" alt="message image" src={serverAddress + "/" + element.image} crossOrigin="use-credentials" maxWidth="50%" sx={{ objectFit: "cover" }} />}
    </Box>
  );
};

export default TicketMessage;
