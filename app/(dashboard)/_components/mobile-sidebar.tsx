import React from "react";

import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import Sidebar from "./sidebar";

export const MobileSidebar = () => {
  return (
    <div>
      <Sheet>
        <SheetTrigger className="md:hidden pr-4 hover:opacity-75 transition">
          <Menu />
        </SheetTrigger>
        <SheetContent className="bg-white p-0" side="left">
          <SheetTitle className="sr-only">Mobile Navigation</SheetTitle>
          <Sidebar />
        </SheetContent>
      </Sheet>
    </div>
  );
};
