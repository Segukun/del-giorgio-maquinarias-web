import { BrowserRouter as Router ,Route, Routes, Navigate } from "react-router-dom";
import ProductsAdmin from "./pages/admin/ProductsAdmin.jsx";
import AdminLoginPage from "./pages/admin/adminloginpage.jsx"
import AdminResetPasswordPage from "./pages/admin/adminresetpassword.jsx"
import RequireAdminAuth from "./components/admin/requireadminauth.jsx"
import DashboardAdmin from "./pages/admin/DashboardAdmin.jsx";

import { useVisitorTracking } from "./hooks/useVisitorTracking.js";

{/* <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
         */}

const App = () => {

  useVisitorTracking();

  return (
    <Router>
      <Routes>
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/reset-password" element={<AdminResetPasswordPage />} />
        
        <Route path="/admin/panel" element={<Navigate to="/admin/panel/inicio" replace />} />

        <Route 
          path="/admin/panel/inicio" 
          element={
          <RequireAdminAuth>
            <DashboardAdmin />
          </RequireAdminAuth>
        } />

        <Route 
          path="/admin/panel/productos" 
          element={
          <RequireAdminAuth>
            <ProductsAdmin />
          </RequireAdminAuth>
        } />
      </Routes>
    </Router>
  )
}

export default App;
