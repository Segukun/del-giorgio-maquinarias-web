import { useContext } from "react";
import AdminSessionContext from "../context/AdminSessionContext.js";

const useAdminSession = () => {
  const context = useContext(AdminSessionContext);

  if (!context) {
    throw new Error("useAdminSession debe utilizarse dentro de AdminSessionProvider");
  }

  return context;
};

export default useAdminSession;
