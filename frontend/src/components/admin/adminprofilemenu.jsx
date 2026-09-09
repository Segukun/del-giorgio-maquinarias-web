import { useState } from "react";
import { FiChevronDown, FiLogOut, FiUser } from "react-icons/fi";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase/config";
import { useNavigate } from "react-router-dom";

const AdminProfileMenu = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut(auth);

      // Redirigir al login después de cerrar sesión
      navigate("/admin/login");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  return (
    <div className="dg-admin-header__profile-wrapper">
      
      <button
        className="dg-admin-header__profile"
        type="button"
        onClick={() => setMenuAbierto(!menuAbierto)}
        aria-label="Menú de Segundo"
        aria-expanded={menuAbierto}
      >
        <span className="dg-admin-header__avatar" aria-hidden="true">
          <FiUser />
        </span>

        <span>Segundo</span>

        <FiChevronDown
          className={menuAbierto ? "rotate" : ""}
          aria-hidden="true"
        />
      </button>

      {menuAbierto && (
        <div className="dg-admin-header__profile-menu">
          <button
            type="button"
            className="dg-admin-header__logout"
            onClick={handleLogout}
          >
            <FiLogOut aria-hidden="true" />
            <span>Cerrar Sesión</span>
          </button>
        </div>
      )}

    </div>
  );
};

export default AdminProfileMenu;