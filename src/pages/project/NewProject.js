import { Fragment, useState } from "react";
import { Box, InputBase, useTheme, useMediaQuery, Button } from "@mui/material";
import { Title } from "@mui/icons-material";

import useHttp from "../../hooks/use-http";
import NewPostDialog from "../../components/dialogs/NewPostDialog";

const NewProject = () => {
  const theme = useTheme();
  const isNonMobile = useMediaQuery("(min-width: 600px)");
  const { isLoading, sendRequest } = useHttp();
  const [title, setTitle] = useState("");
  const [project, setProject] = useState(null);
  const [openNewPostDialog, setOpenNewPostDialog] = useState(false);

  const saveProjectHandle = async () => {
    if (!title) return;
    // Save new project
    sendRequest(
      {
        url: `/projects`,
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          title,
        },
      },
      (projectData) => {
        console.log("project:", projectData);
        setProject(projectData);
        setOpenNewPostDialog(true);
      }
    );
  };

  return (
    <Fragment>
      <Box display="flex" justifyContent="center" alignItems="center" width="100%" height="100%">
        <Box display="flex" flexDirection="column" alignItems="center" gap="2rem" p="3rem" backgroundColor="rgba(17, 18, 20, 0.3)" borderRadius="9px" width={isNonMobile ? "30%" : "100%"}>
          {/* Title */}
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
              placeholder="Project Title"
              sx={{
                color: theme.palette.grey[300],
                p: "0.2rem 0",
                fontSize: "18px",
              }}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Box>
          <Button
            variant="contained"
            disabled={isLoading}
            onClick={saveProjectHandle}
            sx={{
              p: "0.4rem 3.5rem",
              fontSize: "16px",
            }}
          >
            Save
          </Button>
        </Box>
      </Box>
      <NewPostDialog title="Add New Post" open={openNewPostDialog} setOpen={setOpenNewPostDialog} project={project} setProject={setProject} />
    </Fragment>
  );
};

export default NewProject;
