import {
  getPieGraphCompanyCreatedByUser,
  getPieGraphJobCreatedByUser,
  getTotalCompaniesOnPortal,
  getTotalCompaniesOnPortalByUserId,
  getTotalJobsOnPortal,
  getTotalJobsOnPortalByUserId,
} from "@/actions/get-overview-analytics";
import Box from "@/components/box";
import { OverviewPieChart } from "@/components/overview-pie-chart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { auth } from "@clerk/nextjs/server";
import { BriefcaseBusiness } from "lucide-react";
import { redirect } from "next/navigation";

const DashboardAnalyticsPage = async () => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/");
  }

  const totalJobsOnPortal = await getTotalJobsOnPortal();
  const totalJobsOnPortalByUser = await getTotalJobsOnPortalByUserId(userId);
  const totalCompaniesOnPortal = await getTotalCompaniesOnPortal();
  const totalCompaniesOnPortalByUser =
    await getTotalCompaniesOnPortalByUserId(userId);

  const graphJobTotal = await getPieGraphJobCreatedByUser(userId);
  const graphCompanyTotal = await getPieGraphCompanyCreatedByUser(userId);

  return (
    <Box className="flex-col items-start p-4">
      <div className="flex flex-col items-start">
        <h2 className="font-sans tracking-wider font-bold text-2xl">
          Dashboard
        </h2>
        <p className="text-sm text-muted-foreground">
          Overview of your account
        </p>
      </div>

      <Separator className="my-4" />

      <div className="grid w-full gap-4 grid-cols-1 md:grid-cols-4">
        {/* total jobs on the portal */}
        <Card>
          <CardHeader className="items-center justify-between flex">
            <CardTitle className="text-sm font-medium">Total Jobs</CardTitle>
            <BriefcaseBusiness className="w-4 h-4" />
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {totalJobsOnPortal}
          </CardContent>
        </Card>

        {/* total jobs on the portal by the user */}
        <Card>
          <CardHeader className="items-center justify-between flex">
            <CardTitle className="text-sm font-medium">
              Total Jobs By User
            </CardTitle>
            <BriefcaseBusiness className="w-4 h-4" />
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {totalJobsOnPortalByUser}
          </CardContent>
        </Card>

        {/* total companies on the portal */}
        <Card>
          <CardHeader className="items-center justify-between flex">
            <CardTitle className="text-sm font-medium">
              Total Companies
            </CardTitle>
            <BriefcaseBusiness className="w-4 h-4" />
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {totalCompaniesOnPortal}
          </CardContent>
        </Card>

        {/* total companies on the portal by user */}
        <Card>
          <CardHeader className="items-center justify-between flex">
            <CardTitle className="text-sm font-medium">
              Total Companies By User
            </CardTitle>
            <BriefcaseBusiness className="w-4 h-4" />
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            {totalCompaniesOnPortalByUser}
          </CardContent>
        </Card>
        {/* month wise jobs count  */}
        <Card className="col-span-1 md:col-span-2">
          <CardHeader className="items-center justify-between flex">
            <CardTitle className="text-sm font-medium">
              Month Wise Jobs Count
            </CardTitle>
            <BriefcaseBusiness className="w-4 h-4" />
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            <OverviewPieChart data={graphJobTotal} />
          </CardContent>
        </Card>

        {/* month wise companies count  */}
        <Card className="col-span-1 md:col-span-2">
          <CardHeader className="items-center justify-between flex">
            <CardTitle className="text-sm font-medium">
              Month Wise Companies Count
            </CardTitle>
            <BriefcaseBusiness className="w-4 h-4" />
          </CardHeader>
          <CardContent className="text-2xl font-bold">
            <OverviewPieChart data={graphCompanyTotal} />
          </CardContent>
        </Card>
      </div>
    </Box>
  );
};

export default DashboardAnalyticsPage;
