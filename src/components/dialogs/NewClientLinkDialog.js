import React, { useState, useEffect } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, useTheme, Slide, InputBase, Typography, Autocomplete, TextField, Tooltip, IconButton } from "@mui/material";
import { Link, Person, Add } from "@mui/icons-material";

import useHttp from "../../hooks/use-http";
import NewClientDialog from "./NewClientDialog";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const NewClientLinkDialog = ({ title, open, setOpen, handleConfirm }) => {
  const theme = useTheme();
  const { isLoading, error, sendRequest } = useHttp();
  const [url, setUrl] = useState("");
  const [client, setClient] = useState(null);
  const [clientList, setClientList] = useState(null);
  const [openClientDialog, setOpenClientDialog] = useState(false);

  const clientAutocompleteProps = {
    options: clientList,
    getOptionLabel: (option) => option.email,
  };

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
        console.log("clients:", clientData);
        setClientList(clientData);
      }
    );
  }, [sendRequest]);

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
        }}>
        <DialogTitle
          sx={{
            color: theme.palette.grey[200],
            backgroundColor: theme.palette.background.default,
            fontSize: "20px",
            textAlign: "center",
            p: "1.5rem",
          }}
          id="alert-dialog-title">
          {title}
        </DialogTitle>
        <DialogContent
          sx={{
            backgroundColor: theme.palette.background.default,
          }}>
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
            <Box backgroundColor={theme.palette.background.light} display="flex" alignItems="center" justifyContent="space-between" borderRadius="9px" p="0.1rem 1.5rem" width="100%">
              <Box display="flex" alignItems="center" borderRadius="9px" gap="1rem" width="90%">
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
                  }}>
                  Client
                </Typography>
                {!isLoading && !error && clientList && (
                  <Autocomplete
                    {...clientAutocompleteProps}
                    value={client}
                    onChange={(event, newValue) => {
                      setClient(newValue);
                    }}
                    renderInput={(params) => <TextField {...params} variant="standard" />}
                    sx={{
                      "& .MuiAutocomplete-input": {
                        width: "100% !important",
                      },
                      "& .MuiInputBase-root": {
                        color: `${theme.palette.grey[500]} !important`,
                      },
                      "& .MuiInputBase-root::before": {
                        borderBottom: `1px solid ${theme.palette.grey[200]}`,
                      },
                      color: theme.palette.grey[500],
                      "& .MuiSvgIcon-root": {
                        color: theme.palette.grey[200],
                      },
                    }}
                  />
                )}
              </Box>
              <Box>
                <Tooltip title="Add new client" placement="top" arrow>
                  <IconButton
                    onClick={() => {
                      setOpenClientDialog(true);
                    }}>
                    <Add
                      sx={{
                        color: theme.palette.grey.main,
                        fontSize: "30px",
                        border: `1px solid ${theme.palette.grey.main}`,
                        borderRadius: "5px",
                        ":hover": {
                          color: theme.palette.grey[900],
                          backgroundColor: theme.palette.grey.main,
                        },
                      }}
                    />
                  </IconButton>
                </Tooltip>
              </Box>
            </Box>
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            backgroundColor: theme.palette.background.default,
            p: "0 1.5rem 1.5rem 0",
          }}>
          <Button
            onClick={() => {
              setUrl("");
              setClient(null);
              setOpen(false);
            }}
            sx={{
              color: "white",
            }}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleConfirm(url, client);
              setUrl("");
              setClient(null);
            }}
            autoFocus>
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <NewClientDialog title="Add New Client" open={openClientDialog} setOpen={setOpenClientDialog} setClient={setClient} setClientList={setClientList} />
    </Box>
  );
};

export default NewClientLinkDialog;
