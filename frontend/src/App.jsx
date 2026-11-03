import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import { lazy, Suspense } from "react";
import RuntimeErrorBoundary from "./components/RuntimeErrorBoundary.jsx";

const AdminArea = lazy(() => import("./components/admin/AdminArea.jsx"));
const ProductsAdmin = lazy(() => import("./pages/admin/ProductsAdmin.jsx"));
const AdminLoginPage = lazy(() => import("./pages/admin/adminloginpage.jsx"));
const AdminResetPasswordPage = lazy(() => import("./pages/admin/adminresetpassword.jsx"));
const RequireAdminAuth = lazy(() => import("./components/admin/requireadminauth.jsx"));
const DashboardAdmin = lazy(() => import("./pages/admin/DashboardAdmin.jsx"));
const StaffAdmin = lazy(() => import("./pages/admin/StaffAdmin.jsx"));
const AccountAdmin = lazy(() => import("./pages/admin/AccountAdmin.jsx"));
const CategoriesAdmin = lazy(() => import("./pages/admin/CategoriesAdmin.jsx"));
const BrandsAdmin = lazy(() => import("./pages/admin/BrandsAdmin.jsx"));

import Home from "./pages/home.jsx"
import Catalog from "./pages/catalog.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Contact from "./pages/Contact.jsx";
import Privacy from "./pages/Privacy.jsx";
import Terms from "./pages/Terms.jsx";
import Faq from "./pages/Faq.jsx";
import About from "./pages/About.jsx";
import Brands from "./pages/Brands.jsx";
import PublicLayout from "./components/layout/PublicLayout.jsx";
import RouteSEO from "./components/RouteSEO.jsx";
import NotFound from "./pages/NotFound.jsx";

import { useVisitorTracking } from "./hooks/useVisitorTracking.js";

export const AppRoutes = () => {

  useVisitorTracking();

  return (
    <>
      <RouteSEO />
      <Routes>

        <Route path="/" element={<PublicLayout><Home /></PublicLayout>} />
        <Route path="/contacto" element={<PublicLayout><Contact /></PublicLayout>} />
        <Route path="/privacidad" element={<PublicLayout><Privacy /></PublicLayout>} />
        <Route path="/terminos" element={<PublicLayout><Terms /></PublicLayout>} />
        <Route path="/preguntas-frecuentes" element={<PublicLayout><Faq /></PublicLayout>} />
        <Route path="/faq" element={<Navigate to="/preguntas-frecuentes" replace />} />
        <Route path="/nosotros" element={<PublicLayout><About /></PublicLayout>} />
        <Route path="/marcas" element={<PublicLayout><Brands /></PublicLayout>} />

        <Route path="/maquinaria/:id" element={<PublicLayout><ProductDetail /></PublicLayout>} />
        <Route path="/catalogo" element={<PublicLayout><Catalog/></PublicLayout>}/>


        <Route element={
          <RuntimeErrorBoundary stage="admin.load-or-render" title="No se pudo cargar la administración">
            <Suspense fallback={<p role="status">Cargando administración...</p>}>
              <AdminArea />
            </Suspense>
          </RuntimeErrorBoundary>
        }>
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
        </Route>
        <Route path="*" element={<PublicLayout><NotFound /></PublicLayout>} />
      </Routes>
    </>
  )
}

export default function App() {
  return <Router><AppRoutes /></Router>;
}
