import { Box, Typography, useTheme } from "@mui/material";

const TaskSingle = ({ title, msgNum, status }) => {
  const theme = useTheme();

  let statusBackground = "";
  switch (status) {
    case "New":
      statusBackground = "#34488e";
      break;
    case "In Progress":
      statusBackground = theme.palette.secondary[700];
      break;
    case "Closed":
      statusBackground = "#913232";
      break;
    default:
      break;
  }

  return (
    <Box
      sx={{
        width: "100%",
        backgroundColor: theme.palette.background.light,
        p: "0.4rem",
        m: "0.4rem 0",
        cursor: "pointer",
        borderRadius: "5px",
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
        <Typography
          sx={{
            fontSize: "0.60rem",
            p: "0.3rem 0.5rem",
            borderRadius: "20px",
            backgroundColor: statusBackground,
          }}
        >
          {status}
        </Typography>
        <Typography
          sx={{
            fontSize: "0.60rem",
            p: "0.2rem 0.5rem",
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
