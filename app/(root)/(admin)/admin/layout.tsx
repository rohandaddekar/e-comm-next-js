import AdminSidebar from "@/components/admin/Sidebar";
import ThemeProvider from "@/components/admin/ThemeProvider";
import Topbar from "@/components/admin/Topbar";
import { SidebarProvider } from "@/components/ui/sidebar";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      <SidebarProvider>
        <AdminSidebar />

        <main className="md:w-[calc(100vw-16rem)]">
          <div className="pt-[70px] px-8 min-h-[calc(100vh-40px)] pb-10">
            <Topbar />
            {children}
          </div>

          <div className="border-t h-[40px] flex items-center justify-center bg-gray-50 dark:bg-background text-sm">
            &copy; {new Date().getFullYear()} E-comm. All rights reserved.
          </div>
        </main>
      </SidebarProvider>
    </ThemeProvider>
  );
};

export default AdminLayout;
