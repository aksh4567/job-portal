"use client";
import { Editor } from "@/components/editor";
import { Preview } from "@/components/preview";
import { Button } from "@/components/ui/button";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";

import { cn } from "@/lib/utils";
import getGenerativeAIResponse from "@/scripts/aistudio";
import { zodResolver } from "@hookform/resolvers/zod";
import { Job } from "@prisma/client";
import axios from "axios";
import { Copy, Lightbulb, Loader2, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface DescriptionProps {
  initialData: Job;
  jobId: string;
}

const formSchema = z.object({
  description: z.string().min(1),
});

export const Description = ({ initialData, jobId }: DescriptionProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isPrompting, setIsPrompting] = useState(false);

  const [aiValue, setAiValue] = useState("");

  const [rollName, setRollName] = useState("");
  const [skills, setSkills] = useState("");

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      description: initialData?.description || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const response = await axios.patch(`/api/jobs/${jobId}`, values);
      toast.success("Job Updated");
      // setLocalDescription(values.description);
      toggleEditing();
      router.refresh();
    } catch (error) {
      toast.error("Something went wrong");
    }
    console.log(values);
  };

  const toggleEditing = () => setIsEditing((current) => !current);

  const handlePromptGeneration = async () => {
    try {
      setIsPrompting(true);

      const customPrompt = `Could you please draft a job requirements document for the position of ${rollName}? The job description should include roles & responsibilities, key features, and details about the role. The required skills should include proficiency in ${skills}. Additionally, you can list any optional skill related to job.
      Constraint Guidelines:
- DO NOT include introductory text like "Sure, here is..." or "Okay, I've drafted...".
- DO NOT use horizontal rules (---) or excessive symbols like ###.
- DO NOT include an "Application Process" or "About Company" section unless explicitly requested.
- Return ONLY the plain text content of the job description.
- Use simple, clean headers without Markdown symbols.
      `;
      await getGenerativeAIResponse(customPrompt).then((data) => {
        // data = data.replace(/^["']|["']$/g, "");
        // let cleanedText = data.replace(/\*\*/g, "");

        // 1. Remove quotes from start/end
        let cleanedText = data.replace(/^["']|["']$/g, "");

        // 2. Remove Markdown bold (**) and headers (#)
        cleanedText = cleanedText.replace(/[*#]/g, "");

        // 3. Remove horizontal rules (---)
        cleanedText = cleanedText.replace(/^-+$/gm, "");

        // 4. Trim whitespace from start/end to remove extra lines
        cleanedText = cleanedText.trim();

        setAiValue(cleanedText);
        setIsPrompting(false);
      });
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const onCopy = () => {
    navigator.clipboard.writeText(aiValue);
    toast.success("Copied to clipboard");
  };

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Job Description
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
        <div
          className={cn(
            "text-sm mt-2",
            !initialData.description && "text-neutral-500 italic",
          )}
        >
          {initialData.description && (
            <Preview value={initialData.description} />
          )}
        </div>
      )}

      {/* on editing mode show the form */}
      {isEditing && (
        <>
          <div className="flex items-center gap-2 my-2 ">
            <input
              type="text"
              placeholder="e.g 'Frontend developer'"
              value={rollName}
              onChange={(e) => setRollName(e.target.value)}
              className="w-full p-2 rounded-md bg-white"
            />
            <input
              type="text"
              placeholder="Required Skill sets"
              value={skills}
              onChange={(e) => setSkills(e.target.value)}
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
            Note*: Profession name and required skills delimitted by comma.
          </p>

          {aiValue && (
            <div className="w-full h-96 max-h-96 rounded-md bg-white overflow-y-scroll p-3 relative mt-4 text-muted-foreground">
              {aiValue}
              <Button
                className="absolute top-3 right-3 z-10"
                variant={"outline"}
                size={"icon"}
                onClick={onCopy}
              >
                <Copy className="w-4 h-4" />
              </Button>
            </div>
          )}
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4 mt-4"
            >
              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Editor {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className="flex items-center gap-x-2">
                <Button disabled={!isValid || isSubmitting} type="submit">
                  Save
                </Button>
              </div>
            </form>
          </Form>
        </>
      )}
    </div>
  );
};
