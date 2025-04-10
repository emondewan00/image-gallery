"use client";
import { Box, Button, Modal } from "@mui/material";
import React, { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
// import ResponsiveAppBar from "@/components/Header";
import Image from "next/image";
import AddPhotoForm from "@/components/AddPhotoForm";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

const Home = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [active, setActive] = useState<{ img: string; title: string }>({
    img: "",
    title: "",
  });
  const [openAdd, setOpenAdd] = useState<boolean>(false);
  const handleClose = () => setOpen(false);

  return (
    <div className="container mx-auto relative">
      {/* <ResponsiveAppBar /> */}

      {/* photo gallery */}
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 py-4 gap-4">
        {itemData.map((item, i) => (
          <div key={i} className="">
            <Button
              onClick={() => {
                setOpen(true);
                setActive(item);
              }}
            >
              <Image
                width={500}
                height={500}
                src={item.img}
                alt={item.title}
                className="w-full object-contain rounded-lg"
              />
            </Button>
          </div>
        ))}
      </div>

      {/* add image button */}
      <div
        onClick={() => setOpenAdd(true)}
        className="bg-blue-500 p-4 flex items-center justify-center w-fit rounded-full text-white fixed bottom-4 right-4 lg:right-40 cursor-pointer"
      >
        <AddIcon />
      </div>

      {/* add image modal */}
      <Modal
        open={openAdd}
        onClose={() => setOpenAdd(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <AddPhotoForm />
        </Box>
      </Modal>

      {/*  photo modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <>
          <div className="flex justify-end mr-10 mt-10 gap-4 ">
            <button className=" cursor-pointer" onClick={handleClose}>
              <CloseIcon className="text-white" />
            </button>
            <button className="bg-red-400 text-white px-2 py-1 rounded cursor-pointer">
              <DeleteIcon />
            </button>
          </div>
          <Box sx={style}>
            <Image
              width={400}
              height={400}
              className="object-contain max-h-[800px] rounded-lg w-full"
              src={active?.img}
              alt={active?.title}
              quality={100}
            />
          </Box>
        </>
      </Modal>
    </div>
  );
};

export default Home;

const itemData = [
  {
    img: "https://images.unsplash.com/photo-1549388604-817d15aa0110",
    title: "Bed",
  },
  {
    img: "https://images.unsplash.com/photo-1525097487452-6278ff080c31",
    title: "Books",
  },
  {
    img: "https://images.unsplash.com/photo-1523413651479-597eb2da0ad6",
    title: "Sink",
  },
  {
    img: "https://images.unsplash.com/photo-1563298723-dcfebaa392e3",
    title: "Kitchen",
  },
  {
    img: "https://images.unsplash.com/photo-1588436706487-9d55d73a39e3",
    title: "Blinds",
  },
  {
    img: "https://images.unsplash.com/photo-1574180045827-681f8a1a9622",
    title: "Chairs",
  },
  {
    img: "https://images.unsplash.com/photo-1530731141654-5993c3016c77",
    title: "Laptop",
  },
  {
    img: "https://images.unsplash.com/photo-1481277542470-605612bd2d61",
    title: "Doors",
  },
  {
    img: "https://images.unsplash.com/photo-1517487881594-2787fef5ebf7",
    title: "Coffee",
  },
  {
    img: "https://images.unsplash.com/photo-1516455207990-7a41ce80f7ee",
    title: "Storage",
  },
  {
    img: "https://images.unsplash.com/photo-1597262975002-c5c3b14bbd62",
    title: "Candle",
  },
  {
    img: "https://images.unsplash.com/photo-1519710164239-da123dc03ef4",
    title: "Coffee table",
  },
];
