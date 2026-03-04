"use client";

import { FilePlus } from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface AttachmentsUploadsProps {
  disabled?: boolean;
  onChange: (value: { url: string; name: string }[]) => void;
  value: { url: string; name: string }[];
}

export const AttachmentsUploads = ({
  disabled,
  onChange,
  value,
}: AttachmentsUploadsProps) => {
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
    const files: File[] = Array.from(e.target.files || []);

    if (!files.length) return;

    setIsLoading(true);

    // array to store newly uploaded urls
    const newUrls: { url: string; name: string }[] = [];

    // counter to keep track the uploaded files
    let completedFiles = 0;
    let totalBytes = 0;
    let uploadedBytes = 0;

    // Calculate total bytes
    files.forEach((file) => {
      totalBytes += file.size;
    });

    try {
      for (const file of files) {
        const formData = new FormData();
        formData.append("file", file);
        formData.append(
          "upload_preset",
          process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!,
        );

        const xhr = new XMLHttpRequest();

        xhr.upload.addEventListener("progress", (e) => {
          if (e.lengthComputable) {
            const fileProgress = uploadedBytes + e.loaded;
            setProgress(Math.min((fileProgress / totalBytes) * 100, 100));
          }
        });

        await new Promise<void>((resolve, reject) => {
          xhr.addEventListener("load", () => {
            if (xhr.status === 200) {
              const data = JSON.parse(xhr.responseText);
              newUrls.push({
                url: data.secure_url,
                name: file.name,
              });
              uploadedBytes += file.size;
              completedFiles++;

              // check if all files are uploaded
              if (completedFiles === files.length) {
                setIsLoading(false);
                onChange([...(value || []), ...newUrls]);
                toast.success("Files uploaded successfully ✅");
              }
              resolve();
            } else {
              reject(new Error("Upload failed"));
            }
          });

          xhr.addEventListener("error", () => {
            reject(new Error("Upload failed"));
          });

          xhr.open(
            "POST",
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`,
          );
          xhr.send(formData);
        });
      }
    } catch (error) {
      console.error(error);
      toast.error("Upload failed ❌");
      setIsLoading(false);
    }

    // Reset the input
    e.target.value = "";
  };

  return (
    <div>
      <div className="w-full h-40 bg-purple-100 p-2 flex items-center justify-center rounded-md">
        {isLoading ? (
          <>
            <p>{`${progress.toFixed(2)}%`}</p>
          </>
        ) : (
          <>
            <label className="w-full h-full flex items-center justify-center">
              <div className="flex gap-2 items-center justify-center cursor-pointer">
                <FilePlus className="w-6 h-6 mr-2" />
                <p>Add a file</p>
              </div>
              <input
                type="file"
                accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf,.odt"
                multiple
                className="w-0 h-0"
                onChange={onUpload}
                disabled={disabled}
              />
            </label>
          </>
        )}
      </div>
    </div>
  );
};
