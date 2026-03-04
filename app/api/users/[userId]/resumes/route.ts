import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

import { Resumes } from "@prisma/client";

export const POST = async (
  req: Request,

  { params }: { params: Promise<{ userId: string }> },
) => {
  try {
    const { userId: authUserId } = await auth();
    const { userId } = await params;

    if (!authUserId) return new NextResponse("Unauthorized", { status: 401 });
    if (!userId) return new NextResponse("UserId missing", { status: 400 });

    const body = await req.json();
    const { resumes } = body;

    if (!resumes || !Array.isArray(resumes)) {
      return new NextResponse("Invalid Resume Format", {
        status: 400,
      });
    }

    // Create resumes in the database
    const createdResumes: Resumes[] = [];

    for (const resume of resumes) {
      const { url, name } = resume;

      if (!url || !name) {
        continue;
      }

      // Check if resume already exists
      const existingResume = await db.resumes.findFirst({
        where: {
          userProfileId: userId,
          url,
        },
      });

      if (existingResume) {
        // skip the insertion
        console.log(
          `Resume with URL ${url} already exists for userId ${userId}`,
        );
        continue;
      }

      // Extract publicId from Cloudinary URL
      const urlParts = url.split("/");
      const publicIdWithExt = urlParts
        .slice(urlParts.indexOf("upload") + 1)
        .join("/");
      const publicId = publicIdWithExt.split(".")[0];

      //creating new resume
      const newResume = await db.resumes.create({
        data: {
          url,
          publicId,
          name,
          userProfileId: userId,
        },
      });

      createdResumes.push(newResume);
    }

    return NextResponse.json(createdResumes);
  } catch (error) {
    console.log("[USER_RESUME_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
