"use client";

import SearchContainer from "@/components/search-container";
import { Button } from "@/components/ui/button";
import { UserButton } from "@clerk/nextjs";
import { LogOut } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavbarRoutes() {
  const pathname = usePathname();

  const isAdminPage = pathname?.startsWith("/admin");
  const isPlayerPage = pathname?.startsWith("/jobs");
  const isSearchPage = pathname?.startsWith("/search");
  return (
    <>
      {isSearchPage && (
        <div className="hidden md:flex w-full px-2 pr-8 items-center gap-x-6">
          <SearchContainer />
        </div>
      )}

      <div className="flex ml-auto gap-x-2">
        {isAdminPage || isPlayerPage ? (
          <Link href={"/"}>
            <Button
              variant={"outline"}
              size={"sm"}
              className="border-purple-700/20"
            >
              <LogOut />
              Exit
            </Button>
          </Link>
        ) : (
          <Link href={"/admin/jobs"}>
            <Button
              variant={"outline"}
              size={"sm"}
              className="border-purple-700/20"
            >
              Admin Mode
            </Button>
          </Link>
        )}
        <UserButton afterSignOutUrl="/" />
      </div>
    </>
  );
}
