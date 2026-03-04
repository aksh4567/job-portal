import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { format } from "date-fns";
import { redirect } from "next/navigation";
import { ApplicantColumns, columns } from "./_components/columns";
import CustomBreadCrumb from "@/components/custom-bread-crumb";
import Box from "@/components/box";
import { DataTable } from "@/components/ui/data-table";

const JobApplicantsPage = async ({
  params,
}: {
  params: Promise<{ jobId: string }>;
}) => {
  const { userId } = await auth();
  const { jobId } = await params; // resolve once
  const job = await db.job.findUnique({
    where: {
      id: (await params).jobId,
      userId: userId as string,
    },
  });

  if (!job) {
    redirect("/admin/jobs");
  }

  const profiles = await db.userProfile.findMany({
    include: {
      resumes: {
        orderBy: {
          createdAt: "desc",
        },
      },
    },
  });

  const filteredProfiles =
    profiles &&
    profiles.filter((profile) =>
      profile.appliedJobs.some((appliedJob) => appliedJob.jobId === jobId),
    );

  const formattedProfiles: ApplicantColumns[] = filteredProfiles.map(
    (profile) => ({
      id: profile.userId,
      fullname: profile.fullName ? profile.fullName : "",
      email: profile.email ? profile.email : "",
      contact: profile.contact ? profile.contact : "",
      appliedAt: profile.appliedJobs.find((job) => job.jobId === jobId)
        ?.appliedAt
        ? format(
            new Date(
              profile.appliedJobs.find((job) => job.jobId === jobId)
                ?.appliedAt ?? "",
            ),
            "MMMM do, yyyy",
          )
        : "",
      resume:
        profile.resumes.find((res) => res.id === profile.activeResumeId)?.url ??
        "",
      resumeName:
        profile.resumes.find((res) => res.id === profile.activeResumeId)
          ?.name ?? "",
    }),
  );

  return (
    <div className="flex-col p-4 md:p-8 items-center justify-center flex">
      <Box>
        <CustomBreadCrumb
          breadCrumbPage="Applicants"
          breadCrumbItem={[
            { link: "/admin/jobs", label: "Jobs" },
            { link: "/admin/jobs", label: `${job ? job.title : ""}` },
          ]}
        />
      </Box>

      <div className="mt-6 w-full">
        <DataTable
          columns={columns}
          data={formattedProfiles}
          searchKey="fullname"
        />
      </div>
    </div>
  );
};

export default JobApplicantsPage;
