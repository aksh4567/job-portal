import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import {
  ArrowLeft,
  Building2,
  File,
  LayoutDashboard,
  ListCheck,
} from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { JobPublishAction } from "./_components/job-publish-actions";
import { Banner } from "@/components/banner";
import { IconBadge } from "@/components/icon-badge";
import { TitleForm } from "./_components/title-form";
import { CategoryForm } from "./_components/category-form";

import { ImageForm } from "./_components/image-form";
import { ShortDescription } from "./_components/short-description";
import { ShiftTime } from "./_components/shift-timing-mode";
import { HourlyRateForm } from "./_components/hourly-rate";
import { WorkModeForm } from "./_components/work-mode-form";
import { WorkExperienceForm } from "./_components/work-experience-form";
import { Description } from "./_components/job-description";
import { TagForm } from "./_components/tags-form";
import { CompanyForm } from "./_components/company-form";
import { AttachmentsForm } from "./_components/attachments-form";

const JobDetailsPage = async ({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) => {
  const { jobId } = await params;

  //verify the mongodb ID , by regex
  const validObjectIdRegex = /^[0-9a-fA-F]{24}$/;

  if (!validObjectIdRegex.test(jobId)) {
    return redirect("/admin/jobs");
  }

  const { userId } = await auth();

  if (!userId) {
    return redirect("/");
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

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const companies = await db.company.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  if (!job) {
    return redirect("/admin/jobs");
  }

  const requiredFields = [
    job.title,
    job.description,
    job.imageUrl,
    job.categoryId,
  ];

  const totalFields = requiredFields.length;
  const completedFields = requiredFields.filter(Boolean).length;
  const completionText = `(${completedFields}/${totalFields})`;

  const isComplete = requiredFields.every(Boolean);
  //if every field is complete only then this boolean will return true

  return (
    <div className="p-6">
      <Link href={"/admin/jobs"}>
        <div className="flex items-center gap-3 text-sm text-neutral-500">
          <ArrowLeft className="w-4 h-4" />
          Back
        </div>
      </Link>
      {/* title */}
      <div className="flex items-center justify-between my-4 ">
        <div className="flex flex-col gap-y-2">
          <h1 className="text-2xl font-medium"> Add Job Details</h1>
          <span className="text-sm text-neutral-500">
            Complete All Fields {completionText}
          </span>
        </div>
        {/* acton button */}
        <JobPublishAction
          jobId={jobId}
          disabled={!isComplete}
          isPublished={job.isPublished}
        />
      </div>
      {/* warning before publishing the course */}
      {!job.isPublished && (
        <Banner
          variant={"warning"}
          label="This job is unpublished. It will not be visible in the jobs list"
        />
      )}
      {/* container layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-16">
        {/* Left Container */}
        <div>
          {/* title */}
          <div className="flex items-center gap-x-2">
            <IconBadge icon={LayoutDashboard} />
            <h2 className="text-xl text-neutral-700">Customize your job</h2>
          </div>
          {/* title form */}
          <TitleForm initialData={job} jobId={job.id} />

          {/* categgory form */}
          <CategoryForm
            initialData={job}
            jobId={job.id}
            options={categories.map((category) => ({
              label: category.name,
              value: category.id,
            }))}
          />

          {/* cover image */}
          <ImageForm initialData={job} jobId={job.id} />

          {/* short description */}
          <ShortDescription initialData={job} jobId={job.id} />

          {/* Shift timing mode */}
          <ShiftTime initialData={job} jobId={job.id} />

          {/* Hourly Rate form */}
          <HourlyRateForm initialData={job} jobId={job.id} />

          {/* Work MOde Form */}
          <WorkModeForm initialData={job} jobId={job.id} />

          {/* Work Experience Form */}
          <WorkExperienceForm initialData={job} jobId={job.id} />
        </div>

        {/* Right Container */}
        <div className="space-y-6">
          {/* job tags / skills */}
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={ListCheck} />
              <h2 className="text-xl text-neutral-700 ">Job Requirements</h2>
            </div>
            <TagForm initialData={job} jobId={job.id} />
          </div>

          {/* company details */}
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={Building2} />
              <h2 className="text-xl text-neutral-700 ">Company Details</h2>
            </div>
            {/* company form */}
            <CompanyForm
              initialData={job}
              jobId={job.id}
              options={companies.map((company) => ({
                label: company.name,
                value: company.id,
              }))}
            />
          </div>

          {/* attachments */}
          <div>
            <div className="flex items-center gap-x-2">
              <IconBadge icon={File} />
              <h2 className="text-xl text-neutral-700 ">Job Attachments</h2>
            </div>
            {/* attachments form */}

            <AttachmentsForm initialData={job} jobId={job.id} />
          </div>
        </div>

        {/* description */}
        <div className="col-span-2">
          <Description initialData={job} jobId={job.id} />
        </div>
      </div>
    </div>
  );
};

export default JobDetailsPage;
