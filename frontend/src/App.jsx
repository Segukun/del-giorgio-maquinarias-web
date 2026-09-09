import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import ProductsAdmin from "./pages/admin/ProductsAdmin.jsx";

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

export default App;
