"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  useRef,
  useCallback,
} from "react";
import client from "@/lib/supabase";
import { toast } from "react-hot-toast";
import { useSearch } from "@/provider/SearchProvider";

interface Item {
  id: number;
  imgUrl: string;
  title: string;
}

interface ImageGalleryContextType {
  items: Item[];
  open: boolean;
  active: Item | null;
  openAdd: boolean;
  spinnerRef: React.RefObject<HTMLDivElement | null>;
  setOpen: (open: boolean) => void;
  setActive: (item: Item | null) => void;
  setOpenAdd: (open: boolean) => void;
  deleteImage: () => Promise<void>;
  loadMore: () => Promise<void>;
  isLoading: boolean;
}

const ImageGalleryContext = createContext<ImageGalleryContextType | null>(null);

export const ImageGalleryProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [items, setItems] = useState<Item[]>([]);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState<Item | null>(null);
  const [openAdd, setOpenAdd] = useState(false);
  const spinnerRef = useRef<HTMLDivElement>(null);
  const { search } = useSearch();
  const [hasMore, setHasMore] = useState(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const lastIdRef = useRef<number | null>(null);

  // Load more images (pagination)
  const loadMore = useCallback(async () => {
    if (!hasMore || isLoading) return;
    setIsLoading(true);
    try {
      let query = client
        .from("images")
        .select("id, imgUrl, title")
        .order("id", { ascending: false })
        .limit(15);

      if (lastIdRef.current) {
        query = query.lt("id", lastIdRef.current);
      }

      if (search.trim()) {
        query = query.ilike("title", `%${search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      if (data.length) {
        setItems((prev) => [...prev, ...data]);
        lastIdRef.current = data[data.length - 1].id;
        setHasMore(data.length === 15);
      } else {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Error loading more images:", error);
      toast.error("Failed to load more images");
    } finally {
      setIsLoading(false);
    }
  }, [hasMore, search, isLoading]);

  // Reset pagination when search changes
  useEffect(() => {
    setItems([]);
    setHasMore(true);
    lastIdRef.current = null;
  }, [search]);

  // Intersection Observer for infinite scroll
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) loadMore();
      },
      {
        threshold: 0.1,
      }
    );

    const currentSpinner = spinnerRef.current;
    if (currentSpinner) observer.observe(currentSpinner);

    return () => {
      if (currentSpinner) observer.unobserve(currentSpinner);
    };
  }, [loadMore]);

  // Delete an image
  const deleteImage = useCallback(async () => {
    if (!active) return;

    try {
      const url = new URL(active.imgUrl);
      const pathParts = url.pathname.split("/");
      const filePath = pathParts.slice(6).join("/");
      const decodedFilePath = decodeURIComponent(filePath);

      // Delete from storage
      await client.storage.from("images").remove([decodedFilePath]);

      // Delete from database
      const { error: deleteError } = await client
        .from("images")
        .delete()
        .eq("id", active.id);

      if (deleteError) throw deleteError;

      // Update UI
      setItems((prev) => prev.filter((item) => item.id !== active.id));
      toast.success("Image deleted successfully");
      setOpen(false);
    } catch (error) {
      console.error("Error deleting image:", error);
      toast.error("Error deleting image");
    }
  }, [active]);

  return (
    <ImageGalleryContext.Provider
      value={{
        items,
        open,
        active,
        openAdd,
        spinnerRef,
        setOpen,
        setActive,
        setOpenAdd,
        deleteImage,
        loadMore,
        isLoading,
      }}
    >
      {children}
    </ImageGalleryContext.Provider>
  );
};

// Custom hook for consuming the context
export const useImageGallery = () => {
  const context = useContext(ImageGalleryContext);
  if (!context) {
    throw new Error(
      "useImageGallery must be used within an ImageGalleryProvider"
    );
  }
  return context;
};
