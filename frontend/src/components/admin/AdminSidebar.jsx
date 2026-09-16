import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { FiGrid, FiHome, FiPackage, FiTag, FiUsers, FiX } from "react-icons/fi";

const SIDEBAR_ITEMS = [
  { label: "Inicio", icon: FiHome, path: "/admin/panel/inicio" },
  { label: "Productos", icon: FiPackage, path: "/admin/panel/productos" },
  { label: "Personal", icon: FiUsers, path: "/admin/panel/personal" },
  { label: "Categorías", icon: FiTag, path: "/admin/panel/categorias" },
  { label: "Marcas", icon: FiGrid, path: "/admin/panel/marcas" },
];

const AdminSidebar = ({ isOpen, onClose, onUnavailable }) => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isOpen) return undefined;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  return (
    <>
      <aside className={`dg-admin-sidebar ${isOpen ? "is-open" : ""}`}>
        <div className="dg-admin-sidebar__mobile-heading">
          <span>Navegación</span>
          <button type="button" onClick={onClose} aria-label="Cerrar menú">
            <FiX />
          </button>
        </div>

        <nav aria-label="Navegación administrativa">
          {SIDEBAR_ITEMS.map(({ label, icon: Icon, path }) => {
            const isActive = path && location.pathname === path;
            return (
              <button
                key={label}
                className={`dg-admin-sidebar__item ${isActive ? "is-active" : ""}`}
                type="button"
                aria-current={isActive ? "page" : undefined}
                onClick={() => {
                  onClose();
                  if (path) navigate(path);
                  else onUnavailable?.(label);
                }}
              >
                <Icon aria-hidden="true" />
                <span>{label}</span>
              </button>
            );
          })}
        </nav>

        <div className="dg-admin-sidebar__footer">
          <span>Panel administrativo</span>
          <small>Del Giorgio Maquinarias</small>
        </div>
      </aside>

      {isOpen && (
        <button className="dg-admin-sidebar__backdrop" type="button" aria-label="Cerrar menú" onClick={onClose} />
      )}
    </>
  );
};

export default AdminSidebar;
