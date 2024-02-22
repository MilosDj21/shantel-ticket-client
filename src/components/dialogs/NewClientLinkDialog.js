import React, { useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, useTheme, Slide, InputBase } from "@mui/material";
import { Link } from "@mui/icons-material";

import useHttp from "../../hooks/use-http";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const NewClientLinkDialog = ({ title, open, setOpen, setClientLink, setClientLinkList, clientWebsite }) => {
  const theme = useTheme();
  const { isLoading, sendRequest } = useHttp();
  const [url, setUrl] = useState("");

  const createNewClientLinkHandler = async (url) => {
    const trimmed = url.trim();
    if (trimmed.length === 0) return;
    const lastChar = trimmed.substring(trimmed.length - 1);
    const filteredUrl = lastChar === "/" ? trimmed.substring(0, trimmed.length - 1) : trimmed;
    if (!isLoading) {
      sendRequest(
        {
          url: "/clientLinks",
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: {
            url: filteredUrl,
            clientWebsite: clientWebsite._id,
          },
        },
        (linkData) => {
          console.log("link:", linkData);
          setClientLinkList((prevVal) => {
            return [linkData, ...prevVal];
          });
          setClientLink(linkData);
          setOpen(false);
        }
      );
    }
  };

  return (
    <Box>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        fullWidth
        maxWidth="md"
        TransitionComponent={Transition}
        sx={{
          "& .MuiDialog-container": {},
        }}
        PaperProps={{
          sx: {
            borderRadius: "9px",
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
          <Box display="flex" flexDirection="column" alignItems="center" gap="1.5rem" p="3rem 3rem 3rem 3rem" backgroundColor="rgba(17, 18, 20, 0.3)" borderRadius="9px" width="100%">
            {/* Url */}
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
                placeholder="Url"
                sx={{
                  color: theme.palette.grey[300],
                  p: "0.2rem 0",
                  fontSize: "18px",
                  width: "100%",
                }}
                value={url}
                onChange={(e) => setUrl(e.target.value)}
              />
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
              setUrl("");
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
              createNewClientLinkHandler(url);
              setUrl("");
            }}
            autoFocus
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NewClientLinkDialog;
