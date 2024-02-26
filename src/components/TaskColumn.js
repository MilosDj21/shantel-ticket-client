import { Box, useTheme, Typography } from "@mui/material";
import TaskSingle from "./TaskSingle";

const TaskColumn = ({ column }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        // maxWidth: "20%",
        width: "20%",
        // mt: "2rem",
        p: "0.4rem 0.7rem",
        borderRadius: "9px",
        ":hover": {
          border: `1px solid ${theme.palette.grey[800]}`,
        },
      }}
    >
      <Typography fontSize="16px" p="0.4rem 0">
        {column.title}
      </Typography>
      {column.tasks.map((t) => (
        <TaskSingle key={t._id} title={t.post.title} msgNum={t.messages.length} assignedUser={t.assignedUser} />
      ))}
    </Box>
  );
};

export default TaskColumn;
