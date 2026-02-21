import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { cloudinary } from "@/config/cloudinary";

export const DELETE = async (
  req: Request,
  // Change line 8 to:
  { params }: { params: Promise<{ jobId: string; attachmentId: string }> },
) => {
  try {
    const { userId } = await auth();
    const { jobId, attachmentId } = await params;

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const attachment = await db.attachment.findUnique({
      where: { id: attachmentId },
    });

    if (!attachment || attachment.jobId !== jobId) {
      return new NextResponse("Attachment not found", { status: 404 });
    }

    // delete from cloudinary
    await cloudinary.uploader.destroy(attachment.publicId);

    // delete from db
    await db.attachment.delete({
      where: { id: attachmentId },
    });

    return NextResponse.json({ message: "Deleted" });
  } catch (error) {
    console.log("[JOB_ATTACHMENT_DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
