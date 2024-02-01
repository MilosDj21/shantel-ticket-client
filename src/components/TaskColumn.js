import { Box, useTheme } from "@mui/material";
import TaskSingle from "./TaskSingle";
import TextOrInput from "./TextOrInput";
import useHttp from "../hooks/use-http";

const TaskColumn = ({ column }) => {
  const theme = useTheme();
  const { sendRequest } = useHttp();

  const saveColumnTitleHandler = async (columnTitle) => {
    // save updated column(task group) title
    sendRequest(
      {
        url: `/postTaskGroups/${column._id}`,
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          title: columnTitle,
        },
      },
      (groupData) => {
        console.log(groupData);
      }
    );
    console.log(columnTitle);
  };

  return (
    <Box
      sx={{
        maxWidth: "20%",
        mt: "2rem",
        p: "0.4rem 0.7rem",
        borderRadius: "5px",
        ":hover": {
          border: `1px solid ${theme.palette.grey[800]}`,
        },
      }}
    >
      <TextOrInput fontSize="16px" textValue={column.title} callback={saveColumnTitleHandler} />
      {column.tasks.map((t) => (
        <TaskSingle key={t._id} title={t.title} msgNum={t.messages.length} status={t.status} />
      ))}
    </Box>
  );
};

export default TaskColumn;
