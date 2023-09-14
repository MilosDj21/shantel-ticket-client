import { Box, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, useTheme } from "@mui/material";

const AlertDialog = ({ title, content, open, setOpen, handleConfirm }) => {
  const theme = useTheme();
  return (
    <Box>
      <Dialog open={open} onClose={() => setOpen(false)} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle
          sx={{
            color: theme.palette.grey[200],
            backgroundColor: theme.palette.background.light,
          }}
          id="alert-dialog-title"
        >
          {title}
        </DialogTitle>
        <DialogContent
          sx={{
            backgroundColor: theme.palette.background.light,
          }}
        >
          <DialogContentText color={theme.palette.grey[200]} id="alert-dialog-description">
            {content}
          </DialogContentText>
        </DialogContent>
        <DialogActions
          sx={{
            backgroundColor: theme.palette.background.light,
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
            No
          </Button>
          <Button
            onClick={() => {
              handleConfirm();
              setOpen(false);
            }}
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AlertDialog;
