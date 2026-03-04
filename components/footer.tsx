"use client";

import Logo from "@/app/(dashboard)/_components/logo";
import Box from "./box";
import { Facebook, Linkedin, Twitter, Youtube } from "lucide-react";
import Link from "next/link";
import { Card, CardDescription, CardTitle } from "./ui/card";
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
    <Box className="h-73 p-4 items-start flex-col bg-purple-50 rounded-xl">
      <div className="w-full grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
        {/* first section */}
        <Box className="flex-col items-start gap-6">
          <div className="flex items-center gap-1">
            <Logo />
            <h2 className="text-xl font-semibold text-muted-foreground">
              WorkNow
            </h2>
          </div>
          <p className="font-semibold text-base">Connect with us</p>
          <div className="flex items-center gap-6 w-full">
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

        <Box className="flex-col items-start justify-between gap-y-4 ml-4">
          {menuOne.map((item) => (
            <Link key={item.label} href={item.href}>
              <p className="text-sm font-sans text-neutral-500 hover:text-purple-500">
                {item.label}
              </p>
            </Link>
          ))}
        </Box>

        <Box className="flex-col items-start justify-between gap-y-4 ml-4">
          {menuOne.map((item) => (
            <Link key={item.label} href={item.href}>
              <p className="text-sm font-sans text-neutral-500 hover:text-purple-500">
                {item.label}
              </p>
            </Link>
          ))}
        </Box>

        <Card className="p-6 col-span-2 bg-pink-50">
          <CardTitle className="text-base">Apply on the go</CardTitle>
          <CardDescription>
            Get real-time job updates on our App
          </CardDescription>
          <Link href={"#"}>
            <div className="w-full relative overflow-hidden h-16">
              <Image
                src={"/img/play-apple-store.png"}
                fill
                className="w-full h-full object-contain"
                alt="Play Store & Apple Store"
              />
            </div>
          </Link>
        </Card>
      </div>

      <Separator className="mt-3" />
      <Box className="w-full justify-center p-4 text-sm text-muted-foreground">
        All rights reserved &copy; 2024
      </Box>
    </Box>
  );
};
