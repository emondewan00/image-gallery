"use client";
import { Box, Button, Modal } from "@mui/material";
import React, { useCallback, useEffect, useRef, useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";
import Image from "next/image";
import AddPhotoForm from "@/components/AddPhotoForm";
import client from "@/lib/supabase";
import toast from "react-hot-toast";
import { useSearch } from "@/provider/SearchProvider";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
};

type Item = {
  imgUrl: string;
  title: string;
  id: number;
};

const Home = () => {
  const [open, setOpen] = useState<boolean>(false);
  const [active, setActive] = useState<Item>({
    id: 0,
    imgUrl: "",
    title: "",
  });
  const { search } = useSearch();
  const [hasMore, setHasMore] = useState<boolean>(true);
  const [items, setItems] = useState<Item[]>([]);
  const spinnerRef = useRef<HTMLDivElement>(null);
  const lastIdRef = useRef<number | null>(null);

  // Reset pagination when search term changes
  useEffect(() => {
    setItems([]);
    lastIdRef.current = null;
    setHasMore(true);
  }, [search]);

  const loadMore = useCallback(async () => {
    if (!hasMore) return;

    try {
      let query = client
        .from("images")
        .select("*")
        .order("id", { ascending: false }) // Order by ID
        .limit(15);

      // Add cursor-based pagination if we have a last ID
      if (lastIdRef.current) {
        query = query.lt("id", lastIdRef.current);
      }

      // Add title search condition if searchTerm exists
      if (search.trim()) {
        query = query.ilike("title", `%${search}%`);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching data:", error);
        return;
      }

      if (data.length) {
        setItems((prev) => [...prev, ...data]);
        lastIdRef.current = data[data.length - 1].id;
        setHasMore(data.length === 15);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error in loadMore:", error);
    }
  }, [hasMore, search]);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        loadMore();
      }
    });

    const currentSpinner = spinnerRef.current;
    if (currentSpinner) {
      observer.observe(currentSpinner);
    }

    return () => {
      if (currentSpinner) {
        observer.unobserve(currentSpinner);
      }
    };
  }, [loadMore]);

  const [openAdd, setOpenAdd] = useState<boolean>(false);
  const handleClose = () => setOpen(false);

  const deleteImage = async () => {
    try {
      const url = new URL(active.imgUrl);
      const pathParts = url.pathname.split("/");
      const filePath = pathParts.slice(6).join("/"); // Extract the file path
      const decodedFilePath = decodeURIComponent(filePath);

      await client.storage.from("images").remove([decodedFilePath]);
      setItems((prev) => prev.filter((item) => item.id !== active.id));
      // Delete the record from the "images" table
      const { error: deleteError } = await client
        .from("images")
        .delete()
        .eq("id", active.id);

      if (deleteError) {
        console.error("Error deleting record:", deleteError);
        toast.error("Error deleting record");
        return;
      }
      toast.success("Image deleted successfully");
      setOpen(false);
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Error deleting image");
    }
  };

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

      {/*  photo modal */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <div>
          <div className="flex justify-end mr-10 mt-10 gap-4 ">
            <button className=" cursor-pointer" onClick={handleClose}>
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
              src={active?.imgUrl}
              alt={active?.title}
              quality={100}
            />
          </Box>
        </div>
      </Modal>
    </div>
  );
};

export default Home;
