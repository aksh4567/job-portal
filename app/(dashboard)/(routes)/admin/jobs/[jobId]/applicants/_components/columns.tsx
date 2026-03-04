"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Button } from "@/components/ui/button";

import { ArrowUpDown, File } from "lucide-react";

import Link from "next/link";
import CellAction from "./cell-action";

export type ApplicantColumns = {
  id: string;
  fullname: string;
  email: string;
  contact: string;
  appliedAt: string;
  resume: string;
  resumeName: string;
};

export const columns: ColumnDef<ApplicantColumns>[] = [
  {
    accessorKey: "fullname",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "email",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Email
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "contact",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Contact
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },

  {
    accessorKey: "resume",
    header: "Resume",
    cell: ({ row }) => {
      const { resume, resumeName } = row.original;
      return (
        <Link
          href={resume}
          target="_blank"
          className="flex items-center text-purple-500"
        >
          <File className="w-4 h-4 mr-2" />
          <p className="w-44 truncate">{resumeName}</p>
        </Link>
      );
    },
  },

  {
    accessorKey: "appliedAt",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const { fullname, email } = row.original;
      return <CellAction fullName={fullname} email={email} />;
    },
  },
];
