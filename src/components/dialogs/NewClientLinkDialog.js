import React, { useState, useEffect } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, useTheme, Slide, InputBase, Typography, FormControl, Select, MenuItem } from "@mui/material";
import { Link, Person } from "@mui/icons-material";

import useHttp from "../../hooks/use-http";
import NewClientDialog from "./NewClientDialog";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const NewClientLinkDialog = ({ title, open, setOpen, handleConfirm }) => {
  const theme = useTheme();
  const { isLoading, error, sendRequest } = useHttp();
  const { sendRequest: newClientSendRequest } = useHttp();
  const [url, setUrl] = useState("");
  const [client, setClient] = useState("");
  const [clientList, setClientList] = useState(null);
  const [openClientDialog, setOpenClientDialog] = useState(false);

  useEffect(() => {
    sendRequest(
      {
        url: "/clients",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
      (clientData) => {
        console.log(clientData);
        setClientList(clientData);
      }
    );
  }, [sendRequest]);

  const selectClientHandler = (event) => {
    if (event.target.value === "addnew") {
      setOpenClientDialog(true);
      setClient("Pick Client");
    } else {
      setClient(event.target.value);
    }
  };

  const confirmClientDialogHandler = (email) => {
    if (!email.includes("@") || !email.includes(".")) return;
    newClientSendRequest(
      {
        url: "/clients",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: {
          email,
        },
      },
      (clientData) => {
        console.log(clientData);
        setClientList((prevVal) => {
          return [clientData, ...prevVal];
        });
        setClient(clientData._id);
      }
    );
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

            {/* Client */}
            <Box backgroundColor={theme.palette.background.light} display="flex" alignItems="center" borderRadius="9px" gap="1rem" p="0.1rem 1.5rem" width="100%">
              <Person
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
                Category
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
                  value={client}
                  onChange={(event) => selectClientHandler(event)}
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
                  <MenuItem value="Pick Client" disabled>
                    Pick Client
                  </MenuItem>
                  <MenuItem value="addnew">Add New</MenuItem>
                  {!isLoading &&
                    !error &&
                    clientList &&
                    clientList.map((c) => {
                      return (
                        <MenuItem key={c._id} value={c._id}>
                          {c.email}
                        </MenuItem>
                      );
                    })}
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
              setUrl("");
              setClient("Regularan");
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
              handleConfirm(url, client);
              setUrl("");
              setClient("Regularan");
            }}
            autoFocus
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <NewClientDialog title="Add New Client" open={openClientDialog} setOpen={setOpenClientDialog} handleConfirm={confirmClientDialogHandler} />
    </Box>
  );
};

export default NewClientLinkDialog;
