import React from "react";
import NavbarRoutes from "./NavbarRoutes";
import { MobileSidebar } from "./mobile-sidebar";

const Navbar = () => {
  return (
    <div className="h-full p-4 border-b flex items-center bg-white shadow-md">
      {/* mobile routes */}
      <MobileSidebar />

      {/* sidebar routes */}
      <NavbarRoutes />
    </div>
  );
};

export default Navbar;
