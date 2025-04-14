"use client";
import { Button, Skeleton } from "@mui/material";
import React from "react";
import AddIcon from "@mui/icons-material/Add";
import Image from "next/image";
import { useImageGallery } from "@/provider/ImageGalleryContext";
import AddImageModal from "@/components/AddImageModal";
import PhotoModal from "@/components/PhotoModal";

const Home = () => {
  const { items, setActive, setOpen, setOpenAdd, spinnerRef, isLoading } =
    useImageGallery();

  const numbersOfSkeleton = () => {
    const numbers = [];
    for (let i = 0; i < 12; i++) {
      const randomHeight = Math.floor(Math.random() * 600);
      numbers.push({ height: randomHeight, width: "100%" });
    }
    return numbers;
  };

  if (isLoading) {
    return (
      <div className="mt-20">
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 py-4 gap-4">
          {numbersOfSkeleton().map((item, index) => (
            <div key={index} className="mb-2">
              <Skeleton
                variant="rounded"
                animation="wave"
                height={item.height}
                width={"100%"}
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-20">
      {/* photo gallery */}
      <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 py-4 gap-4">
        {items.map((item) => (
          <div key={item.id}>
            <Button
              onClick={() => {
                setOpen(true);
                setActive(item);
              }}
            >
              <Image
                width={500}
                height={500}
                src={item.imgUrl}
                alt={item.title}
                className="w-full object-contain rounded-lg"
              />
            </Button>
          </div>
        ))}
        {/* spinner */}
        <div
          ref={spinnerRef}
          className="flex items-center justify-center  invisible"
        >
          spinner
        </div>
      </div>

      {/* add image button */}
      <div
        onClick={() => setOpenAdd(true)}
        className="bg-blue-500 p-4 flex items-center justify-center w-fit rounded-full text-white fixed bottom-4 right-4 lg:right-40 cursor-pointer"
      >
        <AddIcon />
      </div>

      {/* add image modal */}
      <AddImageModal />

      {/*  photo modal */}
      <PhotoModal />
    </div>
  );
};

export default Home;
