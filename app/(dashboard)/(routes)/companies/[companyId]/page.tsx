import Box from "@/components/box";
import CustomBreadCrumb from "@/components/custom-bread-crumb";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";
import { CompanyDetailContentPage } from "./_components/company-detail-content";
import { CompanyCoverImage } from "./_components/company-cover-image";

const CompanyDetailsPage = async ({
  params,
}: {
  params: Promise<{ companyId: string }>;
}) => {
  const { companyId } = await params;
  const { userId } = await auth();
  const company = await db.company.findUnique({
    where: {
      id: companyId,
    },
  });

  if (!company || !userId) {
    redirect("/");
  }
  const jobs = await db.job.findMany({
    where: {
      companyId: companyId,
    },
    include: {
      company: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return (
    <div className="flex-col">
      <Box className="mt-4 items-center justify-start gap-2 mb-4 px-2">
        <CustomBreadCrumb
          breadCrumbItem={[{ label: "Search", link: "/search" }]}
          breadCrumbPage={company?.name !== undefined ? company.name : ""}
        />
      </Box>

      {/* company image */}
      {company?.coverImage && (
        <CompanyCoverImage
          coverImage={company.coverImage}
          companyName={company.name}
        />
      )}

      {/* company details */}
      <CompanyDetailContentPage jobs={jobs} company={company} userId={userId} />
    </div>
  );
};

export default CompanyDetailsPage;
