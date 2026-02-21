import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { cloudinary } from "@/config/cloudinary";

export const PATCH = async (
  req: Request,
  { params }: { params: Promise<{ companyId: string }> },
) => {
  try {
    const { userId } = await auth();
    const { companyId } = await params;

    if (!userId) {
      return new NextResponse("Un-authorized", { status: 401 });
    }

    if (!companyId) {
      return new NextResponse("Id is missing", { status: 400 });
    }

    const updatedValues = await req.json();

    // 🔥 Get existing company first
    const existingCompany = await db.company.findFirst({
      where: {
        id: companyId,
        userId,
      },
    });

    if (!existingCompany) {
      return new NextResponse("Company not found", { status: 404 });
    }

    // IMAGE REPLACED
    if (
      existingCompany?.imagePublicId &&
      updatedValues.imagePublicId &&
      existingCompany.imagePublicId !== updatedValues.imagePublicId
    ) {
      await cloudinary.uploader.destroy(existingCompany.imagePublicId);
    }

    // IMAGE REMOVED
    if (
      existingCompany?.imagePublicId &&
      (!updatedValues.imagePublicId || updatedValues.imagePublicId === "")
    ) {
      await cloudinary.uploader.destroy(existingCompany.imagePublicId);
    }

    const company = await db.company.update({
      where: {
        id: companyId,
      },
      data: {
        ...updatedValues,
      },
    });

    return NextResponse.json(company);
  } catch (error) {
    console.log(`[COMPANY_PATCH]: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
