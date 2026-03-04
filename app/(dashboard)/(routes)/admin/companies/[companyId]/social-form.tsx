"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { zodResolver } from "@hookform/resolvers/zod";
import { Company } from "@prisma/client";
import axios from "axios";
import { Globe, Linkedin, Mail, MapPin, Pencil } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { z } from "zod";

interface CompanySocialContFormProps {
  initialData: Company;
  companyId: string;
}

const formSchema = z.object({
  mail: z.string().min(1, { message: "Email is required" }),
  website: z.string().min(1, { message: "Website is required" }),
  address_line_1: z.string().min(1, { message: "Address Line 1 is required" }),
  linkedIn: z.string().min(1, { message: "Linked In is required" }),
  address_line_2: z.string().min(1, { message: "Address Line 2 is required" }),
  city: z.string().min(1, { message: "City is required" }),
  state: z.string().min(1, { message: "State is required" }),
  zipcode: z.string().min(1, { message: "Zipcode is required" }),
});

export const CompanySocialContForm = ({
  initialData,
  companyId,
}: CompanySocialContFormProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      mail: initialData?.mail || "",
      website: initialData?.website || "",
      linkedIn: initialData?.linkedIn || "",
      address_line_1: initialData?.address_line_1 || "",
      address_line_2: initialData?.address_line_2 || "",
      city: initialData?.city || "",
      state: initialData?.state || "",
      zipcode: initialData?.zipcode || "",
    },
  });

  const { isSubmitting, isValid } = form.formState;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      await axios.patch(`/api/companies/${companyId}`, values);
      toast.success("Company Updated");
      toggleEditing();
      router.refresh();
    } catch {
      toast.error("Something went wrong");
    }
    console.log(values);
  };

  const toggleEditing = () => setIsEditing((current) => !current);

  return (
    <div className="mt-6 border bg-neutral-100 rounded-md p-4">
      <div className="font-medium flex items-center justify-between">
        Company Social Contacts
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
      {/* display the name if not edting */}
      {!isEditing && (
        <>
          <div className="grid grid-cols-3 gap-2 mt-2">
            <div className="col-span-3">
              {initialData.mail && (
                <div className="text-sm text-neutral-500 flex items-center w-full truncate">
                  <Mail className="w-3 h-3 mr-2" />
                  {initialData.mail}
                </div>
              )}

              {initialData.linkedIn && (
                <Link
                  href={initialData.linkedIn}
                  className="text-sm text-neutral-500 flex items-center w-full truncate"
                >
                  <Linkedin className="w-3 h-3 mr-2" />
                  {initialData.linkedIn}
                </Link>
              )}

              {initialData.website && (
                <Link
                  href={initialData.website}
                  className="text-sm text-neutral-500 flex items-center w-full truncate"
                >
                  <Globe className="w-3 h-3 mr-2" />
                  {initialData.website}
                </Link>
              )}
            </div>

            <div className="col-span-3 ">
              {initialData.address_line_1 && (
                <div className="flex items-start gap-2 justify-start">
                  <MapPin className="w-3 h-3 mt-1" />
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {initialData.address_line_1}, {initialData.address_line_2}
                      ,
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {initialData.city}, {initialData.state}, [
                      {initialData.zipcode}]
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      {/* on editing mode show the form */}
      {isEditing && (
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4 mt-4"
          >
            <FormField
              control={form.control}
              name="mail"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="bg-white"
                      disabled={isSubmitting}
                      placeholder="Email : 'sample@example.com'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="website"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="bg-white"
                      disabled={isSubmitting}
                      placeholder="Website Link : 'https://company.com'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />{" "}
            <FormField
              control={form.control}
              name="linkedIn"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="bg-white"
                      disabled={isSubmitting}
                      placeholder="LinkedIn Profile : 'https://linkedin.in/@yourname'"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address_line_1"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      className="bg-white"
                      disabled={isSubmitting}
                      placeholder="Address Line 1"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address_line_2"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      className="bg-white"
                      disabled={isSubmitting}
                      placeholder="Address Line 2"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-3 gap-2">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="bg-white"
                        disabled={isSubmitting}
                        placeholder="City"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="bg-white"
                        disabled={isSubmitting}
                        placeholder="State"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="zipcode"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="bg-white"
                        disabled={isSubmitting}
                        placeholder="Zipcode"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="flex items-center gap-x-2">
              <Button disabled={!isValid || isSubmitting} type="submit">
                Save
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
};
