"use client";

import { Category } from "@prisma/client";
import CategoryListItem from "./category-list-item";

interface CategoriesListProps {
  categories: Category[];
}

const CategoriesList = ({ categories }: CategoriesListProps) => {
  return (
    <div className="flex items-center gap-x-2 overflow-auto pb-2 scrollbar-none">
      {categories.map((category) => (
        <CategoryListItem
          key={category.id}
          label={category.name}
          value={category.id}
        />
      ))}
    </div>
  );
};

export default CategoriesList;
