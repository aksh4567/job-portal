import { getJobs } from "@/actions/get-jobs";
import Box from "@/components/box";
import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { HomesearchContainer } from "../_components/home-search-container";
import Image from "next/image";
import { HomescreenCategoriesContainer } from "../_components/home-screen-categories";
import { HomeCompaniesList } from "../_components/home-companies-list";
import { RecommendedJobsList } from "../_components/recommended-jobs";
import { Footer } from "@/components/footer";

const DashboardHomePage = async () => {
  const { userId } = await auth();
  const jobs = await getJobs({});

  const categories = await db.category.findMany({
    orderBy: { name: "asc" },
  });

  const companies = await db.company.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="flex-col py-6 px-4 space-y-24">
      <Box className="flex-col justify-center w-full space-y-4 mt-12 ">
        <h2 className="text-2xl md:text-4xl font-sans font-bold tracking-wide text-neutral-600">
          Find your dream job now
        </h2>

        <p className="text-2xl text-muted-foreground">
          {jobs.length} + jobs for you to explore{" "}
        </p>
      </Box>

      <HomesearchContainer />

      <Box className="relative overflow-hidden h-70 justify-center rounded-lg mt-12">
        <Image
          src="/home-cover.png"
          alt="Home Banner"
          fill
          className="object-cover w-full h-full"
        />
      </Box>
      <HomescreenCategoriesContainer categories={categories} />

      <HomeCompaniesList companies={companies} />

      <RecommendedJobsList jobs={jobs} userId={userId} />

      <Footer />
    </div>
  );
};

export default DashboardHomePage;
