import Logo from "./logo";
import { SidebarRoutes } from "./sidebar-routes";

const Sidebar = () => {
  return (
    <div className="h-full border-r flex flex-col overflow-y-auto bg-white">
      <div className="p-6 flex items-center">
        <Logo />
        <h2 className="text-xl font-semibold text-muted-foreground">
          Ikigai<span className="text-purple-700">Nest</span>
        </h2>
      </div>

      {/* sidebar routes */}
      <div className="flex flex-col w-full">
        <SidebarRoutes />
      </div>
    </div>
  );
};

export default Sidebar;
