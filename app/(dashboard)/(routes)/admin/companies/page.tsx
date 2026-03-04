import { Button } from "@/components/ui/button";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { format } from "date-fns";

import { Plus } from "lucide-react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { columns, CompanyColumns } from "./_components/columns";
import { DataTable } from "@/components/ui/data-table";

const CompaniesOverviewPage = async () => {
  const { userId } = await auth();
  if (!userId) {
    redirect("/");
  }

  const companies = await db.company.findMany({
    where: {
      userId,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  const formattedCompanies: CompanyColumns[] = companies.map((company) => ({
    id: company.id,
    name: company.name ? company.name : "",
    logo: company.logo || "",
    createdAt: company?.createdAt
      ? format(new Date(company.createdAt), "MMMM do, yyyy")
      : "N/A",
  }));
  return (
    <div className="p-6">
      <div className="flex items-end justify-end">
        <Link href={"/admin/companies/create"}>
          <Button className="bg-gradient-to-tl from-indigo-500 via-purple-500 to-pink-500">
            <Plus className="w-5 h-5 mr-2" />
            New Company
          </Button>
        </Link>
      </div>

      {/* datatable - list of jobs */}
      <div className="mt-6">
        <DataTable
          columns={columns}
          data={formattedCompanies}
          searchKey="name"
        />
      </div>
    </div>
  );
};
export default CompaniesOverviewPage;
