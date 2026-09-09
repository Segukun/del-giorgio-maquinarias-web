import { useState } from "react";

import AdminLogin from "../../components/admin/adminlogin";
import AdminForgotPassword from "../../components/admin/adminforgotpassword";

import "../../styles/admin/adminlogin.css";

const AdminLoginPage = () => {
  const [view, setView] = useState("login");

  const renderView = () => {
    switch (view) {
      case "forgot":
        return <AdminForgotPassword onBack={() => setView("login")} />;

      case "login":
      default:
        return <AdminLogin onForgotPassword={() => setView("forgot")} />;
    }
  };

  return (
    <main className="admin-login-page">
      <div className="admin-login-overlay"></div>
      <div className="admin-login-content">{renderView()}</div>
    </main>
  );
};

export default AdminLoginPage;