"use client";

import ThemeSwitch from "@/components/admin/ThemeSwitch";
import UserDropdown from "@/components/admin/UserDropdown";
import { Button } from "@/components/ui/button";
import { RiMenu4Fill } from "react-icons/ri";
import { useSidebar } from "@/components/ui/sidebar";

const Topbar = () => {
  const { toggleSidebar } = useSidebar();

  return (
    <div className="fixed border h-14 w-full top-0 left-0 ps-72 pe-8 px-5 z-30 flex justify-between items-center bg-white dark:bg-card">
      <div className="">search component</div>
      <div className="flex items-center gap-2">
        <ThemeSwitch />
        <UserDropdown />
        <Button
          onClick={toggleSidebar}
          type="button"
          size={"icon"}
          className="ms-2 md:hidden"
        >
          <RiMenu4Fill />
        </Button>
      </div>
    </div>
  );
};

export default Topbar;
