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
import { zodResolver } from "@hookform/resolvers/zod";
import { Company } from "@prisma/client";
import axios from "axios";
import { Copy, Lightbulb, Loader2, Pencil } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface WhyJoinUsFormProps {
  initialData: Company;
  companyId: string;
}

const formSchema = z.object({
  whyJoinUs: z.string().min(1),
});

export const WhyJoinUsForm = ({
  initialData,
  companyId,
}: WhyJoinUsFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isPrompting, setIsPrompting] = useState(false);

  const [aiValue, setAiValue] = useState("");

  const [rollName, setRollName] = useState("");

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      whyJoinUs: initialData?.whyJoinUs || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/companies/${companyId}`, values);
      toast.success("Company Updated");
      // setLocalWhyJoinUsForm(values.whyJoinUs);
      toggleEditing();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
    console.log(values);
  };

  const toggleEditing = () => setIsEditing((current) => !current);

  const handlePromptGeneration = async () => {
    try {
      setIsPrompting(true);

      const customPrompt = `Create a compelling "Why join us" content piece for ${rollName}. Highlight the unique opportunities, benefits, and experiences that ${rollName} offers to its employees. Emphasize the  ${rollName}'s value proposition, work culture, work ethics and vision and career opportunities. Tailor the content to attract potential employees and illustrate why ${rollName} stands out among other competitors.
      Constraint Guidelines:
- DO NOT include introductory text like "Sure, here is..." or "Okay, I've drafted...".
- DO NOT use horizontal rules (---) or excessive symbols like ###.
- Return ONLY the plain text content of the company whyJoinUs.
- Use simple, clean headers without Markdown symbols.
      `;
      const response = await axios.post("/api/generate-ai-content", {
        prompt: customPrompt,
      });

      const data = response.data.data;

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
        Why Join Us
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
            !initialData.whyJoinUs && "text-neutral-500 italic",
          )}
        >
          {!initialData.whyJoinUs && "No Details"}
          {initialData.whyJoinUs && <Preview value={initialData.whyJoinUs} />}
        </div>
      )}

      {/* on editing mode show the form */}
      {isEditing && (
        <>
          <div className="flex items-center gap-2 my-2 ">
            <input
              type="text"
              placeholder="e.g 'Exquisite Studios'"
              value={rollName}
              onChange={(e) => setRollName(e.target.value)}
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
            Note*: Type the company name here to generate the whyJoinUs content
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
                name="whyJoinUs"
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
