"use client";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import axios from "axios";
import { BadgeCheck, BadgeX, Loader, MoreHorizontal } from "lucide-react";

import { useState } from "react";
import toast from "react-hot-toast";

interface CellActionProps {
  fullName: string;
  email: string;
}

const CellAction = ({ fullName, email }: CellActionProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isRejection, setIsRejection] = useState(false);

  const sendSelected = async () => {
    setIsLoading(true);
    try {
      await axios.post("/api/sendSelected", { email, fullName });
      toast.success("Selection Mail Sent");
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const sendRejected = async () => {
    setIsRejection(true);
    try {
      await axios.post("/api/sendRejected", { email, fullName });
      toast.success("Rejection Mail Sent");
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} size={"icon"}>
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {isLoading ? (
          <DropdownMenuItem className="flex items-center justify-center">
            <Loader className="w-4 h-4 animate-spin" />
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onClick={sendSelected}
            className="flex items-center justify-center"
          >
            <BadgeCheck className="w-4 h-4 animate-spin" />
            Selected
          </DropdownMenuItem>
        )}

        {isRejection ? (
          <DropdownMenuItem className="flex items-center justify-center">
            <Loader className="w-4 h-4 animate-pulse" />
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem
            onClick={sendRejected}
            className="flex items-center justify-center"
          >
            <BadgeX className="w-4 h-4 animate-pulse" />
            Rejected
          </DropdownMenuItem>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default CellAction;
