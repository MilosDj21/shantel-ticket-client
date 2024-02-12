import { Modal, Box } from "@mui/material";

const QRcodeDialog = ({ open, setOpen, imgSource }) => {
  return (
    <Modal
      open={open}
      onClose={() => {
        setOpen(false);
      }}
    >
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
      >
        <Box component="img" alt="qr code" src={imgSource} />
      </Box>
    </Modal>
  );
};

export default QRcodeDialog;
