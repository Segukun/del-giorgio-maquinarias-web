import { FiMenu, FiX } from "react-icons/fi";
import UserMenu from "./profile/UserMenu.jsx";

const AdminHeader = ({ isMenuOpen, onMenuToggle }) => (
  <header className="dg-admin-header">
    <div className="dg-admin-header__brand">
      <button
        className="dg-admin-header__menu-button"
        type="button"
        aria-label={isMenuOpen ? "Cerrar menú" : "Abrir menú"}
        aria-expanded={isMenuOpen}
        onClick={onMenuToggle}
      >
        {isMenuOpen ? <FiX /> : <FiMenu />}
      </button>

      <img src="/brand/dg-logo.png" alt="DG" className="dg-admin-header__logo" />

      <div className="dg-admin-header__brand-copy">
        <strong>Del Giorgio Maquinarias</strong>
        <span>Panel de administrativo</span>
      </div>
    </div>

    <UserMenu />
  </header>
);

export default AdminHeader;
