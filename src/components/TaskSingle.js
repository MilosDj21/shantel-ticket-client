import { Box, Typography, useTheme } from "@mui/material";

const serverAddress = process.env.ENVIRONMENT === "production" ? process.env.REACT_APP_PROD_BASE_URL : process.env.REACT_APP_DEV_BASE_URL;

const TaskSingle = ({ title, msgNum, assignedUser }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: theme.palette.background.light,
        p: "0.4rem",
        m: "0.4rem 0",
        cursor: "pointer",
        borderRadius: "9px",
        border: `1px solid ${theme.palette.grey[800]}`,
        ":hover": {
          borderColor: theme.palette.grey[700],
        },
      }}
    >
      <Typography fontSize="0.80rem" mb="1.5rem">
        {title}
      </Typography>
      <Box display="flex" justifyContent="space-between">
        {assignedUser ? (
          <Box
            component="img"
            alt="profile"
            src={serverAddress + "/" + assignedUser.profileImage}
            crossOrigin="use-credentials"
            height="32px"
            width="32px"
            borderRadius="50%"
            sx={{ objectFit: "cover" }}
          />
        ) : (
          <Box />
        )}
        <Typography
          sx={{
            fontSize: "0.60rem",
            p: "0.2rem 0.5rem",
            m: "5px 0",
            backgroundColor: theme.palette.secondary[700],
            borderRadius: "20px 20px 20px 0",
          }}
        >
          {msgNum}
        </Typography>
      </Box>
    </Box>
  );
};

export default TaskSingle;
