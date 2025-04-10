import Image from "next/image";
import React from "react";
import Dropzone from "react-dropzone";
import imagePlaceholder from "../public/image.png";
import AddPhotoAlternateIcon from "@mui/icons-material/AddPhotoAlternate";

const AddPhotoForm = () => {
  const [images, setImages] = React.useState<File[]>([]);

  return (
    <div className="bg-white rounded p-6 max-w-lg shadow min-w-md">
      <h1 className="text-3xl mb-4 text-slate-900">Upload Images</h1>
      <form className="flex flex-col gap-4">
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
            </div>
          )}
        </Dropzone>

        <div className="flex flex-col gap-2">
          <label className="text-slate-900 font-medium">Image Title</label>
          <input
            placeholder="Image title"
            className="border px-2 py-4 rounded border-gray-300 text-slate-900"
          />
        </div>
        <button
          type="submit"
          className="flex items-center justify-center gap-2 bg-blue-400 text-white px-2 py-4 rounded"
        >
          <AddPhotoAlternateIcon />
          <p>Upload</p>
        </button>
      </form>
    </div>
  );
};

export default AddPhotoForm;
