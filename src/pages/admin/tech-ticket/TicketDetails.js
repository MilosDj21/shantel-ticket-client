import { Fragment, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Box, Typography, useTheme } from "@mui/material";

import useHttp from "../../../hooks/use-http";

const serverAddress = process.env.ENVIRONMENT === "production" ? process.env.REACT_APP_PROD_BASE_URL : process.env.REACT_APP_DEV_BASE_URL;

const TicketDetails = () => {
  const theme = useTheme();
  const { ticketId } = useParams();
  const { isLoading, sendRequest } = useHttp();
  const [data, setData] = useState(null);

  useEffect(() => {
    const getTicketDetails = (ticketData) => {
      setData(ticketData);
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
        <Box display="flex" margin="2rem" gap="2rem">
          {/* LEFT SIDE */}
          <Box flexGrow="1" backgroundColor={theme.palette.background.light} p="1rem" borderRadius="5px">
            <Box width="100%" display="flex" gap="2rem" alignItems="center">
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
              <Typography color={theme.palette.grey[200]}>{data.messages[0].message}</Typography>
              {data.messages[0].image.length > 0 && (
                <Box component="img" alt="ticket image" src={serverAddress + "/" + data.messages[0].image} crossOrigin="use-credentials" width="500px" sx={{ objectFit: "cover" }} />
              )}
            </Box>
          </Box>
          {/* RIGHT SIDE */}
          <Box flexGrow="0.6" backgroundColor={theme.palette.background.light} p="1rem" borderRadius="5px">
            <Typography variant="h3">{data.title}</Typography>
          </Box>
        </Box>
      )}
    </Fragment>
  );
};

export default TicketDetails;
