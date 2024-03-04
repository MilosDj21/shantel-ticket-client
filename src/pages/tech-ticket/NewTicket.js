import { useState } from "react";
import { Box, InputBase, useTheme, MenuItem, Select, Typography, FormControl, useMediaQuery } from "@mui/material";
import { Title } from "@mui/icons-material";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import useHttp from "../../hooks/use-http";
import TextEditor from "../../components/TextEditor";

const NewTicket = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const [subject, setSubject] = useState("");
  const [category, setCategory] = useState("Default");
  const { isLoading, sendRequest } = useHttp();
  const { sendRequest: messageSendRequest } = useHttp();
  const { sendRequest: updateTicketSendRequest } = useHttp();
  const userId = useSelector((state) => state.auth.userId);
  const isNonMobile = useMediaQuery("(min-width: 600px)");

  const saveTicketHandler = async (message, image) => {
    if (!message || !subject) return;

    const formData = new FormData();
    formData.append("message", message);
    formData.append("userId", userId);
    if (image) {
      formData.append("image", image);
    }

    sendRequest(
      {
        url: `/users/${userId}/techTickets`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          title: subject,
          category: category,
        },
      },
      (ticketData) => {
        // SAVE MESSAGE
        messageSendRequest(
          {
            url: `/techTickets/${ticketData._id}/ticketMessage`,
            method: "POST",
            formData: formData,
          },
          (messageData) => {
            // UPDATE SAVE TICKET LOGS
            updateTicketSendRequest({
              url: `/techTickets/${ticketData._id}/ticketLog`,
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: {
                message: "Ticket Created",
                userId,
              },
            });
            navigate("/tickets/");
          },
        );
      },
    );
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" width="100%" height="100%">
      <Box display="flex" flexDirection="column" alignItems="center" gap="2rem" p="4rem 3rem 3rem 3rem" backgroundColor="rgba(17, 18, 20, 0.3)" borderRadius="9px" width={isNonMobile ? "30%" : "100%"}>
        {/* SUBJECT */}
        <Box backgroundColor={theme.palette.background.light} display="flex" alignItems="center" borderRadius="9px" gap="1rem" p="0.1rem 1.5rem" width="100%">
          <Title
            sx={{
              color: theme.palette.grey[700],
              fontSize: "30px",
            }}
          />
          <InputBase
            error
            required
            type="text"
            placeholder="Ticket Subject"
            sx={{
              color: theme.palette.grey[300],
              p: "0.2rem 0",
              fontSize: "18px",
            }}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          />
        </Box>

        {/* CATEGORY */}
        <Box display="flex" alignItems="center" backgroundColor={theme.palette.background.light} borderRadius="9px" gap="1rem" p="0.3rem 1.5rem" width="100%">
          <Typography
            sx={{
              color: theme.palette.grey[500],
              p: "0.2rem 0",
              fontSize: "18px",
            }}>
            Category:
          </Typography>
          <FormControl
            variant="standard"
            sx={{
              "& .MuiFormControl-root": {
                width: "100%",
              },
            }}>
            <Select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              sx={{
                "::before": {
                  borderBottom: `1px solid ${theme.palette.grey[200]}`,
                },
                color: theme.palette.grey[200],
                "& .MuiSvgIcon-root": {
                  color: theme.palette.grey[200],
                },
              }}>
              <MenuItem value="Login">Login</MenuItem>
              <MenuItem value="Indeksiranje">Indeksiranje</MenuItem>
              <MenuItem value="Nesto ne radi">Nesto ne radi</MenuItem>
              <MenuItem value="Novi sajt">Novi sajt</MenuItem>
              <MenuItem value="Default">Default</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* TEXT EDITOR */}
        <Box display="flex" flexWrap="wrap">
          <TextEditor isLoading={isLoading} saveMessage={saveTicketHandler} />
        </Box>
      </Box>
    </Box>
  );
};

export default NewTicket;
