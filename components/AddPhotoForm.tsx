import Image from "next/image";
import React, { FormEvent } from "react";
import Dropzone from "react-dropzone";
import imagePlaceholder from "../public/image.png";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";
import AttachFileIcon from "@mui/icons-material/AttachFile";
import prettyBytes from "pretty-bytes";
import client from "@/lib/supabase";
import toast from "react-hot-toast";

type AddPhotoFormProps = {
  onClose: () => void;
};

const AddPhotoForm: React.FC<AddPhotoFormProps> = ({ onClose }) => {
  const [images, setImages] = React.useState<File[]>([]);
  const [title, setTitle] = React.useState<string>("");

  const content = images.length > 0 && (
    <div className="flex items-center justify-between w-6/10 mt-2 text-slate-950">
      <div className="flex gap-2 items-center">
        <AttachFileIcon />
        <p>{images.length} files selected</p>
      </div>
      <p>{prettyBytes(images.reduce((acc, curr) => acc + curr.size, 0))}</p>
    </div>
  );

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    try {
      // 1. Upload all images to storage
      const imagesRes = await Promise.all(
        images.map(async (image) => {
          const fileName = `${image.name.split(".")[0]}-${Date.now()}`;

          const { error } = await client.storage
            .from("images")
            .upload(fileName, image);

          if (error) {
            throw error;
          }

          // 2. Get public URL for each uploaded image
          const {
            data: { publicUrl },
          } = client.storage.from("images").getPublicUrl(fileName);
          return { imgUrl: publicUrl, title };
        })
      );

      // 3. Filter out any undefined values (failed uploads)
      const successfulUploads = imagesRes.filter((url) => url !== undefined);

      if (successfulUploads.length > 0) {
        // 4. Store the image URLs in your table
        const { error: tableError } = await client
          .from("images")
          .insert(successfulUploads);

        if (tableError) {
          toast.error("Please try again");
          return;
        }
        toast.success("Images uploaded successfully");
        onClose();
      } else {
        toast.error("No images were successfully uploaded");
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error("Please try again");
    }
  };

  return (
    <div className="bg-white rounded p-6 max-w-lg shadow min-w-md">
      <h1 className="text-3xl mb-4 text-slate-900">Upload Images</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Dropzone
          onDrop={(acceptedFile) => setImages(acceptedFile)}
          accept={{
            "image/jpeg": [".jpg", ".jpeg"],
            "image/png": [".png"],
            "image/gif": [".gif"],
          }}
        >
          {({ getRootProps, getInputProps }) => (
            <div
              {...getRootProps()}
              className="border border-dashed rounded border-gray-300 p-4 flex  flex-col items-center justify-center h-60 cursor-pointer"
            >
              <input {...getInputProps()} />

              <Image
                width={100}
                height={100}
                src={imagePlaceholder}
                alt="upload"
                quality={100}
                className="font-extrabold text-blue-400"
              />
              <p className="text-slate-500">Drag and drop or click</p>
              {content}
            </div>
          )}
        </Dropzone>

        <div className="flex flex-col gap-2">
          <label className="text-slate-900 font-medium">Image Title</label>
          <input
            placeholder="Image title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border px-2 py-4 rounded border-gray-300 text-slate-900"
            required
          />
        </div>
        <button
          type="submit"
          className="flex items-center justify-center gap-2 bg-blue-400 text-white px-2 py-4 rounded cursor-pointer"
        >
          <AddPhotoAlternateIcon />
          <p>Upload</p>
        </button>
      </form>
    </div>
  );
};

export default AddPhotoForm;
