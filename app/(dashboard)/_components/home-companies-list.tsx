"use client";

import Box from "@/components/box";
import { Card } from "@/components/ui/card";
import { Company } from "@prisma/client";
import { useRouter } from "next/navigation";

interface HomeCompaniesListProps {
  companies: Company[];
}

const CompanyListItemCard = ({ company }: { company: Company }) => {
  const router = useRouter();
  return (
    <Card
      className="p-3  flex items-center text-muted-foreground hover:text-purple-500 hover:border-purple-500 hover:shadow-md cursor-pointer"
      onClick={() => router.push(`/companies/${company.id}`)}
    >
      <h2 className="font-mono font-semibold tracking-wide whitespace-nowrap">
        {company.name}
      </h2>
    </Card>
  );
};

export const HomeCompaniesList = ({ companies }: HomeCompaniesListProps) => {
  return (
    <Box className="flex-col my-12">
      <h2 className="text-2xl tracking-wider font-bold font-sans">
        Featured companies actively hiring
      </h2>

      <div className="mt-12 w-full flex items-center justify-center flex-wrap gap-2">
        {companies.map((item) => (
          <CompanyListItemCard company={item} key={item.id} />
        ))}
      </div>
    </Box>
  );
};
