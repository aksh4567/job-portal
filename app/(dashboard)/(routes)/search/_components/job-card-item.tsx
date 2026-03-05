"use client";

import { Company, Job } from "@prisma/client";
import { motion } from "framer-motion";
import { Card, CardDescription } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import Box from "@/components/box";
import {
  Bookmark,
  BookmarkCheck,
  BriefcaseBusiness,
  Layers,
  Loader2,
  Network,
  ReceiptIndianRupeeIcon,
  Building2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, formattedString } from "@/lib/utils";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { truncate } from "lodash";

import toast from "react-hot-toast";
import axios from "axios";
import { useRouter } from "next/navigation";

interface JobCardItemProps {
  job: Job;
  userId: string | null;
}

const JobCardItem = ({ job, userId }: JobCardItemProps) => {
  const typeJob = job as Job & {
    company: Company | null;
  };

  const company = typeJob.company;
  const [isBookmarkLoading, setIsBookmarkLoading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const isSavedByUser = userId && job.savedUsers?.includes(userId);
  const SavedUsersIcon = isSavedByUser ? BookmarkCheck : Bookmark;

  const router = useRouter();

  const experienceData = [
    {
      value: "fresher",
      label: "Fresher",
    },
    {
      value: "0-1",
      label: "0-1 years",
    },
    {
      value: "1-3",
      label: "1-3 years",
    },
    {
      value: "3-5",
      label: "3-5 years",
    },
    {
      value: "5+",
      label: "5+ years",
    },
  ];

  const onClickSaveJob = async () => {
    try {
      setIsBookmarkLoading(true);
      if (isSavedByUser) {
        await axios.patch(`/api/jobs/${job.id}/removeJobFromCollection`);
        toast.success("Job Removed");
      } else {
        await axios.patch(`/api/jobs/${job.id}/saveJobToCollection`);
        toast.success("Job Saved");
      }
      router.refresh();
    } catch (error) {
      toast.error("Something Went Wrong");
      console.log(`Error : ${(error as Error)?.message}`);
    } finally {
      setIsBookmarkLoading(false);
    }
  };

  const getExperienceLabel = (value: string) => {
    const experience = experienceData.find((exp) => exp.value === value);

    return experience ? experience.label : "";
  };

  return (
    <motion.div layout>
      <Card>
        <div className="w-full h-full p-4 flex flex-col items-start justify-start gap-y-4">
          {/* Saved User */}
          <Box>
            <p className="text-sm text-muted-foreground">
              {formatDistanceToNow(new Date(job.createdAt), {
                addSuffix: true,
              })}
            </p>

            <Button variant="ghost" size="icon">
              {isBookmarkLoading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <div onClick={onClickSaveJob}>
                  <SavedUsersIcon
                    className={cn(
                      "w-4 h-4",
                      isSavedByUser
                        ? "text-emerald-500"
                        : "text-muted-foreground",
                    )}
                  />
                </div>
              )}
            </Button>
          </Box>

          {/* company details */}
          <Box className="items-center justify-start gap-x-4">
            <div className="w-12 h-12 min-w-12 min-h-12 border p-2 rounded-md relative flex items-center justify-center overflow-hidden bg-neutral-100">
              {company?.logo && !imageError ? (
                <Image
                  alt={company?.name || "Company logo"}
                  src={company.logo}
                  width={40}
                  height={40}
                  className="object-contain"
                  onError={() => setImageError(true)}
                />
              ) : (
                <Building2 className="w-6 h-6 text-neutral-400" />
              )}
            </div>

            <div className="w-full">
              <p className="text-stone-700 font-semibold text-base w-full truncate">
                {job.title}
              </p>
              <Link
                href={`/companies/${company?.id}`}
                className="text-xs text-purple-500 w-full truncate"
              >
                {company?.name}
              </Link>
            </div>
          </Box>

          {/* job details */}
          <Box>
            {job.shiftTiming && (
              <div className="text-xs text-muted-foreground flex items-center">
                <BriefcaseBusiness className="w-3 h-3 mr-1" />
                {formattedString(job.shiftTiming)}
              </div>
            )}

            {job.workMode && (
              <div className="text-xs text-muted-foreground flex items-center">
                <Layers className="w-3 h-3 mr-1" />
                {formattedString(job.workMode)}
              </div>
            )}

            {job.hourlyRate && (
              <div className="text-xs text-muted-foreground flex items-center">
                <ReceiptIndianRupeeIcon className="w-3 h-3 mr-1" />
                {formattedString(job.hourlyRate)}
              </div>
            )}

            {job.yearsOfExperience && (
              <div className="text-xs text-muted-foreground flex items-center">
                <Network className="w-3 h-3 mr-1" />
                {getExperienceLabel(job.yearsOfExperience)}
              </div>
            )}
          </Box>

          {job.short_description && (
            <CardDescription className="text-xs">
              {truncate(job.short_description, {
                length: 180,
                omission: "...",
              })}
            </CardDescription>
          )}

          {job.tags.length > 0 && (
            <Box className="flex-wrap justify-start gap-1">
              {job.tags.slice(0, 6).map((tag, i) => (
                <p
                  key={i}
                  className="bg-gray-100 text-xs rounded-md px-2 py-[2px] font-semibold text-neutral-500"
                >
                  {tag}
                </p>
              ))}
            </Box>
          )}

          <Box className="gap-2 mt-auto">
            <Link href={`/search/${job.id}`} className="w-full">
              <Button
                className="w-full border-purple-500 text-purple-500 hover:bg-transparent hover:text-purple-600"
                variant="outline"
              >
                Details
              </Button>
            </Link>

            <Button
              className="w-[50%] text-white hover:bg-purple-800 bg-purple-800/90 hover:text-white"
              variant="outline"
              onClick={onClickSaveJob}
            >
              {isSavedByUser ? "Saved" : "Save For Later"}
            </Button>
          </Box>
        </div>
      </Card>
    </motion.div>
  );
};

export default JobCardItem;
