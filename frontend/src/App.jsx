import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import ProductsAdmin from "./pages/admin/ProductsAdmin.jsx";
import AdminLoginPage from "./pages/admin/adminloginpage.jsx"
import AdminResetPasswordPage from "./pages/admin/adminresetpassword.jsx"
import RequireAdminAuth from "./components/admin/requireadminauth.jsx"
import DashboardAdmin from "./pages/admin/DashboardAdmin.jsx";
import StaffAdmin from "./pages/admin/StaffAdmin.jsx";
import AccountAdmin from "./pages/admin/AccountAdmin.jsx";
import CategoriesAdmin from "./pages/admin/CategoriesAdmin.jsx";
import BrandsAdmin from "./pages/admin/BrandsAdmin.jsx";
import Home from "./pages/home.jsx"

import { useVisitorTracking } from "./hooks/useVisitorTracking.js";

import { AdminSessionProvider } from "./context/AdminSessionProvider.jsx"

{/* <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
         */}

const App = () => {

  useVisitorTracking();

  return (
    <Router>
      <AdminSessionProvider>
      <Routes>

        <Route path="/" element={ <Home />} />
        

        <Route path="/admin" element={<Navigate to="/admin/login" replace />} />
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

        <Route
          path="/admin/panel/personal"
          element={
            <RequireAdminAuth>
              <StaffAdmin />
            </RequireAdminAuth>
          }
        />

        <Route
          path="/admin/panel/categorias"
          element={
            <RequireAdminAuth>
              <CategoriesAdmin />
            </RequireAdminAuth>
          }
        />

        <Route
          path="/admin/panel/marcas"
          element={
            <RequireAdminAuth>
              <BrandsAdmin />
            </RequireAdminAuth>
          }
        />

        <Route
          path="/admin/panel/cuenta"
          element={
            <RequireAdminAuth>
              <AccountAdmin />
            </RequireAdminAuth>
          }
        />

        <Route path="/admin/personal" element={<Navigate to="/admin/panel/personal" replace />} />
        <Route path="/admin/categorias" element={<Navigate to="/admin/panel/categorias" replace />} />
        <Route path="/admin/marcas" element={<Navigate to="/admin/panel/marcas" replace />} />
      </Routes>
      </AdminSessionProvider>
    </Router>
  )
}

export default App;
