import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const POST = async (req: Request) => {
  try {
    const { userId } = await auth();

    const { title } = await req.json();

    if (!userId) {
      return new NextResponse("Un-authorized", { status: 401 });
    }

    if (!title) {
      return new NextResponse("Title is missing", { status: 401 });
    }

    const job = await db.job.create({
      data: {
        userId,
        title,
      },
    });
    return NextResponse.json(job);
  } catch (error) {
    console.log(`[JOB_POST]: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
