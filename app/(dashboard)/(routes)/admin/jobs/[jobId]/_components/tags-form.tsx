"use client";
import { Button } from "@/components/ui/button";

import { zodResolver } from "@hookform/resolvers/zod";
import { Job } from "@prisma/client";
import axios from "axios";
import { Lightbulb, Loader2, Pencil, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface TagFormProps {
  initialData: Job;
  jobId: string;
}

const formSchema = z.object({
  tags: z.array(z.string()).min(1),
});

export const TagForm = ({ initialData, jobId }: TagFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [prompt, setPrompt] = useState("");
  const [isPrompting, setIsPrompting] = useState(false);
  const [jobTags, setJobTags] = useState<string[]>(initialData.tags);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData,
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/jobs/${jobId}`, values);
      toast.success("Job Updated");
      toggleEditing();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
    //console.log(values);
  };

  const toggleEditing = () => setIsEditing((current) => !current);

  //   const handlePromptGeneration = async () => {
  //     try {
  //       setIsPrompting(true);
  //       const customPrompt = `Generate an array of top 10 keywords related to the job profession "${prompt}". These keywords should encompass various aspects of the profession, including skills, responsibilities, tools, and technologies commonly associated with it. Aim for a diverse set of keywords that accurately represent the breadth of the profession. Your output should be a list/array of keywords. Just return me the array alone.`;

  //       await getGenerativeAIResponse(customPrompt).then((data) => {
  //         // check if response is an array or not

  //         if (Array.isArray(data)) {
  //           console.log("in client side :", JSON.parse(data));
  //           setJobTags((prevTags) => [...prevTags, ...JSON.parse(data)]);
  //         }

  //         setIsPrompting(false);
  //       });
  //     } catch (error) {
  //       console.log(error);
  //       toast.error("Something went wrong");
  //     }
  //   };

  const handlePromptGeneration = async () => {
    try {
      setIsPrompting(true);
      const customPrompt = `Generate an array of top 10 keywords related to the job profession "${prompt}". These keywords should encompass various aspects of the profession, including skills, responsibilities, tools, and technologies commonly associated with it. Aim for a diverse set of keywords that accurately represent the breadth of the profession. Your output should be a list/array of keywords. Just return me the array alone.
      Return ONLY a valid JSON array of strings. 
No introductory text, no markdown code blocks, just the array.
Example format: ["keyword1", "keyword2", "keyword3"]`;

      const response = await axios.post("/api/generate-ai-content", {
        prompt: customPrompt,
      });

      const data = response.data.data;

      // 1. Clean the string of any Markdown backticks (```json ... ```)
      const cleanedText = data.replace(/```json|```/g, "").trim();

      try {
        // 2. Convert the String into a real JavaScript Array
        const parsedArray = JSON.parse(cleanedText);

        // 3. Now Array.isArray will return true
        if (Array.isArray(parsedArray)) {
          console.log("in client side :", parsedArray);
          setJobTags((prevTags) => [...prevTags, ...parsedArray]);
          // console.log("inside is array checker");
          // console.log(parsedArray); // This will now log your 10 keywords

          // If you need to save these to your state:
          // setKeywords(parsedArray);
        } else {
          console.error("AI returned JSON, but it was not an array.");
        }
      } catch {
        console.error(
          "Could not parse AI response as JSON. AI returned:",
          cleanedText,
        );
      }

      setIsPrompting(false);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const handleTagRemove = (index: number) => {
    const updatedTags = [...jobTags];
    updatedTags.splice(index, 1);
    setJobTags(updatedTags);
  };

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Job Tags
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
      {/* display the category if not edting */}
      {!isEditing && (
        <div className="flex items-center flex-wrap gap-2">
          {initialData.tags.length > 0 ? (
            initialData.tags.map((tag, index) => (
              <div
                className="text-xs flex items-center gap-1 whitespace-nowrap py-1 px-2 rounded-md bg-purple-100"
                key={index}
              >
                {tag}
              </div>
            ))
          ) : (
            <p>No Tags</p>
          )}
        </div>
      )}

      {/* on editing mode show the form */}
      {isEditing && (
        <>
          <div className="flex items-center gap-2 my-2 ">
            <input
              type="text"
              placeholder="e.g 'Backend Developer'"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="w-full p-2 rounded-md bg-white"
            />
            {isPrompting ? (
              <>
                <Button>
                  <Loader2 className="w-4 h-4 animate-spin" />
                </Button>
              </>
            ) : (
              <>
                <Button onClick={handlePromptGeneration}>
                  <Lightbulb className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>
          <p className="text-xs text-muted-foreground text-right">
            *Note : Profession Name alone enough to generate the tags
          </p>

          <div className="flex items-center gap-2 flex-wrap">
            {jobTags.length > 0 ? (
              jobTags.map((tag, index) => (
                <div
                  key={index}
                  className="text-xs flex items-center gap-1 whitespace-nowrap py-1 px-2 rounded-md bg-purple-100"
                >
                  {tag}
                  {isEditing && (
                    <Button
                      variant={"ghost"}
                      className="p-0 h-auto"
                      onClick={() => handleTagRemove(index)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  )}
                </div>
              ))
            ) : (
              <p className="text-sm italic">No Tags</p>
            )}
          </div>
          <div className="flex items-center gap-2 justify-end mt-4">
            <Button
              type="button"
              variant={"outline"}
              onClick={() => {
                setJobTags([]);
                onSubmit({ tags: [] });
              }}
              disabled={isSubmitting}
            >
              Clear All
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              onClick={() => onSubmit({ tags: jobTags })}
            >
              Save
            </Button>
          </div>
        </>
      )}
    </div>
  );
};
