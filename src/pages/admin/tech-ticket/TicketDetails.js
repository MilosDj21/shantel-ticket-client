import { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, useTheme, useMediaQuery, Divider, Select, MenuItem, FormControl } from "@mui/material";

import useHttp from "../../../hooks/use-http";

const serverAddress = process.env.ENVIRONMENT === "production" ? process.env.REACT_APP_PROD_BASE_URL : process.env.REACT_APP_DEV_BASE_URL;

const TicketDetails = () => {
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const { ticketId } = useParams();
  const { isLoading, sendRequest } = useHttp();
  const [data, setData] = useState(null);
  const [ticketStatus, setTicketStatus] = useState(null);

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

  useEffect(() => {
    const getTicketDetails = (ticketData) => {
      setData(ticketData);
      setTicketStatus(ticketData.status);
      console.log(ticketData);
    };

    sendRequest(
      {
        url: `/techTickets/${ticketId}`,
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
      getTicketDetails
    );
  }, [sendRequest, ticketId]);

  return (
    <Fragment>
      {data && !isLoading && (
        <Box display="flex" flexWrap="wrap" margin="2rem" gap="2rem">
          {/* LEFT SIDE */}
          <Box flexGrow="1" width={isNonMobile ? "32%" : "100%"} backgroundColor={theme.palette.background.light} p="1rem" borderRadius="5px">
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
              {data.messages[0] && (
                <Typography color={theme.palette.grey[200]} mb="1rem">
                  {data.messages[0].message}
                </Typography>
              )}
              {data.messages[0] && data.messages[0].image.length > 0 && (
                <Box component="img" alt="ticket image" src={serverAddress + "/" + data.messages[0].image} crossOrigin="use-credentials" maxWidth="100%" sx={{ objectFit: "cover" }} />
              )}
            </Box>
          </Box>
          {/* RIGHT SIDE */}
          <Box flexGrow={isNonMobile ? "0.6" : "1"} width="10%" backgroundColor={theme.palette.background.light} p="1rem" borderRadius="5px">
            <Typography variant="h3" mb="2rem">
              Ticket Details
            </Typography>
            <Box display="flex" gap="1rem">
              <Typography color={theme.palette.grey[500]}>Ticket ID:</Typography>
              <Typography color={theme.palette.grey[200]}>{data._id}</Typography>
            </Box>
            <Divider sx={{ borderColor: theme.palette.grey[200], mt: "1rem", mb: "1rem" }} />
            <Box display="flex" gap="1rem">
              <Typography color={theme.palette.grey[500]}>User:</Typography>
              <Typography color={theme.palette.grey[200]}>{`${data.user.firstName} ${data.user.lastName}`}</Typography>
            </Box>
            <Divider sx={{ borderColor: theme.palette.grey[200], mt: "1rem", mb: "1rem" }} />
            <Box display="flex" gap="1rem">
              <Typography color={theme.palette.grey[500]}>User Email:</Typography>
              <Typography color={theme.palette.grey[200]}>{data.user.email}</Typography>
            </Box>
            <Divider sx={{ borderColor: theme.palette.grey[200], mt: "1rem", mb: "1rem" }} />
            <Box display="flex" gap="1rem">
              <Typography color={theme.palette.grey[500]}>Created At:</Typography>
              <Typography color={theme.palette.grey[200]}>{getDate(data.createdAt)}</Typography>
            </Box>
            <Divider sx={{ borderColor: theme.palette.grey[200], mt: "1rem", mb: "1rem" }} />
            <Box display="flex" gap="1rem">
              <Typography color={theme.palette.grey[500]}>Updated At:</Typography>
              <Typography color={theme.palette.grey[200]}>{getDate(data.updatedAt)}</Typography>
            </Box>
            <Divider sx={{ borderColor: theme.palette.grey[200], mt: "1rem", mb: "1rem" }} />
            <Box display="flex" gap="1rem">
              <Typography color={theme.palette.grey[500]}>Category:</Typography>
              <Typography color={theme.palette.grey[200]}>{data.category}</Typography>
            </Box>
            <Box display="flex" gap="1rem" mt="3rem">
              <FormControl variant="standard">
                <Select
                  value={ticketStatus}
                  onChange={(event) => setTicketStatus(event.target.value)}
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
          </Box>
        </Box>
      )}
    </Fragment>
  );
};

export default TicketDetails;
