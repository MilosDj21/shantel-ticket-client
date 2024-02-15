import React, { useState, useEffect } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  useTheme,
  Slide,
  InputBase,
  Typography,
  FormControl,
  Select,
  MenuItem,
  Autocomplete,
  TextField,
  Tooltip,
  IconButton,
} from "@mui/material";
import { Title, Language, Anchor, Link, AccessTime, Numbers, Article, Add } from "@mui/icons-material";

import useHttp from "../../hooks/use-http";
import NewWebsiteDialog from "./NewWebsiteDialog";
import NewClientLinkDialog from "./NewClientLinkDialog";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const NewPostDialog = ({ title, open, setOpen, handleConfirm }) => {
  const theme = useTheme();
  const { isLoading: getWebsitesIsLoading, error: getWebsitesError, sendRequest: getWebsitesSendRequest } = useHttp();
  const { isLoading: getLinksSendIsLoading, error: getLinksSendError, sendRequest: getLinksSendRequest } = useHttp();
  const [postTitle, setPostTitle] = useState("");
  const [website, setWebsite] = useState(null);
  const [websiteList, setWebsiteList] = useState(null);
  const [anchor, setAnchor] = useState("");
  const [link, setLink] = useState(null);
  const [linkList, setLinkList] = useState(null);
  const [urgency, setUrgency] = useState("");
  const [postCategory, setPostCategory] = useState("Placeni");
  const [wordNum, setWordNum] = useState("");
  const [clientHasText, setClientHasText] = useState(false);
  const [openWebsiteDialog, setOpenWebsiteDialog] = useState(false);
  const [openLinkDialog, setOpenLinkDialog] = useState(false);

  let linkStatusColor = theme.palette.grey.main;
  if (link) {
    switch (link.status) {
      case "Odobren":
        linkStatusColor = theme.palette.primary.main;
        break;
      case "Semafor":
        linkStatusColor = "#eddd50";
        break;
      case "Pijaca":
        linkStatusColor = "#b14fea";
        break;
      case "Odbijen":
        linkStatusColor = "#e84e4e";
        break;
      default:
        linkStatusColor = theme.palette.grey.main;
    }
  }

  const websiteAutocompleteProps = {
    options: websiteList,
    getOptionLabel: (option) => option.url,
  };

  const linkAutocompleteProps = {
    options: linkList,
    getOptionLabel: (option) => option.url,
  };

  useEffect(() => {
    getWebsitesSendRequest(
      {
        url: "/websites",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
      (websiteData) => {
        console.log("websites:", websiteData);
        setWebsiteList(websiteData);
      }
    );
    getLinksSendRequest(
      {
        url: "/clientLinks",
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      },
      (linksData) => {
        console.log("links", linksData);
        setLinkList(linksData);
      }
    );
  }, [getWebsitesSendRequest, getLinksSendRequest]);

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
            <Box backgroundColor={theme.palette.background.light} display="flex" alignItems="center" justifyContent="space-between" borderRadius="9px" p="0.1rem 1.5rem" width="100%">
              <Box display="flex" alignItems="center" borderRadius="9px" gap="1rem" width="90%">
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
                  }}>
                  Website
                </Typography>
                {!getWebsitesIsLoading && !getWebsitesError && websiteList && (
                  <Autocomplete
                    {...websiteAutocompleteProps}
                    value={website}
                    onChange={(event, newValue) => {
                      setWebsite(newValue);
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
                <Tooltip title="Add new website" placement="top" arrow>
                  <IconButton
                    onClick={() => {
                      setOpenWebsiteDialog(true);
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

            {/* Post Category */}
            <Box display="flex" alignItems="center" backgroundColor={theme.palette.background.light} borderRadius="9px" gap="1rem" p="0.3rem 1.5rem" width="100%">
              <Title
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
                Post Type
              </Typography>
              <FormControl
                variant="standard"
                sx={{
                  "& .MuiFormControl-root": {
                    width: "100%",
                  },
                }}>
                <Select
                  value={postCategory}
                  onChange={(event) => setPostCategory(event.target.value)}
                  sx={{
                    "::before": {
                      borderBottom: `1px solid ${theme.palette.grey[200]}`,
                    },
                    color: theme.palette.grey[500],
                    "& .MuiSvgIcon-root": {
                      color: theme.palette.grey[200],
                    },
                  }}>
                  <MenuItem value="Placeni">Placeni</MenuItem>
                  <MenuItem value="Insercija">Insercija</MenuItem>
                  <MenuItem value="Wayback">Wayback</MenuItem>
                  <MenuItem value="Redovni">Redovni</MenuItem>
                  <MenuItem value="Ostalo">Ostalo</MenuItem>
                </Select>
              </FormControl>
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
            <Box backgroundColor={theme.palette.background.light} display="flex" alignItems="center" justifyContent="space-between" borderRadius="9px" p="0.1rem 1.5rem" width="100%">
              <Box display="flex" alignItems="center" borderRadius="9px" gap="1rem" width="60%">
                <Link
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
                  Client Link
                </Typography>
                {!getLinksSendIsLoading && !getLinksSendError && linkList && (
                  <Autocomplete
                    {...linkAutocompleteProps}
                    value={link}
                    onChange={(event, newValue) => {
                      setLink(newValue);
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
              <Box display={link ? "block" : "none"}>
                <Typography
                  sx={{
                    color: linkStatusColor,
                    p: "0.2rem 0",
                    fontSize: "18px",
                  }}>
                  {link && link.status}
                </Typography>
              </Box>
              <Box>
                <Tooltip title="Add new client link" placement="top" arrow>
                  <IconButton
                    onClick={() => {
                      setOpenLinkDialog(true);
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
                }}>
                Client has text:
              </Typography>
              <FormControl
                variant="standard"
                sx={{
                  "& .MuiFormControl-root": {
                    width: "100%",
                  },
                }}>
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
                  }}>
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
          }}>
          <Button
            onClick={() => {
              setOpen(false);
            }}
            sx={{
              color: "white",
            }}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleConfirm(postTitle, website, postCategory, anchor, link, urgency, wordNum, clientHasText);
            }}
            autoFocus>
            Save
          </Button>
        </DialogActions>
      </Dialog>
      <NewWebsiteDialog title="Add New Website" open={openWebsiteDialog} setOpen={setOpenWebsiteDialog} setWebsite={setWebsite} setWebsiteList={setWebsiteList} />
      <NewClientLinkDialog title="Add New Link" open={openLinkDialog} setOpen={setOpenLinkDialog} setLink={setLink} setLinkList={setLinkList} />
    </Box>
  );
};

export default NewPostDialog;
