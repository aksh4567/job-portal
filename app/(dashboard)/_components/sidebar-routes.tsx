"use client";
import { BookMarked, Compass, Home, List, User } from "lucide-react";
import { usePathname } from "next/navigation";
import { useRouter } from "next/navigation";
import React from "react";
import { SideBarRouteItem } from "./sidebar-route-item";
import Box from "@/components/box";
import { Separator } from "@/components/ui/separator";
import DateFilter from "./date-filter";
import { CheckBoxContainer } from "./checkbox-container";
import qs from "query-string";

const adminRoutes = [
  {
    icon: List,
    label: "Jobs",
    href: "/admin/jobs",
  },
  {
    icon: List,
    label: "Companies",
    href: "/admin/companies",
  },
  {
    icon: Compass,
    label: "Analytics",
    href: "/admin/analytics",
  },
];

const guestRoutes = [
  {
    icon: Home,
    label: "Home",
    href: "/",
  },
  {
    icon: Compass,
    label: "Search",
    href: "/search",
  },
  {
    icon: User,
    label: "Profile",
    href: "/user",
  },
  {
    icon: BookMarked,
    label: "Saved Jobs",
    href: "/savedJobs",
  },
];

const shiftTimingsData = [
  {
    value: "full-time",
    label: "Full Time",
  },
  {
    value: "part-time",
    label: "Part Time",
  },
  {
    value: "contract",
    label: "Contract",
  },
];

const workingModesData = [
  {
    value: "remote",
    label: "Remote",
  },
  {
    value: "hybrid",
    label: "Hybrid",
  },
  {
    value: "office",
    label: "Office",
  },
];

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

// const experienceData = [
//   {
//     value: "0",
//     label: "Fresher",
//   },
//   {
//     value: "2",
//     label: "0-2 years",
//   },
//   {
//     value: "3",
//     label: "2-4 years",
//   },
//   {
//     value: "5",
//     label: "5+ years",
//   },
// ];

export const SidebarRoutes = () => {
  const pathname = usePathname();
  const router = useRouter();

  const isAdminPage = pathname?.startsWith("/admin");
  const isSearchPage = pathname?.startsWith("/search");

  const routes = isAdminPage ? adminRoutes : guestRoutes;

  const handleShiftTiming = (shiftTimings: string[]) => {
    const currentQueryParams = qs.parseUrl(window.location.href).query;
    const updatedQueryParams = {
      ...currentQueryParams,
      shiftTiming: shiftTimings,
    };

    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: updatedQueryParams,
      },
      {
        skipNull: true,
        skipEmptyString: true,
      },
    );
    router.push(url);
  };

  const handleWorkingMode = (workingMode: string[]) => {
    const currentQueryParams = qs.parseUrl(window.location.href).query;
    const updatedQueryParams = {
      ...currentQueryParams,
      workMode: workingMode,
    };

    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: updatedQueryParams,
      },
      {
        skipNull: true,
        skipEmptyString: true,
        arrayFormat: "comma",
      },
    );
    router.push(url);
  };

  const handleExperience = (experience: string[]) => {
    const currentQueryParams = qs.parseUrl(window.location.href).query;
    const updatedQueryParams = {
      ...currentQueryParams,
      yearsOfExperience: experience,
    };

    const url = qs.stringifyUrl(
      {
        url: pathname,
        query: updatedQueryParams,
      },
      {
        skipNull: true,
        skipEmptyString: true,
        arrayFormat: "comma",
      },
    );
    router.push(url);
  };

  return (
    <div className="flex flex-col w-full">
      {routes.map((route) => (
        <SideBarRouteItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}

      {isSearchPage && (
        <Box className="px-4 py-4 flex flex-col items-start justify-start space-y-4">
          <Separator />
          <h2 className="text-lg text-muted-foreground tracking-wide">
            Filters
          </h2>
          {/* Filter date by created at  */}
          <DateFilter />

          <Separator />
          <h2 className="text-lg text-muted-foreground tracking-wide">
            Working Schedule
          </h2>
          {/* Filter date by created at  */}
          <CheckBoxContainer
            data={shiftTimingsData}
            onChange={handleShiftTiming}
          />

          <Separator />
          <h2 className="text-lg text-muted-foreground tracking-wide">
            Working Mode
          </h2>
          {/* Filter date by created at  */}
          <CheckBoxContainer
            data={workingModesData}
            onChange={handleWorkingMode}
          />

          <Separator />
          <h2 className="text-lg text-muted-foreground tracking-wide">
            Experience
          </h2>
          {/* Filter date by created at  */}
          <CheckBoxContainer
            data={experienceData}
            onChange={handleExperience}
          />
        </Box>
      )}
    </div>
  );
};
