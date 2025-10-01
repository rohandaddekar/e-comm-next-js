import AdminSidebar from "@/components/admin/Sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";

const AdminLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <main>{children}</main>
    </SidebarProvider>
  );
};

export default AdminLayout;
