import React, { Fragment } from "react";
import { Box, Typography, useTheme } from "@mui/material";
import parse from "html-react-parser";

const serverAddress = process.env.ENVIRONMENT === "production" ? process.env.REACT_APP_PROD_BASE_URL : process.env.REACT_APP_DEV_BASE_URL;

const TaskMessageSingle = ({ message }) => {
  const theme = useTheme();

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

  return (
    <Fragment>
      {message && (
        <Box display="flex" flexDirection="column" gap="0.3rem" mb="2rem">
          {/* Message header */}
          <Box display="flex" gap="0.5rem" alignItems="center">
            <Box
              component="img"
              alt="profile"
              src={serverAddress + "/" + message.user.profileImage}
              crossOrigin="use-credentials"
              height="32px"
              width="32px"
              borderRadius="50%"
              sx={{ objectFit: "cover" }}
            />
            <Box display="flex" gap="0.3rem" alignItems="center">
              <Typography color={theme.palette.grey[200]}>{message.user.firstName}</Typography>
              <Typography color={theme.palette.grey[200]}>{message.user.lastName}</Typography>
            </Box>
            <Typography fontSize="12px" color={theme.palette.grey[600]}>
              {getDate(message.createdAt)}
            </Typography>
          </Box>

          {/* Message content */}
          <Box
            ml="calc(0.5rem + 32px)"
            color={theme.palette.grey[200]}
            display="flex"
            flexDirection="column"
            gap="0.5rem"
            sx={{
              wordBreak: "break-all",
              "& p": {
                margin: 0,
              },
            }}
          >
            {parse(message.message)}

            {/* Image */}
            {message.image && (
              <Box component="img" alt="message image" src={serverAddress + "/" + message.image} maxWidth="30%" crossOrigin="use-credentials" sx={{ objectFit: "cover", borderRadius: "5px" }} />
            )}
          </Box>
        </Box>
      )}
    </Fragment>
  );
};

export default TaskMessageSingle;
