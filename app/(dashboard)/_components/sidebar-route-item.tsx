import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";

interface SidebarRouteItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
}

export const SideBarRouteItem = ({
  icon: Icon,
  label,
  href,
}: SidebarRouteItemProps) => {
  const pathname = usePathname();
  const router = useRouter();

  const isActiveRoute =
    (pathname === "/" && href === "/") ||
    pathname === href ||
    pathname?.startsWith(`${href}/`);
  const onClick = () => {
    router.push(href);
  };
  return (
    //cn func provided by shadcn to create custom based certain conditons
    // cn(" common " , " condition ")
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-x-2 text-sm text-neutral-500 font-[500] pl-6 transition-all hover:bg-neutral-300/20",
        isActiveRoute &&
          "text-purple-700 bg-purple-200/20 hover:bg-purple-700/20 hover:text-purple-700"
      )}
    >
      <div className="flex items-center py-2 gap-x-2">
        <Icon
          className={cn("text-neutral-500", isActiveRoute && "text-purple-700")}
          size={22}
        />
        {label}
      </div>
      {/* highlighter color */}
      <div
        className={cn(
          "ml-auto opacity-0 border-2 border-purple-700 h-full transition-all",
          isActiveRoute && "opacity-100"
        )}
      ></div>
    </button>
  );
};
