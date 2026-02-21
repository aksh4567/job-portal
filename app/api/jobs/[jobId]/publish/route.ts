import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  // Change line 7 to:
  { params }: { params: Promise<{ jobId: string }> },
) => {
  try {
    const { userId } = await auth();
    const { jobId } = await params;

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    if (!jobId) {
      return new NextResponse("Id is Missing", { status: 404 });
    }
    const job = await db.job.findUnique({
      where: {
        id: jobId,
        userId,
      },
    });

    if (!job) {
      return new NextResponse("Job Not Found", { status: 404 });
    }

    const publishJob = await db.job.update({
      where: {
        id: jobId,
      },
      data: {
        isPublished: true,
      },
    });

    return NextResponse.json(publishJob);
  } catch (error) {
    console.log(`[JOB_PUBLISH_PATCH] : ${error}`);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
