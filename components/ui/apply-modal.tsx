"use client";

import { Resumes, UserProfile } from "@prisma/client";
import { useEffect, useState } from "react";
import { Modal } from "./modal";
import Link from "next/link";
import { Button } from "./button";
import Box from "../box";

interface ApplyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  userProfile: (UserProfile & { resumes: Resumes[] }) | null;
}

export const ApplyModal = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  userProfile,
}: ApplyModalProps) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title="Are you sure?"
      description="This action cannot be undone"
      isOpen={isOpen}
      onClose={onClose}
    >
      <Box>
        <div className="grid grid-cols-2 gap-2 w-full">
          <label className="p-3 border rounded-md">
            {userProfile?.fullName}
          </label>

          <label className="p-3 border rounded-md">
            {userProfile?.contact}
          </label>

          <label className="p-3 border rounded-md col-span-2">
            {userProfile?.email}
          </label>

          <label className="p-3 border rounded-md col-span-2 flex items-center gap-2 whitespace-nowrap">
            Your Active Resume :
            <span className=" text-purple-700 w-full truncate">
              {
                userProfile?.resumes.find(
                  (resume) => resume.id === userProfile?.activeResumeId,
                )?.name
              }
            </span>
          </label>

          <div className="col-span-2 flex items-center justify-end text-sm text-muted-foreground">
            Change your details{" "}
            <Link href={"/user"} className="text-purple-700 ml-2" prefetch={false}>
              over here
            </Link>
          </div>
        </div>
      </Box>

      <div className="pt-6 space-x-2 flex items-center justify-end w-full">
        <Button disabled={loading} variant={"outline"} onClick={onClose}>
          Cancel
        </Button>

        <Button
          disabled={loading}
          className="bg-purple-700 hover:bg-purple-800"
          onClick={onConfirm}
        >
          Continue
        </Button>
      </div>
    </Modal>
  );
};
