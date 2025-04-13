import { useImageGallery } from "@/provider/ImageGalleryContext";
import { Box, Modal } from "@mui/material";
import Image from "next/image";
import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

const PhotoModal = () => {
  const { open, setOpen, deleteImage, active } = useImageGallery();
  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div>
        <div className="flex justify-end mr-10 mt-10 gap-4 ">
          <button className=" cursor-pointer" onClick={() => setOpen(false)}>
            <CloseIcon className="text-white" />
          </button>
          <button
            onClick={deleteImage}
            className="bg-red-400 text-white px-2 py-1 rounded cursor-pointer"
          >
            <DeleteIcon />
          </button>
        </div>
        <Box sx={style}>
          <Image
            width={400}
            height={400}
            className="object-contain max-h-[800px] rounded-lg w-full"
            src={active?.imgUrl || ""}
            alt={active?.title || ""}
            quality={100}
          />
        </Box>
      </div>
    </Modal>
  );
};

export default PhotoModal;
