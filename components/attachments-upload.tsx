"use client";

import { FilePlus } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

interface AttachmentsUploadsProps {
  disabled?: boolean;
  jobId?: string;
  value?: { url: string; name: string }[];
  onChange?: (attachments: { url: string; name: string }[]) => void;
}

export const AttachmentsUploads = ({
  disabled,
  jobId,
  value,
  onChange,
}: AttachmentsUploadsProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  useEffect(() => setIsMounted(true), []);
  if (!isMounted) return null;

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    setIsLoading(true);

    let hasSuccess = false;

    try {
      // If onChange is provided, use Cloudinary upload (controlled component)
      if (onChange) {
        const uploadedFiles: { url: string; name: string }[] = [];

        for (const file of files) {
          const formData = new FormData();
          formData.append("file", file);
          formData.append(
            "upload_preset",
            process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!,
          );

          const res = await fetch(
            `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`,
            {
              method: "POST",
              body: formData,
            },
          );

          const data = await res.json();

          if (!res.ok) {
            toast.error(data.error?.message || "Upload failed");
            continue;
          }

          uploadedFiles.push({
            url: data.secure_url,
            name: file.name,
          });
        }

        if (uploadedFiles.length > 0) {
          onChange([...(value || []), ...uploadedFiles]);
          toast.success("Files uploaded successfully");
        }
      } else if (jobId) {
        // Use API upload (uncontrolled component)
        for (const file of files) {
          const formData = new FormData();
          formData.append("file", file);

          const res = await fetch(`/api/jobs/${jobId}/attachments`, {
            method: "POST",
            body: formData,
          });

          if (!res.ok) {
            const message = await res.text();
            toast.error(message || "Upload failed");
            continue;
          }

          hasSuccess = true;
          toast.success("Uploaded successfully");
        }

        if (hasSuccess) {
          router.refresh();
        }
      }
    } catch (err) {
      toast.error("Upload failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <div className="w-full h-40 bg-purple-100 p-2 flex items-center justify-center rounded-md">
        {isLoading ? (
          <p>Uploading...</p>
        ) : (
          <label className="w-full h-full flex items-center justify-center cursor-pointer">
            <FilePlus className="w-6 h-6 mr-2" />
            <p>Add a file</p>
            <input
              type="file"
              multiple
              className="hidden"
              onChange={onUpload}
              disabled={disabled}
            />
          </label>
        )}
      </div>
    </div>
  );
};

// "use client";

// import { FilePlus } from "lucide-react";
// import { useEffect, useState } from "react";
// import toast from "react-hot-toast";

// interface AttachmentsUploadsProps {
//   disabled?: boolean;
//   onChange: (value: { url: string; name: string; publicId: string }[]) => void;
//   value: { url: string; name: string; publicId: string }[];
// }

// export const AttachmentsUploads = ({
//   disabled,
//   onChange,
//   value,
// }: AttachmentsUploadsProps) => {
//   const [isMounted, setIsMounted] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const [progress, setProgress] = useState<number>(0);

//   useEffect(() => {
//     setIsMounted(true);
//   }, []);

//   if (!isMounted) {
//     return null;
//   }

//   const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = Array.from(e.target.files || []);

//     if (!files.length) return;

//     setIsLoading(true);

//     const uploadedFiles: { url: string; name: string; publicId: string }[] = [];

//     try {
//       for (const file of files) {
//         const formData = new FormData();
//         formData.append("file", file);
//         formData.append(
//           "upload_preset",
//           process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!,
//         );

//         const res = await fetch(
//           `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/auto/upload`,
//           {
//             method: "POST",
//             body: formData,
//           },
//         );

//         const data = await res.json();

//         if (!res.ok) {
//           toast.error(data.error?.message || "Upload failed");
//           continue;
//         }

//         uploadedFiles.push({
//           url: data.secure_url,
//           name: file.name,
//           publicId: data.public_id,
//         });
//       }

//       onChange([...value, ...uploadedFiles]);
//       toast.success("Files uploaded successfully ✅");
//     } catch (error) {
//       console.error(error);
//       toast.error("Upload failed ❌");
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div>
//       <div className="w-full h-40 bg-purple-100 p-2 flex items-center justify-center">
//         {isLoading ? (
//           <>
//             <p>{`${progress.toFixed(2)}%`}</p>
//           </>
//         ) : (
//           <>
//             <label className="w-full h-full flex items-center justify-center">
//               <div className="flex  gap-2 items-center justify-center cursor-pointer ">
//                 <FilePlus className="w-3 h-3 mr-2" />
//                 <p>Add a file</p>
//               </div>
//               <input
//                 type="file"
//                 accept=".jpg,.jpeg,.png,.gif,.bmp,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.rtf,.odt"
//                 multiple
//                 className="w-0 h-0"
//                 onChange={onUpload}
//               />
//             </label>
//           </>
//         )}
//       </div>
//     </div>
//   );
// };
