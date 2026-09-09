import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../../firebase/config";

const RequireAdminAuth = ({ children }) => {
  const [user, setUser] = useState(undefined); // undefined = cargando

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => setUser(u));
    return unsubscribe;
  }, []);

  if (user === undefined) {
    return (
      <main className="admin-login-page">
        <div className="admin-login-overlay"></div>
        <div className="admin-login-content">
          <div className="admin-card">
            <p>Cargando...</p>
          </div>
        </div>
      </main>
    );
  }

  if (!user) return <Navigate to="/admin/login" replace />;

  return children;
};

export default RequireAdminAuth;