"use client";

import { Company, Job } from "@prisma/client";
import { motion } from "framer-motion";
import { Card, CardDescription } from "@/components/ui/card";
import { formatDistanceToNow } from "date-fns";
import Box from "@/components/box";
import {
  BadgeDollarSign,
  BadgeIndianRupeeIcon,
  BookmarkCheck,
  BriefcaseBusiness,
  Coins,
  CoinsIcon,
  Currency,
  IndianRupee,
  Layers,
  Loader2,
  LucideCurrency,
  Network,
  ReceiptIndianRupeeIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, formattedString } from "@/lib/utils";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { truncate } from "lodash";

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
  const SavedUsersIcon = BookmarkCheck;

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
                <SavedUsersIcon className={cn("w-4 h-4")} />
              )}
            </Button>
          </Box>

          {/* company details */}
          <Box className="items-center justify-start gap-x-4">
            <div className="w-12 h-12 min-w-12 min-h-12 border p-2 rounded-md relative flex items-center justify-center overflow-hidden">
              {company?.logo && (
                <Image
                  alt={company?.name}
                  src={company?.logo}
                  width={40}
                  height={40}
                  className="object-contain"
                />
              )}
            </div>

            <div className="w-full">
              <p className="text-stone-700 font-semibold text-base w-full truncate">
                {job.title}
              </p>
              <Link
                href={`/company/${company?.id}`}
                className="text-xs text-purple-500 w-full truncate"
              >
                {company?.name}
              </Link>
            </div>
          </Box>

          {/* job details */}
          <Box className="flex-wrap justify-start gap-2">
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
                {job.yearsOfExperience}
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
              className="w-[50%] text-white hover:bg-purple-800 bg-purple-800/90"
              variant="outline"
            >
              Save
            </Button>
          </Box>
        </div>
      </Card>
    </motion.div>
  );
};

export default JobCardItem;
