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
      // Example URL: https://res.cloudinary.com/cloud/raw/upload/v123/folder/file.pdf
      const urlParts = url.split("/");
      const uploadIndex = urlParts.indexOf("upload");

      // Extract publicId (everything after upload/)
      let publicIdWithExt = urlParts.slice(uploadIndex + 1).join("/");

      // Remove version parameter (e.g., v1234567890/)
      publicIdWithExt = publicIdWithExt.replace(/^v\d+\//, "");

      // Keep the full publicId WITH extension for all files
      // Cloudinary needs the extension for raw files (PDFs, docs, etc.)
      const publicId = publicIdWithExt;

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
