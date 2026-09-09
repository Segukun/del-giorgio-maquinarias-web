import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProductsAdmin from "./pages/admin/ProductsAdmin.jsx";

<<<<<<< Updated upstream
const App = () => (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to="/admin/productos" replace />} />
      <Route path="/admin" element={<Navigate to="/admin/productos" replace />} />
      <Route path="/admin/productos" element={<ProductsAdmin />} />
      <Route path="*" element={<Navigate to="/admin/productos" replace />} />
    </Routes>
  </BrowserRouter>
);
=======
import AdminLoginPage from "./pages/adminloginpage.jsx"
import AdminResetPasswordPage from "./pages/adminresetpassword.jsx"
import RequireAdminAuth from "./components/admin/requireadminauth.jsx"
import AdminPanel from "./pages/adminpanel.jsx"

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/reset-password" element={<AdminResetPasswordPage />} />
        <Route 
          path="/admin/panel" 
          element={
          <RequireAdminAuth>
            <AdminPanel />
          </RequireAdminAuth>
        } />
      </Routes>
    </Router>
  )
}
>>>>>>> Stashed changes

export default App;
