import { getJobs } from "@/actions/get-jobs";
import SearchContainer from "@/components/search-container";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Suspense } from "react";
import CategoriesList from "./_components/categories-list";
import { PageContent } from "./_components/page-content";
import { AppliedFilters } from "./_components/applied-filters";

export const dynamic = "force-dynamic";

interface SearchProps {
  searchParams: Promise<{
    title: string;
    categoryId: string;
    createdAtFilter: string;
    shiftTiming: string;
    workMode: string;
    yearsOfExperience: string;
  }>;
}

const SearchPage = async ({ searchParams }: SearchProps) => {
  const searchParamsData = await searchParams;

  const categories = await db.category.findMany({
    orderBy: {
      name: "asc",
    },
  });

  const { userId } = await auth();

  const jobs = await getJobs({ ...searchParamsData });
  // console.log(`JObs Count : ${jobs.length}`);

  return (
    <>
      <div className="px-6 pt-6 block md:hidden md:mb-0">
        <Suspense fallback={<div>Loading search...</div>}>
          <SearchContainer />
        </Suspense>
      </div>

      <div className="p-6">
        {/* cattegories */}
        <Suspense fallback={<div>Loading categories...</div>}>
          <CategoriesList categories={categories} />
        </Suspense>

        {/* applied filters */}
        <Suspense fallback={<div>Loading filters...</div>}>
          <AppliedFilters categories={categories} />
        </Suspense>

        {/* page content */}
        <PageContent jobs={jobs} userId={userId} />
      </div>
    </>
  );
};

export default SearchPage;
