import { Outlet } from "react-router-dom";
import AdminSessionProvider from "../../context/AdminSessionProvider.jsx";

export default function AdminArea() {
  return <AdminSessionProvider><Outlet /></AdminSessionProvider>;
}
