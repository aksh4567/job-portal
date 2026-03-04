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

    // delete from cloudinary
    await cloudinary.uploader.destroy(resume.publicId);

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
