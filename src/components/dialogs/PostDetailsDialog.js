import React from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, useTheme, Slide, Divider, Typography } from "@mui/material";

const serverAddress = process.env.ENVIRONMENT === "production" ? process.env.REACT_APP_PROD_BASE_URL : process.env.REACT_APP_DEV_BASE_URL;

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="left" ref={ref} {...props} />;
});

const PostDetailsDialog = ({ post, open, setOpen, handleConfirm }) => {
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

  const getProgress = (progress) => {
    let progressDisplay = "";
    switch (progress) {
      case "new":
        progressDisplay = "Novi";
        break;
      case "pendingCheck":
        progressDisplay = "Ceka Na Proveru";
        break;
      case "doneCheck":
        progressDisplay = "Provera Zavrsena";
        break;
      case "pendingWrite":
        progressDisplay = "Ceka Pisanje";
        break;
      case "doneWrite":
        progressDisplay = "Pisanje Zavrseno";
        break;
      case "pendingPublish":
        progressDisplay = "Ceka Na Objavu";
        break;
      case "donePublish":
        progressDisplay = "Objavljen";
        break;
      default:
    }
    return progressDisplay;
  };

  return (
    <Box>
      {post && (
        <Dialog
          open={open}
          onClose={() => setOpen(false)}
          aria-labelledby="alert-dialog-title"
          fullWidth
          maxWidth="md"
          TransitionComponent={Transition}
          sx={{
            "& .MuiDialog-container": {
              justifyContent: "end",
            },
          }}
          PaperProps={{
            sx: {
              height: "100%",
              maxHeight: "100%",
              m: "0",
            },
          }}
        >
          <DialogTitle
            sx={{
              color: theme.palette.grey[200],
              backgroundColor: theme.palette.background.default,
              fontSize: "20px",
              fontWeight: 800,
              p: "1.5rem",
            }}
            id="alert-dialog-title"
          >
            {post.title}
          </DialogTitle>
          <DialogContent
            sx={{
              backgroundColor: theme.palette.background.default,
              display: "flex",
              alignItems: "center",
            }}
          >
            <Box display="flex" flexDirection="column" p="2rem" backgroundColor={theme.palette.background.light} borderRadius="5px" width="100%">
              <Box display="flex" gap="1rem">
                <Typography color={theme.palette.grey[500]}>Website:</Typography>
                <Typography color={theme.palette.grey[200]}>{post.website.url}</Typography>
              </Box>
              <Divider sx={{ borderColor: theme.palette.grey[700], mt: "1rem", mb: "1rem" }} />
              <Box display="flex" gap="1rem">
                <Typography color={theme.palette.grey[500]}>Anchor:</Typography>
                <Typography color={theme.palette.grey[200]}>{post.anchorKeyword}</Typography>
              </Box>
              <Divider sx={{ borderColor: theme.palette.grey[700], mt: "1rem", mb: "1rem" }} />
              <Box display="flex" gap="3rem">
                <Box display="flex" gap="1rem">
                  <Typography color={theme.palette.grey[500]}>Client Link:</Typography>
                  <Typography color={theme.palette.grey[200]}>{post.clientPaidLink.url}</Typography>
                </Box>
                <Box display="flex" gap="1rem">
                  <Typography color={theme.palette.grey[500]}>Link Status:</Typography>
                  <Typography color={theme.palette.grey[200]}>{post.clientPaidLink.status}</Typography>
                </Box>
              </Box>
              <Divider sx={{ borderColor: theme.palette.grey[700], mt: "1rem", mb: "1rem" }} />
              <Box display="flex" gap="1rem">
                <Typography color={theme.palette.grey[500]}>Post Category:</Typography>
                <Typography color={theme.palette.grey[200]}>{post.postCategory}</Typography>
              </Box>
              <Divider sx={{ borderColor: theme.palette.grey[700], mt: "1rem", mb: "1rem" }} />
              <Box display="flex" gap="1rem">
                <Typography color={theme.palette.grey[500]}>Progress Level:</Typography>
                <Typography color={theme.palette.grey[200]}>{getProgress(post.progressLevel)}</Typography>
              </Box>
              <Divider sx={{ borderColor: theme.palette.grey[700], mt: "1rem", mb: "1rem" }} />
              <Box display="flex" gap="1rem">
                <Typography color={theme.palette.grey[500]}>Urgency Level:</Typography>
                <Typography color={theme.palette.grey[200]}>{post.urgencyLevel}</Typography>
              </Box>
              <Divider sx={{ borderColor: theme.palette.grey[700], mt: "1rem", mb: "1rem" }} />
              <Box display="flex" gap="1rem">
                <Typography color={theme.palette.grey[500]}>Word Number:</Typography>
                <Typography color={theme.palette.grey[200]}>{post.wordNum}</Typography>
              </Box>
              <Divider sx={{ borderColor: theme.palette.grey[700], mt: "1rem", mb: "1rem" }} />
              <Box display="flex" gap="3rem">
                <Box display="flex" gap="1rem" alignItems="center">
                  <Typography color={theme.palette.grey[500]}>Writer:</Typography>
                  {post.copywriter && (
                    <Box
                      component="img"
                      alt="profile"
                      src={serverAddress + "/" + post.copywriter.profileImage}
                      crossOrigin="use-credentials"
                      height="32px"
                      width="32px"
                      borderRadius="50%"
                      sx={{ objectFit: "cover" }}
                    />
                  )}
                </Box>
                <Box display="flex" gap="1rem" alignItems="center">
                  <Typography color={theme.palette.grey[500]}>Editor:</Typography>
                  {post.editor && (
                    <Box
                      component="img"
                      alt="profile"
                      src={serverAddress + "/" + post.editor.profileImage}
                      crossOrigin="use-credentials"
                      height="32px"
                      width="32px"
                      borderRadius="50%"
                      sx={{ objectFit: "cover" }}
                    />
                  )}
                </Box>
              </Box>
              <Divider sx={{ borderColor: theme.palette.grey[700], mt: "1rem", mb: "1rem" }} />
              <Box display="flex" gap="1rem">
                <Typography color={theme.palette.grey[500]}>Created At:</Typography>
                <Typography color={theme.palette.grey[200]}>{getDate(post.createdAt)}</Typography>
              </Box>
              <Divider sx={{ borderColor: theme.palette.grey[700], mt: "1rem", mb: "1rem" }} />
              <Box display="flex" gap="1rem">
                <Typography color={theme.palette.grey[500]}>Updated At:</Typography>
                <Typography color={theme.palette.grey[200]}>{getDate(post.updatedAt)}</Typography>
              </Box>
            </Box>
          </DialogContent>
          <DialogActions
            sx={{
              backgroundColor: theme.palette.background.default,
              p: "0 1.5rem 1.5rem 0",
            }}
          >
            <Button
              onClick={() => {
                // setEmail("");
                // setOpen(false);
              }}
              sx={{
                color: "white",
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                // handleConfirm(email);
                // setEmail("");
              }}
              autoFocus
            >
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
};

export default PostDetailsDialog;
