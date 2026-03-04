"use client";
import CustomBreadCrumb from "@/components/custom-bread-crumb";

import Box from "@/components/box";

import { Attachment, Company, Job, Resumes, UserProfile } from "@prisma/client";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FileIcon, Building2 } from "lucide-react";
import { Preview } from "@/components/preview";
import { ApplyModal } from "@/components/ui/apply-modal";
import { useState } from "react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import axios from "axios";
import { Banner } from "@/components/banner";

interface JobDetailsPageContentProps {
  job: Job & { company: Company | null; attachments: Attachment[] };
  jobId: string;
  userProfile: (UserProfile & { resumes: Resumes[] }) | null;
}

export const JobDetailsPageContent = ({
  job,
  jobId,
  userProfile,
}: JobDetailsPageContentProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [companyLogoError, setCompanyLogoError] = useState(false);
  const router = useRouter();

  const onApplied = async () => {
    setIsLoading(true);
    try {
      await axios.patch(`/api/users/${userProfile?.userId}/appliedJobs`, {
        jobId,
      });
      // send the mail to user
      await axios.post("/api/thankyou", {
        fullName: userProfile?.fullName,
        email: userProfile?.email,
      });
      toast.success("Application submitted successfully!");
    } catch (error) {
      console.log((error as Error)?.message);
      toast.error("Something went wrong");
    } finally {
      setOpen(false);
      setIsLoading(false);
      router.refresh();
    }
  };
  return (
    <>
      <ApplyModal
        isOpen={open}
        onClose={() => setOpen(false)}
        onConfirm={onApplied}
        loading={isLoading}
        userProfile={userProfile}
      />
      {userProfile &&
        userProfile?.appliedJobs.some(
          (appliedJob) => appliedJob.jobId === jobId,
        ) && (
          <Banner
            variant={"success"}
            label="Thank you for applying! Your application has been received, and we're reviewing it carefully. We'll be in touch soon with an update."
          />
        )}
      <Box className="mt-4">
        <CustomBreadCrumb
          breadCrumbItem={[{ label: "Search", link: "/search" }]}
          breadCrumbPage={job?.title !== undefined ? job.title : ""}
        />
      </Box>

      {/* job cover image */}
      <Box className="mt-4">
        <div className="w-full flex items-center h-72 relative rounded-md overflow-hidden">
          {job?.imageUrl ? (
            <Image
              alt={job.title}
              fill
              className="object-cover w-full h-full"
              src={job?.imageUrl}
            />
          ) : (
            <div className="h-full w-full bg-purple-100 flex items-center justify-center">
              <h2 className="text-3xl font-semibold tracking-wider">
                {job?.title}
              </h2>
            </div>
          )}
        </div>
      </Box>

      {/* title and actions buttons */}
      <Box className="mt-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-neutral-600">
            {job.title}
          </h2>

          <Link href={`/companies/${job.companyId}`}>
            <div className="flex items-center gap-2 mt-1">
              {job?.company?.logo && !companyLogoError ? (
                <Image
                  alt={job?.company?.name || "Company logo"}
                  width={25}
                  height={25}
                  src={job?.company?.logo}
                  onError={() => setCompanyLogoError(true)}
                />
              ) : (
                <Building2 className="w-5 h-5 text-neutral-400" />
              )}
              <p className="text-muted-foreground text-sm font-semibold">
                {job?.company?.name}
              </p>
            </div>
          </Link>
        </div>

        {/* action button */}
        <div>
          {userProfile ? (
            <>
              {!userProfile.appliedJobs.some(
                (appliedJob) => appliedJob.jobId === jobId,
              ) ? (
                <Button
                  className="text-sm bg-purple-700 hover:bg-purple-900 hover:shadow-sm"
                  onClick={() => setOpen(true)}
                >
                  Apply
                </Button>
              ) : (
                <Button
                  className="text-sm text-purple-700 border-purple-500 hover:bg-purple-900 hover:text-white hover:shadow-sm"
                  variant={"outline"}
                >
                  Already Applied
                </Button>
              )}
            </>
          ) : (
            <Link href={"/user"}>
              <Button className="text-sm px-8 bg-purple-700 hover:bg-purple-900 hover:shadow-sm">
                Update Profile
              </Button>
            </Link>
          )}
        </div>
      </Box>

      {/* Description */}
      <Box className="flex-col my-4 items-start justify-start px-4 gap-2">
        <h2 className="text-lg font-semibold">Description :</h2>
        <p className="font-sans">{job?.short_description}</p>
      </Box>

      {job?.description && (
        <Box>
          <Preview value={job?.description} />
        </Box>
      )}

      {job?.attachments && job?.attachments.length > 0 && (
        <Box className="flex-col my-4 items-start justify-start px-4 font-sans">
          <h2 className="text-lg font-semibold">Attachments :</h2>
          <p>Download the attachments to know more about the job</p>
          {job?.attachments.map((item) => (
            <div key={item.id} className="space-y-3">
              <Link
                href={item.url}
                target="_blank"
                download
                className="flex items-center gap-1 text-purple-500"
              >
                <FileIcon className="w-4 h-4 mr-2" />
                <p>{item.name}</p>
              </Link>
            </div>
          ))}
        </Box>
      )}
    </>
  );
};
