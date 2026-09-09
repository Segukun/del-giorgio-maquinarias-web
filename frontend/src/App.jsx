import { BrowserRouter as Router ,Route, Routes } from "react-router-dom";
import ProductsAdmin from "./pages/admin/ProductsAdmin.jsx";
import AdminLoginPage from "./pages/admin/adminloginpage.jsx"
import AdminResetPasswordPage from "./pages/admin/adminresetpassword.jsx"
import RequireAdminAuth from "./components/admin/requireadminauth.jsx"

{/* <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
         */}

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin/reset-password" element={<AdminResetPasswordPage />} />
        <Route 
          path="/admin/panel" 
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
