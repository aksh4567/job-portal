import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { cloudinary } from "@/config/cloudinary";

export const POST = async (
  req: Request,

  { params }: { params: Promise<{ jobId: string }> },
) => {
  try {
    const { userId } = await auth();
    const { jobId } = await params;

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    if (!jobId) return new NextResponse("JobId missing", { status: 400 });

    const formData = await req.formData();
    const file = formData.get("file") as File;

    if (!file) return new NextResponse("File missing", { status: 400 });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const existingAttachment = await db.attachment.findFirst({
      where: {
        jobId,
        name: file.name,
      },
    });

    if (existingAttachment) {
      return new NextResponse("File with same name already exists", {
        status: 400,
      });
    }
    const uploadResult: any = await new Promise((resolve, reject) => {
      const stream = cloudinary.uploader.upload_stream(
        {
          folder: "job-attachments",
          public_id: `${Date.now()}-${file.name}`,
          resource_type: "auto",
        },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        },
      );
      stream.end(buffer);
    });

    const attachment = await db.attachment.create({
      data: {
        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        name: file.name,
        jobId,
      },
    });

    return NextResponse.json(attachment);
  } catch (error) {
    console.log("[JOB_ATTACHMENT_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
