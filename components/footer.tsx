"use client";

import Logo from "@/app/(dashboard)/_components/logo";
import Box from "./box";
import { Facebook, Linkedin, Twitter, Youtube } from "lucide-react";
import Link from "next/link";
import { Card } from "./ui/card";
import Image from "next/image";
import { Separator } from "./ui/separator";

const menuOne = [
  { href: "#", label: "About Us" },
  { href: "#", label: "Careers" },
  { href: "#", label: "Employer home" },
  { href: "#", label: "Sitemap" },
  { href: "#", label: "Credits" },
];

export const Footer = () => {
  return (
    <Box className="h-auto p-4 sm:p-6 md:p-8 items-start flex-col bg-purple-50 rounded-xl shadow-lg">
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6 md:gap-8">
        {/* first */}
        <Box className="flex-col items-start gap-4 sm:gap-6 sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-1">
            <Logo />
            <h2 className="text-lg sm:text-xl font-semibold text-muted-foreground">
              Ikigai<span className="text-purple-700">Nest</span>
            </h2>
          </div>
          <p className="font-semibold text-sm sm:text-base">Connect with us</p>
          <div className="flex items-center gap-4 sm:gap-6 w-full">
            <Link href={"www.facebook.com"}>
              <Facebook className="w-5 h-5 text-muted-foreground hover:text-purple-500 hover:scale-125 transition-all" />
            </Link>

            <Link href={"www.facebook.com"}>
              <Twitter className="w-5 h-5 text-muted-foreground hover:text-purple-500 hover:scale-125 transition-all" />
            </Link>

            <Link href={"www.facebook.com"}>
              <Linkedin className="w-5 h-5 text-muted-foreground hover:text-purple-500 hover:scale-125 transition-all" />
            </Link>

            <Link href={"www.facebook.com"}>
              <Youtube className="w-5 h-5 text-muted-foreground hover:text-purple-500 hover:scale-125 transition-all" />
            </Link>
          </div>
        </Box>

        {/* second */}

        <Box className="flex-col items-start justify-start sm:justify-between gap-y-3 sm:gap-y-4">
          {menuOne.map((item) => (
            <Link key={item.label} href={item.href}>
              <p className="text-sm font-sans text-neutral-500 hover:text-purple-500 transition-colors">
                {item.label}
              </p>
            </Link>
          ))}
        </Box>

        {/* <Box className="flex-col items-start justify-start sm:justify-between gap-y-3 sm:gap-y-4">
          {menuOne.map((item) => (
            <Link key={item.label} href={item.href}>
              <p className="text-sm font-sans text-neutral-500 hover:text-purple-500 transition-colors">
                {item.label}
              </p>
            </Link>
          ))}
        </Box> */}
        <Card className="sm:col-span-2 lg:col-span-1 xl:col-span-2 relative min-h-[200px] sm:min-h-[220px] md:min-h-[240px] overflow-hidden">
          <Image
            src="/home-cover-img.png"
            fill
            className="object-cover"
            alt="footer-img"
          />
        </Card>

        {/* <Card className="col-span-2 bg-pink-50">
          <div className="w-full relative overflow-hidden h-full">
            <Image
              src={"/home-cover-img.png"}
              fill
              className="w-full h-full object-cover"
              alt="footer-img"
            />
          </div>
        </Card> */}
      </div>

      <Separator className="mt-4 md:mt-6" />
      <Box className="w-full justify-center p-3 sm:p-4 text-xs sm:text-sm text-muted-foreground">
        All rights reserved &copy; 2025
      </Box>
    </Box>
  );
};
