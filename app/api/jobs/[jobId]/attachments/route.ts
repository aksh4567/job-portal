import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const POST = async (
  req: Request,

  { params }: { params: Promise<{ jobId: string }> },
) => {
  try {
    const { userId } = await auth();
    const { jobId } = await params;

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });
    if (!jobId) return new NextResponse("JobId missing", { status: 400 });

    const body = await req.json();
    const { attachments } = body;

    if (!attachments || !Array.isArray(attachments)) {
      return new NextResponse("Attachments missing or invalid", {
        status: 400,
      });
    }

    // Create attachments in the database
    const createdAttachments = [];

    for (const attachment of attachments) {
      const { url, name } = attachment;

      if (!url || !name) {
        continue;
      }

      // Check if attachment already exists
      const existingAttachment = await db.attachment.findFirst({
        where: {
          jobId,
          url,
        },
      });

      if (existingAttachment) {
        continue;
      }

      // Extract publicId from Cloudinary URL
      const urlParts = url.split("/");
      const publicIdWithExt = urlParts
        .slice(urlParts.indexOf("upload") + 1)
        .join("/");
      const publicId = publicIdWithExt.split(".")[0];

      const newAttachment = await db.attachment.create({
        data: {
          url,
          publicId,
          name,
          jobId,
        },
      });

      createdAttachments.push(newAttachment);
    }

    return NextResponse.json(createdAttachments);
  } catch (error) {
    console.log("[JOB_ATTACHMENT_POST]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
