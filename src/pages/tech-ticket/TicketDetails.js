import { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Box, Typography, useTheme, useMediaQuery, Divider } from "@mui/material";
import { DoneAll } from "@mui/icons-material";
import parse from "html-react-parser";

import useHttp from "../../hooks/use-http";
import TicketMessage from "../../components/TicketMessage";
import TextEditor from "../../components/TextEditor";
import FlexBetween from "../../components/FlexBetween";

const serverAddress = process.env.ENVIRONMENT === "production" ? process.env.REACT_APP_PROD_BASE_URL : process.env.REACT_APP_DEV_BASE_URL;

const TicketDetails = () => {
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const userId = useSelector((state) => state.auth.userId);
  const { ticketId } = useParams();
  const { isLoading, sendRequest } = useHttp();
  const { isLoading: messageIsLoading, sendRequest: messageSendRequest } = useHttp();
  const { sendRequest: updateTicketSendRequest } = useHttp();
  const [data, setData] = useState(null);

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
        url: `/users/${userId}/techTickets/${ticketId}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
      (ticketData) => {
        setData(ticketData);
        console.log(ticketData);
      },
    );
  }, [sendRequest, ticketId, userId]);

  const saveMessageHandler = async (message, image) => {
    if (!message || message === "<p></p>") return;

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
      async (messageData) => {
        // CHANGE TICKET STATUS TO NEW AFTER USER RESPONSE
        await updateTicketSendRequest({
          url: `/users/${userId}/techTickets/${ticketId}`,
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: {
            status: "New",
          },
        });
        // UPDATE SAVE MESSAGE TICKET LOGS
        await updateTicketSendRequest({
          url: `/techTickets/${ticketId}/ticketLog`,
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: {
            message: "Replied to the ticket.",
            userId,
          },
        });
        // POPULATE DATA AFTER SAVING NEW MESSAGE
        await updateTicketSendRequest(
          {
            url: `/users/${userId}/techTickets/${ticketId}`,
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
          (ticketData) => {
            setData(ticketData);
            console.log(ticketData);
          },
        );
      },
    );
  };
  return (
    <Fragment>
      {data && !isLoading && (
        <Box display="flex" flexWrap="wrap" margin="2rem" gap="2rem">
          {/* LEFT SIDE */}
          <Box display="flex" flexDirection="column" gap="2rem" flexGrow="1" width={isNonMobile ? "32%" : "100%"}>
            <Box height="fit-content" backgroundColor={theme.palette.background.light} p="1rem" borderRadius="5px">
              <FlexBetween>
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
                <Box>
                  <DoneAll
                    sx={{
                      color: data.seenByAdmin ? theme.palette.primary.main : theme.palette.grey[700],
                      fontSize: "30px",
                    }}
                  />
                </Box>
              </FlexBetween>
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
              return <TicketMessage key={index} element={m} setData={setData} setTicketLogs={null} ticketId={ticketId} userId={userId} enableModifyButtons={false} />;
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
            </Box>
          </Box>
        </Box>
      )}
    </Fragment>
  );
};

export default TicketDetails;
