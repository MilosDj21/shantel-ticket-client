import { Fragment, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Box, Typography, useTheme, useMediaQuery, Divider, Select, MenuItem, FormControl, IconButton, Tooltip } from "@mui/material";
import { SettingsOutlined, Delete } from "@mui/icons-material";
import parse from "html-react-parser";

import useHttp from "../../../hooks/use-http";
import FlexBetween from "../../../components/FlexBetween";
import AlertDialog from "../../../components/AlertDialog";
import TicketMessage from "../../../components/TicketMessage";
import TextEditor from "../../../components/TextEditor";

const serverAddress = process.env.ENVIRONMENT === "production" ? process.env.REACT_APP_PROD_BASE_URL : process.env.REACT_APP_DEV_BASE_URL;

const TicketDetails = () => {
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const navigate = useNavigate();
  const userId = useSelector((state) => state.userId);
  const { ticketId } = useParams();
  const { isLoading, sendRequest } = useHttp();
  const { sendRequest: changeTicketStatus } = useHttp();
  const { isLoading: messageIsLoading, sendRequest: messageSendRequest } = useHttp();
  const [data, setData] = useState(null);
  const [ticketLogs, setTicketLogs] = useState(null);
  const [ticketStatus, setTicketStatus] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);

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

  // RETRIEVE INITIAL DATA FROM SERVER
  useEffect(() => {
    sendRequest(
      {
        url: `/techTickets/${ticketId}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
      (ticketData) => {
        setData(ticketData);
        setTicketStatus(ticketData.status);
        setTicketLogs(ticketData.logs);
        console.log(ticketData);
      }
    );
  }, [sendRequest, ticketId]);

  const changeTicketStatusHandler = async (event) => {
    // CHANGE TICKET STATUS
    changeTicketStatus(
      {
        url: "/techTickets",
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          id: ticketId,
          status: event.target.value,
        },
      },
      (ticketData) => {
        setTicketStatus(ticketData.status);
        // UPDATE CHANGE STATUS TICKET LOGS
        changeTicketStatus(
          {
            url: `/techTickets/${ticketId}/ticketLog`,
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: {
              message: `Ticket status was changed to ${event.target.value}`,
              userId,
            },
          },
          (logData) => {
            setTicketLogs((prevVal) => {
              return [...prevVal, logData];
            });
          }
        );
      }
    );
  };

  // DELETE TICKET
  const deleteTicketHandler = async () => {
    sendRequest(
      {
        url: `/techTickets/${ticketId}`,
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      },
      (ticketData) => {
        navigate("/admin/tickets/");
      }
    );
  };

  const saveMessageHandler = async (message, image) => {
    if (!message) return;

    const formData = new FormData();
    formData.append("message", message);
    formData.append("userId", userId);
    if (image) {
      formData.append("image", image);
    }

    // SAVE MESSAGE
    messageSendRequest(
      {
        url: `/techTickets/${ticketId}/ticketMessage`,
        method: "POST",
        formData: formData,
      },
      (messageData) => {
        setData((prevVal) => {
          const newVal = prevVal;
          newVal.messages.push(messageData);
          return newVal;
        });
        // UPDATE SAVE MESSAGE TICKET LOGS
        messageSendRequest(
          {
            url: `/techTickets/${ticketId}/ticketLog`,
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: {
              message: "Replied to the ticket.",
              userId,
            },
          },
          (logData) => {
            setTicketLogs((prevVal) => {
              return [...prevVal, logData];
            });
          }
        );
      }
    );
  };

  return (
    <Fragment>
      {data && !isLoading && (
        <Box display="flex" flexWrap="wrap" margin="2rem" gap="2rem">
          {/* LEFT SIDE */}
          <Box display="flex" flexDirection="column" gap="2rem" flexGrow="1" width={isNonMobile ? "32%" : "100%"}>
            <Box height="fit-content" backgroundColor={theme.palette.background.light} p="1rem" borderRadius="5px">
              <Box display="flex" gap="1rem" alignItems="center">
                <Box
                  component="img"
                  alt="profile"
                  src={serverAddress + "/" + data.user.profileImage}
                  crossOrigin="use-credentials"
                  height="32px"
                  width="32px"
                  borderRadius="50%"
                  sx={{ objectFit: "cover" }}
                />
                <Typography variant="h3">{data.title}</Typography>
              </Box>
              <Box mt="2rem">
                {data.messages[0] && parse(data.messages[0].message)}
                {data.messages[0] && data.messages[0].image.length > 0 && (
                  <Box component="img" alt="ticket image" src={serverAddress + "/" + data.messages[0].image} crossOrigin="use-credentials" maxWidth="50%" sx={{ objectFit: "cover" }} />
                )}
              </Box>
            </Box>
            {/* MESSAGES */}
            {data.messages.map((m, index) => {
              if (index === 0) return null;
              return <TicketMessage key={index} element={m} setData={setData} setTicketLogs={setTicketLogs} ticketId={ticketId} userId={userId} />;
            })}
            {/* TEXT EDITOR */}
            <Box>
              <Typography variant="h3" mb="1rem">
                Reply To Ticket
              </Typography>
              <TextEditor isLoading={messageIsLoading} saveMessage={saveMessageHandler} />
            </Box>
          </Box>
          {/* RIGHT SIDE */}
          <Box display="flex" flexDirection="column" gap="2rem" flexGrow={isNonMobile ? "0.6" : "1"} width="10%" height="fit-content">
            {/* TICKET DETAILS */}
            <Box backgroundColor={theme.palette.background.light} p="1rem" borderRadius="5px">
              <Typography variant="h3" mb="2rem">
                Ticket Details
              </Typography>
              <Box display="flex" gap="1rem">
                <Typography color={theme.palette.grey[500]}>Ticket ID:</Typography>
                <Typography color={theme.palette.grey[200]}>{data._id}</Typography>
              </Box>
              <Divider sx={{ borderColor: theme.palette.grey[700], mt: "1rem", mb: "1rem" }} />
              <Box display="flex" gap="1rem">
                <Typography color={theme.palette.grey[500]}>User:</Typography>
                <Typography color={theme.palette.grey[200]}>{`${data.user.firstName} ${data.user.lastName}`}</Typography>
              </Box>
              <Divider sx={{ borderColor: theme.palette.grey[700], mt: "1rem", mb: "1rem" }} />
              <Box display="flex" gap="1rem">
                <Typography color={theme.palette.grey[500]}>User Email:</Typography>
                <Typography color={theme.palette.grey[200]}>{data.user.email}</Typography>
              </Box>
              <Divider sx={{ borderColor: theme.palette.grey[700], mt: "1rem", mb: "1rem" }} />
              <Box display="flex" gap="1rem">
                <Typography color={theme.palette.grey[500]}>Created At:</Typography>
                <Typography color={theme.palette.grey[200]}>{getDate(data.createdAt)}</Typography>
              </Box>
              <Divider sx={{ borderColor: theme.palette.grey[700], mt: "1rem", mb: "1rem" }} />
              <Box display="flex" gap="1rem">
                <Typography color={theme.palette.grey[500]}>Updated At:</Typography>
                <Typography color={theme.palette.grey[200]}>{getDate(data.updatedAt)}</Typography>
              </Box>
              <Divider sx={{ borderColor: theme.palette.grey[700], mt: "1rem", mb: "1rem" }} />
              <Box display="flex" gap="1rem">
                <Typography color={theme.palette.grey[500]}>Category:</Typography>
                <Typography color={theme.palette.grey[200]}>{data.category}</Typography>
              </Box>
              <FlexBetween display="flex" gap="0.5rem" mt="3rem">
                <Box display="flex" alignItems="center" gap="1rem">
                  <Typography color={theme.palette.grey[500]}>Status:</Typography>
                  <FormControl variant="standard">
                    <Select
                      value={ticketStatus}
                      onChange={changeTicketStatusHandler}
                      sx={{
                        "::before": {
                          borderBottom: `1px solid ${theme.palette.grey[200]}`,
                        },
                        color: theme.palette.grey[200],
                        "& .MuiSvgIcon-root": {
                          color: theme.palette.grey[200],
                        },
                      }}
                    >
                      <MenuItem value="New">New</MenuItem>
                      <MenuItem value="In Progress">In Progress</MenuItem>
                      <MenuItem value="Closed">Closed</MenuItem>
                    </Select>
                  </FormControl>
                </Box>
                <Box>
                  <Tooltip title="Edit" placement="top" arrow>
                    <IconButton
                      onClick={() => {
                        navigate(`/admin/tickets/edit/${ticketId}`);
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
                  <AlertDialog title="Delete Ticket?" content="Are you sure you want to delete this ticket?" open={openDialog} setOpen={setOpenDialog} handleConfirm={deleteTicketHandler} />
                </Box>
              </FlexBetween>
            </Box>
            {/* TICKET HISTORY */}
            <Box backgroundColor={theme.palette.background.light} p="1rem" borderRadius="5px">
              <Typography variant="h3" mb="2rem">
                Ticket History
              </Typography>
              {ticketLogs.toReversed().map((l) => {
                return (
                  <Box key={l._id}>
                    <Box display="flex" gap="1rem">
                      <Box
                        component="img"
                        alt="profile"
                        src={serverAddress + "/" + l.user.profileImage}
                        crossOrigin="use-credentials"
                        height="32px"
                        width="32px"
                        borderRadius="50%"
                        sx={{ objectFit: "cover" }}
                      />
                      <Box>
                        {parse(l.message)}
                        <Typography color={theme.palette.grey[200]} fontSize="12px">
                          {getDate(l.createdAt)}
                        </Typography>
                      </Box>
                    </Box>
                    <Divider sx={{ borderColor: theme.palette.grey[700], mt: "1rem", mb: "1rem" }} />
                  </Box>
                );
              })}
            </Box>
          </Box>
        </Box>
      )}
    </Fragment>
  );
};

export default TicketDetails;
