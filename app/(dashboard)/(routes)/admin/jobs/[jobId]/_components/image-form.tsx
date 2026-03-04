"use client";
import { ImageUpload } from "@/components/image-upload";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { zodResolver } from "@hookform/resolvers/zod";
import { Job } from "@prisma/client";
import axios from "axios";
import { ImageIcon, Pencil } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface ImageFormProps {
  initialData: Job;
  jobId: string;
}

const formSchema = z.object({
  // imageUrl: z.string().min(1),
  imageUrl: z.string().optional(),
  imagePublicId: z.string().optional(),
});

export const ImageForm = ({ initialData, jobId }: ImageFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      imageUrl: initialData?.imageUrl || "",
      imagePublicId: initialData?.imagePublicId || "",
    },
  });

  const { isSubmitting, isDirty } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      console.log(values); // 🔥 Check this
      await axios.patch(`/api/jobs/${jobId}`, values);
      toast.success("Image Updated");
      toggleEditing();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
    console.log(values);
  };

  const toggleEditing = () => setIsEditing((current) => !current);

  return (
    <div className="mt-6 border bg-neutral-100 rounded-2xl p-4">
      <div className="font-medium flex items-center justify-between">
        Job Cover Image
        <Button onClick={toggleEditing} variant={"ghost"}>
          {isEditing ? (
            <>Cancel</>
          ) : (
            <>
              <Pencil className="w-4 h-4" />
              Edit
            </>
          )}
        </Button>
      </div>
      {/* display the imageUrl if not edting */}
      {!isEditing &&
        (!initialData.imageUrl ? (
          <div className="flex items-center justify-center h-60 bg-neutral-200 rounded-md">
            <ImageIcon className="h-10 w-10 text-neutral-500 " />
          </div>
        ) : (
          <div className="relative w-full h-60 aspect-video mt-2">
            <Image
              alt="cover image"
              fill
              sizes="100vw"
              className="w-full h-full object-cover rounded-md"
              src={initialData?.imageUrl}
            />
          </div>
        ))}

      {/* on editing mode show the form */}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <ImageUpload
                      value={field.value}
                      disabled={isSubmitting}
                      onChange={(url, publicId) => {
                        form.setValue("imageUrl", url, {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                        form.setValue("imagePublicId", publicId, {
                          shouldDirty: true,
                        });
                      }}
                      onRemove={() => {
                        form.setValue("imageUrl", "", {
                          shouldValidate: true,
                          shouldDirty: true,
                        });
                        form.setValue("imagePublicId", "", {
                          shouldDirty: true,
                        });
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center gap-x-2">
              <Button disabled={!isDirty || isSubmitting} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
