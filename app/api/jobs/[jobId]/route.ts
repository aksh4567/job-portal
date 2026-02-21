import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { cloudinary } from "@/config/cloudinary";

export const PATCH = async (
  req: Request,

  { params }: { params: Promise<{ jobId: string }> },
) => {
  try {
    const { userId } = await auth();
    const { jobId } = await params;

    if (!userId) {
      return new NextResponse("Un-authorized", { status: 401 });
    }

    if (!jobId) {
      return new NextResponse("Id is missing", { status: 400 });
    }

    const updatedValues = await req.json();

    // 🔥 Get existing job first
    const existingJob = await db.job.findFirst({
      where: {
        id: jobId,
        userId,
      },
    });

    if (!existingJob) {
      return new NextResponse("Job not found", { status: 404 });
    }

    // IMAGE REPLACED
    if (
      existingJob?.imagePublicId &&
      updatedValues.imagePublicId &&
      existingJob.imagePublicId !== updatedValues.imagePublicId
    ) {
      await cloudinary.uploader.destroy(existingJob.imagePublicId);
    }

    // IMAGE REMOVED
    if (
      existingJob?.imagePublicId &&
      (!updatedValues.imagePublicId || updatedValues.imagePublicId === "")
    ) {
      await cloudinary.uploader.destroy(existingJob.imagePublicId);
    }

    const job = await db.job.update({
      where: {
        id: jobId,
      },
      data: {
        ...updatedValues,
      },
    });

    return NextResponse.json(job);
  } catch (error) {
    console.log(`[JOB_PATCH]: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: Promise<{ jobId: string }> },
) => {
  try {
    const { userId } = await auth();
    const { jobId } = await params;

    if (!userId) {
      return new NextResponse("Un-authorized", { status: 401 });
    }
    if (!jobId) {
      return new NextResponse("Id is missing", { status: 401 });
    }

    const job = await db.job.findUnique({
      where: {
        id: jobId,
        userId,
      },
      include: {
        attachments: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    if (!job) {
      return new NextResponse("Job not found", { status: 404 });
    }

    // delete job image
    if (job.imagePublicId) {
      try {
        // Explicitly set to "image" as this is for the cover image
        await cloudinary.uploader.destroy(job.imagePublicId);
      } catch (err) {
        console.error("Cover image deletion failed:", err);
      }
    }

    // delete attachments
    // if (job.attachments && job.attachments.length > 0) {
    //   await Promise.all(
    //     job.attachments.map(async (attachment) => {
    //       try {
    //         // Determine resource type: images are "image", others (pdf, docx) are "raw"
    //         const isImage = attachment.url.match(/\.(jpg|jpeg|png|gif|webp)$/i);
    //         const resourceType = isImage ? "image" : "raw";

    //         await cloudinary.uploader.destroy(attachment.publicId, {
    //           resource_type: resourceType,
    //         });
    //       } catch (err) {
    //         console.error(`Attachment ${attachment.publicId} failed:`, err);
    //       }
    //     }),
    //   );
    // }

    // delete attachments
    if (Array.isArray(job.attachments) && job.attachments.length > 0) {
      await Promise.all(
        job.attachments.map(async (attachment) => {
          try {
            // Determine if it's an image or raw
            const isImage = attachment.url.match(/\.(jpg|jpeg|png|gif|webp)$/i);
            const resourceType = isImage ? "image" : "raw";

            // LOG THE ATTEMPT
            console.log(
              `Attempting to delete ${attachment.publicId} as ${resourceType}`,
            );

            const result = await cloudinary.uploader.destroy(
              decodeURIComponent(attachment.publicId),
              {
                resource_type: "raw",
                invalidate: true, // Forces the CDN to clear the file
              },
            );

            // CHECK THE RESULT
            console.log("Cloudinary Result:", result);
          } catch (err) {
            console.error("Cloudinary Error:", err);
          }
        }),
      );
    }

    //     if (Array.isArray(job.attachments) && job.attachments.length > 0) {
    //   const publicIds = job.attachments
    //     .map((a: Attachment) => a.publicId)
    //     .filter(Boolean); // safety in case any publicId missing

    //   if (publicIds.length > 0) {
    //     await cloudinary.api.delete_resources(publicIds, {
    //       resource_type: "auto",
    //     });
    //   }
    // }

    const deleteJob = await db.job.delete({
      where: {
        id: jobId,
        userId,
      },
    });

    return NextResponse.json(deleteJob);
  } catch (error) {
    console.log(`[JOB_DELETE]: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
// import { db } from "@/lib/db";
// import { auth } from "@clerk/nextjs/server";
// import { NextResponse } from "next/server";
// import { string } from "zod";

// export const PATCH = async (
//   req: Request,
//   { params }: { params: Promise<{ jobId: string }> },
// ) => {
//   try {
//     const { userId } = await auth();
//     const { jobId } = await params;

//     const updatedValues = await req.json();

//     if (!userId) {
//       return new NextResponse("Un-authorized", { status: 401 });
//     }
//     if (!jobId) {
//       return new NextResponse("Id is missing", { status: 401 });
//     }

//     const job = await db.job.update({
//       where: {
//         id: jobId,
//         userId,
//       },
//       data: {
//         ...updatedValues,
//       },
//     });

//     return NextResponse.json(job);
//   } catch (error) {
//     console.log(`[JOB_PATCH]: ${error}`);
//     return new NextResponse("Internal server error", { status: 500 });
//   }
// };

// Delete the job id
