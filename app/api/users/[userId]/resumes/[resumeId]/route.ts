import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { cloudinary } from "@/config/cloudinary";

export const DELETE = async (
  req: Request,
  // Change line 8 to:
  { params }: { params: Promise<{ resumeId: string }> },
) => {
  try {
    const { userId } = await auth();
    const { resumeId } = await params;

    if (!userId) return new NextResponse("Unauthorized", { status: 401 });

    const resume = await db.resumes.findUnique({
      where: { id: resumeId },
    });

    if (!resume || resume.id !== resumeId) {
      return new NextResponse("Attachment not found", { status: 404 });
    }

    // Extract resource type from URL
    // URL format: https://res.cloudinary.com/{cloud}/{resource_type}/upload/...
    const urlParts = resume.url.split("/");
    const uploadIndex = urlParts.indexOf("upload");
    let resourceType = "raw"; // default
    if (uploadIndex > 0) {
      const typeFromUrl = urlParts[uploadIndex - 1];
      if (["image", "video", "raw"].includes(typeFromUrl)) {
        resourceType = typeFromUrl;
      }
    }

    // For images, remove extension from publicId before deleting
    // For raw files, keep the extension
    let publicIdToDelete = resume.publicId;
    if (resourceType === "image") {
      publicIdToDelete = resume.publicId.split(".")[0];
    }

    // Delete from cloudinary with correct resource_type
    try {
      await cloudinary.uploader.destroy(publicIdToDelete, {
        resource_type: resourceType,
      });
    } catch (cloudinaryError) {
      console.error("[CLOUDINARY_DELETE_ERROR]", cloudinaryError);
      // Continue with DB deletion even if Cloudinary deletion fails
    }

    // delete from db
    await db.resumes.delete({
      where: { id: resumeId },
    });

    return NextResponse.json({ message: "Resume Deleted Successfully" });
  } catch (error) {
    console.log("[RESUME_DELETE]", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
};
