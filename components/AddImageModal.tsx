import { useImageGallery } from "@/provider/ImageGalleryContext";
import { Box, Modal } from "@mui/material";
import React from "react";
import AddPhotoForm from "./AddPhotoForm";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

const AddImageModal = () => {
  const { openAdd, setOpenAdd } = useImageGallery();
  return (
    <Modal
      open={openAdd}
      onClose={() => setOpenAdd(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <AddPhotoForm onClose={() => setOpenAdd(false)} />
      </Box>
    </Modal>
  );
};

export default AddImageModal;
