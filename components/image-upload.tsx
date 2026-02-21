"use client";

import { ImagePlus, Trash } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Button } from "./ui/button";

interface ImageUploadProps {
  disabled?: boolean;
  onChange: (url: string, publicId: string) => void;
  onRemove: () => void;
  value?: string;
}
export const ImageUpload = ({
  disabled,
  onChange,
  onRemove,
  value,
}: ImageUploadProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [progress, setProgress] = useState<number>(0);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!e.target.files?.length) return;

      const file = e.target.files[0];
      setIsLoading(true);
      setProgress(0);

      const formData = new FormData();
      formData.append("file", file);
      formData.append(
        "upload_preset",
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!,
      );

      const xhr = new XMLHttpRequest();

      xhr.open(
        "POST",
        `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      );

      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          const percent = (event.loaded / event.total) * 100;
          setProgress(percent);
        }
      };

      xhr.onload = () => {
        const response = JSON.parse(xhr.responseText);

        if (xhr.status === 200) {
          onChange(response.secure_url, response.public_id);
          toast.success("Image uploaded successfully");
        } else {
          toast.error("Upload failed");
        }

        setIsLoading(false);
      };

      xhr.onerror = () => {
        console.error("Upload failed");
        toast.error("Network error while uploading");
        setIsLoading(false);
      };

      xhr.send(formData);
    } catch (error) {
      console.error(error);
      setIsLoading(false);
    }
  };

  const onDelete = () => {
    if (disabled) return;

    onRemove();
  };
  return (
    <div>
      {value ? (
        <>
          <div className="w-full h-60 aspect-video relative rounded-md flex items-center justify-center overflow-hidden">
            <Image
              alt="Image Cover"
              fill
              className="w-full h-full object-cover"
              src={value}
            />
            <div
              className="absolute z-10 top-2 right-2 cursor-pointer"
              onClick={onDelete}
            >
              <Button size="icon" variant="destructive">
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="w-full h-60 aspect-video relative rounded-md flex items-center justify-center overflow-hidden border-dashed bg-neutral-50 ">
            {isLoading ? (
              <>
                <p>{`${progress.toFixed(2)}%`}</p>
              </>
            ) : (
              <>
                <label>
                  <div className="w-full h-full flex flex-col gap-2 items-center justify-center cursor-pointer">
                    <ImagePlus className="h-10 w-10 text-neutral-500" />
                    <p>Upload an Image</p>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    className="w-0 h-0"
                    onChange={onUpload}
                  />
                </label>
              </>
            )}
          </div>
        </>
      )}
    </div>
  );
};
