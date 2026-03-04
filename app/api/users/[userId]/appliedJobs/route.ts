import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PATCH = async (req: Request) => {
  try {
    const { userId } = await auth();

    const { jobId } = await req.json();

    if (!userId) {
      return new NextResponse("Un-Authorized", { status: 401 });
    }
    if (!jobId) {
      return new NextResponse("jobId is missing", { status: 401 });
    }

    const profile = await db.userProfile.findUnique({
      where: {
        userId: userId as string,
      },
    });
    if (!profile) {
      return new NextResponse("User Profile Not Found", { status: 401 });
    }

    const updatedProfile = await db.userProfile.update({
      where: {
        userId,
      },
      data: {
        appliedJobs: {
          push: { jobId },
        },
      },
    });

    return NextResponse.json(updatedProfile);
  } catch (error) {
    console.log(`[JOB_APPLIED_PATCH] : ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
