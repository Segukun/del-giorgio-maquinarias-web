import { useCallback, useState } from "react";
import AdminHeader from "./AdminHeader.jsx";
import AdminSidebar from "./AdminSidebar.jsx";

const AdminLayout = ({ children, onUnavailable }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  return (
    <div className="dg-admin-shell">
      <AdminHeader
        isMenuOpen={sidebarOpen}
        onMenuToggle={() => setSidebarOpen((open) => !open)}
      />
      <AdminSidebar
        isOpen={sidebarOpen}
        onClose={closeSidebar}
        onUnavailable={onUnavailable}
      />
      <main className="dg-admin-main">{children}</main>
    </div>
  );
};

export default AdminLayout;
