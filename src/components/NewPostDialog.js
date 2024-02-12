import React, { useState, useEffect } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, useTheme, Slide, InputBase, Typography, FormControl, Select, MenuItem } from "@mui/material";
import { Title, Language, Anchor, Link, AccessTime, Numbers, Article } from "@mui/icons-material";
import useHttp from "../hooks/use-http";
import NewWebsiteDialog from "./NewWebsiteDialog";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const NewPostDialog = ({ title, content, open, setOpen, handleConfirm }) => {
  const theme = useTheme();
  const { isLoading, error, sendRequest } = useHttp();
  const { sendRequest: newWebsiteSendRequest } = useHttp();
  const [postTitle, setPostTitle] = useState("");
  const [websiteList, setWebsiteList] = useState(null);
  const [website, setWebsite] = useState("Pick Website");
  const [anchor, setAnchor] = useState("");
  const [link, setLink] = useState("");
  const [urgency, setUrgency] = useState("");
  const [postCategory, setPostCategory] = useState("");
  const [wordNum, setWordNum] = useState("");
  const [clientHasText, setClientHasText] = useState(false);
  const [openWebsiteDialog, setOpenWebsiteDialog] = useState(false);

  useEffect(() => {
    sendRequest(
      {
        url: "/websites",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
      (websiteData) => {
        console.log(websiteData);
        setWebsiteList(websiteData);
      }
    );
  }, [sendRequest]);

  const selectWebsiteHandler = (event) => {
    if (event.target.value === "addnew") {
      setOpenWebsiteDialog(true);
      setWebsite("Pick Website");
    } else {
      setWebsite(event.target.value);
    }
  };

  const confirmWebsiteDialogHandler = (url, category) => {
    const trimmed = url.trim();
    if (trimmed.length === 0) return;
    const lastChar = trimmed.substring(trimmed.length - 1);
    const filteredUrl = lastChar === "/" ? trimmed.substring(0, trimmed.length - 1) : trimmed;
    newWebsiteSendRequest(
      {
        url: "/websites",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          url: filteredUrl,
          category,
        },
      },
      (websiteData) => {
        console.log(websiteData);
        setWebsiteList((prevVal) => {
          return [websiteData, ...prevVal];
        });
        setWebsite(websiteData._id);
      }
    );
    setOpenWebsiteDialog(false);
  };

  return (
    <Box>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        // aria-describedby="alert-dialog-description"
        fullWidth
        maxWidth="md"
        TransitionComponent={Transition}
        sx={{
          "& .MuiDialog-container": {
            // justifyContent: "end",
          },
        }}
        PaperProps={{
          sx: {
            borderRadius: "9px",
            // height: "100vh",
            // m: "0",
          },
        }}
      >
        <DialogTitle
          sx={{
            color: theme.palette.grey[200],
            backgroundColor: theme.palette.background.default,
            fontSize: "20px",
            textAlign: "center",
            p: "1.5rem",
          }}
          id="alert-dialog-title"
        >
          {title}
        </DialogTitle>
        <DialogContent
          sx={{
            backgroundColor: theme.palette.background.default,
          }}
        >
          {/* <DialogContentText color={theme.palette.grey[200]} id="alert-dialog-description">
            {content}
          </DialogContentText> */}
          <Box display="flex" flexDirection="column" alignItems="center" gap="1.5rem" p="3rem 3rem 3rem 3rem" backgroundColor="rgba(17, 18, 20, 0.3)" borderRadius="9px" width="100%">
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
                placeholder="Title"
                sx={{
                  color: theme.palette.grey[300],
                  p: "0.2rem 0",
                  fontSize: "18px",
                  width: "100%",
                }}
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
              />
            </Box>

            {/* Website */}
            <Box backgroundColor={theme.palette.background.light} display="flex" alignItems="center" borderRadius="9px" gap="1rem" p="0.1rem 1.5rem" width="100%">
              <Language
                sx={{
                  color: theme.palette.grey[700],
                  fontSize: "30px",
                }}
              />
              <Typography
                sx={{
                  color: theme.palette.grey[700],
                  p: "0.2rem 0",
                  fontSize: "18px",
                }}
              >
                Website
              </Typography>
              <FormControl
                variant="standard"
                sx={{
                  "& .MuiFormControl-root": {
                    width: "100%",
                  },
                }}
              >
                <Select
                  value={website}
                  onChange={(event) => selectWebsiteHandler(event)}
                  sx={{
                    "::before": {
                      borderBottom: `1px solid ${theme.palette.grey[200]}`,
                    },
                    color: theme.palette.grey[500],
                    "& .MuiSvgIcon-root": {
                      color: theme.palette.grey[200],
                    },
                  }}
                >
                  <MenuItem value="Pick Website" disabled>
                    Pick Website
                  </MenuItem>
                  <MenuItem value="addnew">Add New</MenuItem>
                  {!isLoading &&
                    !error &&
                    websiteList &&
                    websiteList.map((w) => {
                      return (
                        <MenuItem key={w._id} value={w._id}>
                          {w.url}
                        </MenuItem>
                      );
                    })}
                </Select>
              </FormControl>
            </Box>

            {/* Post Category */}
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
                placeholder="Post Category"
                sx={{
                  color: theme.palette.grey[300],
                  p: "0.2rem 0",
                  fontSize: "18px",
                  width: "100%",
                }}
                value={postCategory}
                onChange={(e) => setPostCategory(e.target.value)}
              />
            </Box>

            {/* Anchor */}
            <Box backgroundColor={theme.palette.background.light} display="flex" alignItems="center" borderRadius="9px" gap="1rem" p="0.1rem 1.5rem" width="100%">
              <Anchor
                sx={{
                  color: theme.palette.grey[700],
                  fontSize: "30px",
                }}
              />
              <InputBase
                error
                required
                type="text"
                placeholder="Anchor"
                sx={{
                  color: theme.palette.grey[300],
                  p: "0.2rem 0",
                  fontSize: "18px",
                  width: "100%",
                }}
                value={anchor}
                onChange={(e) => setAnchor(e.target.value)}
              />
            </Box>

            {/* Link */}
            <Box backgroundColor={theme.palette.background.light} display="flex" alignItems="center" borderRadius="9px" gap="1rem" p="0.1rem 1.5rem" width="100%">
              <Link
                sx={{
                  color: theme.palette.grey[700],
                  fontSize: "30px",
                }}
              />
              <InputBase
                error
                required
                type="text"
                placeholder="Link"
                sx={{
                  color: theme.palette.grey[300],
                  p: "0.2rem 0",
                  fontSize: "18px",
                  width: "100%",
                }}
                value={link}
                onChange={(e) => setLink(e.target.value)}
              />
            </Box>

            {/* Urgency Level */}
            <Box backgroundColor={theme.palette.background.light} display="flex" alignItems="center" borderRadius="9px" gap="1rem" p="0.1rem 1.5rem" width="100%">
              <AccessTime
                sx={{
                  color: theme.palette.grey[700],
                  fontSize: "30px",
                }}
              />
              <InputBase
                error
                required
                type="text"
                placeholder="Urgency level"
                sx={{
                  color: theme.palette.grey[300],
                  p: "0.2rem 0",
                  fontSize: "18px",
                  width: "100%",
                }}
                value={urgency}
                onChange={(e) => setUrgency(e.target.value)}
              />
            </Box>

            {/* Word Num */}
            <Box backgroundColor={theme.palette.background.light} display="flex" alignItems="center" borderRadius="9px" gap="1rem" p="0.1rem 1.5rem" width="100%">
              <Numbers
                sx={{
                  color: theme.palette.grey[700],
                  fontSize: "30px",
                }}
              />
              <InputBase
                error
                required
                type="text"
                placeholder="Word Num"
                sx={{
                  color: theme.palette.grey[300],
                  p: "0.2rem 0",
                  fontSize: "18px",
                  width: "100%",
                }}
                value={wordNum}
                onChange={(e) => setWordNum(e.target.value)}
              />
            </Box>

            {/* Client Has Text */}
            <Box display="flex" alignItems="center" backgroundColor={theme.palette.background.light} borderRadius="9px" gap="1rem" p="0.3rem 1.5rem" width="100%">
              <Article
                sx={{
                  color: theme.palette.grey[700],
                  fontSize: "30px",
                }}
              />
              <Typography
                sx={{
                  color: theme.palette.grey[700],
                  p: "0.2rem 0",
                  fontSize: "18px",
                }}
              >
                Client has text:
              </Typography>
              <FormControl
                variant="standard"
                sx={{
                  "& .MuiFormControl-root": {
                    width: "100%",
                  },
                }}
              >
                <Select
                  value={clientHasText}
                  onChange={(event) => setClientHasText(event.target.value)}
                  sx={{
                    "::before": {
                      borderBottom: `1px solid ${theme.palette.grey[200]}`,
                    },
                    color: theme.palette.grey[500],
                    "& .MuiSvgIcon-root": {
                      color: theme.palette.grey[200],
                    },
                  }}
                >
                  <MenuItem value={true}>Yes</MenuItem>
                  <MenuItem value={false}>No</MenuItem>
                </Select>
              </FormControl>
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
              setOpen(false);
            }}
            sx={{
              color: "white",
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleConfirm(postTitle, website, postCategory, anchor, link, urgency, wordNum, clientHasText);
              // setOpen(false);
            }}
            autoFocus
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <NewWebsiteDialog title="Add New Website" open={openWebsiteDialog} setOpen={setOpenWebsiteDialog} handleConfirm={confirmWebsiteDialogHandler} />
    </Box>
  );
};

export default NewPostDialog;
