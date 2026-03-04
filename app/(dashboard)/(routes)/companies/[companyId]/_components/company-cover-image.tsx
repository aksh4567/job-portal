"use client";

import Image from "next/image";
import { useState } from "react";

interface CompanyCoverImageProps {
  coverImage: string;
  companyName: string;
}

export const CompanyCoverImage = ({
  coverImage,
  companyName,
}: CompanyCoverImageProps) => {
  const [imageError, setImageError] = useState(false);

  if (!coverImage || imageError) {
    return null;
  }

  return (
    <div className="w-full flex items-center justify-center overflow-hidden relative h-80 -z-10">
      <Image
        alt={companyName}
        src={coverImage}
        fill
        className="w-full h-full object-cover"
        onError={() => setImageError(true)}
      />
    </div>
  );
};
