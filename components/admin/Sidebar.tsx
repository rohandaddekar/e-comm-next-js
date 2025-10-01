import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import Image from "next/image";
import LOGO_BLACK from "@/public/assets/images/logo-black.png";
import LOGO_WHITE from "@/public/assets/images/logo-white.png";
import { Button } from "@/components/ui/button";
import { LuChevronRight } from "react-icons/lu";
import { IoMdClose } from "react-icons/io";
import { adminSidebarMenu } from "@/lib/adminSidebarMenu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import Link from "next/link";

const AdminSidebar = () => {
  return (
    <Sidebar>
      <SidebarHeader className="border-b h-14 p-0">
        <div className="flex justify-between items-center px-4">
          <Image
            src={LOGO_BLACK.src}
            alt="Logo"
            height={50}
            width={LOGO_BLACK.width}
            className="block dark:hidden h-[50px] w-auto"
          />
          <Image
            src={LOGO_WHITE.src}
            alt="Logo"
            height={50}
            width={LOGO_WHITE.width}
            className="hidden dark:block h-[50px] w-auto"
          />

          <Button type="button" size={"icon"} className="md:hidden">
            <IoMdClose />
          </Button>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-3">
        <SidebarMenu>
          {adminSidebarMenu.map((menu, idx) => (
            <Collapsible key={idx} className="group/collapsible">
              <SidebarMenuItem>
                <CollapsibleTrigger asChild>
                  <SidebarMenuButton
                    asChild
                    className="font-semibold px-2 py-5"
                  >
                    <Link href={menu?.url}>
                      <menu.icon />
                      {menu.title}

                      {menu?.subMenu && menu?.subMenu?.length > 0 ? (
                        <LuChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                      ) : null}
                    </Link>
                  </SidebarMenuButton>
                </CollapsibleTrigger>

                {menu?.subMenu && menu?.subMenu?.length > 0 && (
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {menu?.subMenu?.map((subMenu, subIdx) => (
                        <SidebarMenuSubItem key={subIdx}>
                          <SidebarMenuSubButton asChild className="px-2 py-5">
                            <Link href={subMenu?.url}>{subMenu?.title}</Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                )}
              </SidebarMenuItem>
            </Collapsible>
          ))}
        </SidebarMenu>
      </SidebarContent>
    </Sidebar>
  );
};

export default AdminSidebar;
