import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export const PATCH = async (
  req: Request,
  { params }: { params: Promise<{ companyId: string }> },
) => {
  try {
    const { userId } = await auth();
    const { companyId } = await params;

    // const updatedValues = await req.json();

    if (!userId) {
      return new NextResponse("Un-authorized", { status: 401 });
    }

    if (!companyId) {
      return new NextResponse("Id is missing", { status: 401 });
    }

    const company = await db.company.findUnique({
      where: {
        id: companyId,
      },
    });

    if (!company) {
      return new NextResponse("Company Not Found", { status: 401 });
    }

    if (company.followers.includes(userId)) {
      return new NextResponse("Already following", { status: 400 });
    }

    // update the data
    const updatedData = {
      followers: company?.followers ? { push: userId } : [userId],
    };

    const updatedCompany = await db.company.update({
      where: {
        id: companyId,
      },
      data: updatedData,
    });

    return NextResponse.json(updatedCompany);
  } catch (error) {
    console.log(`[COMPANY_PATCH]: ${error}`);
    return new NextResponse("Internal server error", { status: 500 });
  }
};
