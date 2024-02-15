import React, { useState } from "react";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, useTheme, Slide, InputBase, Typography, FormControl, Select, MenuItem } from "@mui/material";
import { Link, Title } from "@mui/icons-material";

import useHttp from "../../hooks/use-http";

const Transition = React.forwardRef(function Transition(props, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

const NewWebsiteDialog = ({ title, open, setOpen, setWebsite, setWebsiteList }) => {
  const theme = useTheme();
  const { sendRequest } = useHttp();
  const [websiteUrl, setWebsiteUrl] = useState("");
  const [websiteCategory, setWebsiteCategory] = useState("Regularan");

  const createNewWebsiteHandler = (url, category) => {
    const trimmed = url.trim();
    if (trimmed.length === 0) return;
    const lastChar = trimmed.substring(trimmed.length - 1);
    const filteredUrl = lastChar === "/" ? trimmed.substring(0, trimmed.length - 1) : trimmed;
    sendRequest(
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
        console.log("website:", websiteData);
        setWebsiteList((prevVal) => {
          return [websiteData, ...prevVal];
        });
        setWebsite(websiteData);
        setOpen(false);
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
                value={websiteUrl}
                onChange={(e) => setWebsiteUrl(e.target.value)}
              />
            </Box>

            {/* Category */}
            <Box backgroundColor={theme.palette.background.light} display="flex" alignItems="center" borderRadius="9px" gap="1rem" p="0.1rem 1.5rem" width="100%">
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
                Category
              </Typography>
              <FormControl
                variant="standard"
                sx={{
                  "& .MuiFormControl-root": {
                    width: "100%",
                  },
                }}>
                <Select
                  value={websiteCategory}
                  onChange={(event) => setWebsiteCategory(event.target.value)}
                  sx={{
                    "::before": {
                      borderBottom: `1px solid ${theme.palette.grey[200]}`,
                    },
                    color: theme.palette.grey[500],
                    "& .MuiSvgIcon-root": {
                      color: theme.palette.grey[200],
                    },
                  }}>
                  <MenuItem value="Regularan">Regularan</MenuItem>
                  <MenuItem value="Semafor">Semafor</MenuItem>
                  <MenuItem value="Pijaca">Pijaca</MenuItem>
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
              setWebsiteUrl("");
              setWebsiteCategory("Regularan");
              setOpen(false);
            }}
            sx={{
              color: "white",
            }}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              createNewWebsiteHandler(websiteUrl, websiteCategory);
              setWebsiteUrl("");
              setWebsiteCategory("Regularan");
            }}
            autoFocus>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default NewWebsiteDialog;
