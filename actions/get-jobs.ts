import { db } from "@/lib/db";
import { auth } from "@clerk/nextjs/server";
import { Job } from "@prisma/client";
import { has } from "lodash";

type GetJobs = {
  title?: string;
  categoryId?: string;
  createdAtFilter?: string;
  shiftTiming?: string;
  workMode?: string;
  yearsOfExperience?: string;
  savedJobs?: boolean;
};

export const getJobs = async ({
  title,
  categoryId,
  createdAtFilter,
  shiftTiming,
  workMode,
  yearsOfExperience,
  savedJobs,
}: GetJobs): Promise<Job[]> => {
  const { userId } = await auth();

  try {
    // Initialize the query object with common options
    let query: any = {
      where: {
        isPublished: true,
      },
      include: {
        company: true,
        category: true,
        attachments: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    };

    if (typeof title !== "undefined" || typeof categoryId !== "undefined") {
      query.where = {
        AND: [
          typeof title !== "undefined" && {
            title: {
              contains: title,
              mode: "insensitive",
            },
          },
          typeof categoryId !== "undefined" && {
            categoryId: {
              equals: categoryId,
            },
          },
        ].filter(Boolean),
      };
    }

    // check whrther the createdAt filter is provieded or not
    if (createdAtFilter) {
      const currentDate = new Date();
      let startDate: Date;

      switch (createdAtFilter) {
        case "today":
          startDate = new Date(currentDate);
          break;

        case "yesterday":
          startDate = new Date(currentDate);
          startDate.setDate(startDate.getDate() - 1);
          break;

        case "thisWeek":
          startDate = new Date(currentDate);
          startDate.setDate(startDate.getDate() - currentDate.getDay());
          // set the start date to thge beginning of the current week
          break;

        case "lastWeek":
          startDate = new Date(currentDate);
          startDate.setDate(startDate.getDate() - currentDate.getDay() - 7);
          // set the start date to thge beginning of the previous week
          break;

        case "thisMonth":
          startDate = new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            1,
          );
          // set the start date to beginning of the current month
          break;

        default:
          startDate = new Date(0);
      }

      // add condition in query --include
      query.where.createdAt = {
        gte: startDate,
      };
    }
    // filter the data based on the shift timing
    let formattedShiftTiming = shiftTiming?.split(",");

    if (formattedShiftTiming && formattedShiftTiming.length > 0) {
      query.where.shiftTiming = {
        in: formattedShiftTiming,
      };
    }

    // filter the data based on the work mode
    let formattedWorkingMode = workMode?.split(",");

    if (formattedWorkingMode && formattedWorkingMode.length > 0) {
      query.where.workMode = {
        in: formattedWorkingMode,
      };
    }

    // filter the data based on the expeerience
    let formattedYearsOfExperience = yearsOfExperience?.split(",");

    if (formattedYearsOfExperience && formattedYearsOfExperience.length > 0) {
      query.where.yearsOfExperience = {
        in: formattedYearsOfExperience,
      };
    }

    if (savedJobs) {
      query.where.savedUsers = {
        has: userId,
      };
    }

    // execute the query to fetch the jobs based on the constructed parameters
    const jobs = await db.job.findMany(query);
    return jobs;
  } catch (error) {
    console.log("[GET_JOBS]:", error);
    return [];
  }
};
