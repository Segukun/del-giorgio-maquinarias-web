import { useEffect } from "react";
import { FiGrid, FiHome, FiPackage, FiTag, FiX } from "react-icons/fi";

const SIDEBAR_ITEMS = [
  { label: "Inicio", icon: FiHome },
  { label: "Productos", icon: FiPackage, active: true },
  { label: "Categorías", icon: FiTag },
  { label: "Marcas", icon: FiGrid },
];

const AdminSidebar = ({ isOpen, onClose, onUnavailable }) => {
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
          {SIDEBAR_ITEMS.map(({ label, icon: Icon, active }) => (
            <button
              key={label}
              className={`dg-admin-sidebar__item ${active ? "is-active" : ""}`}
              type="button"
              aria-current={active ? "page" : undefined}
              onClick={() => {
                onClose();
                if (!active) onUnavailable(label);
              }}
            >
              <Icon aria-hidden="true" />
              <span>{label}</span>
            </button>
          ))}
        </nav>

        <div className="dg-admin-sidebar__footer">
          <span>Panel administrativo</span>
          <small>Del Giorgio Maquinarias</small>
        </div>
      </aside>

      {isOpen && (
        <button
          className="dg-admin-sidebar__backdrop"
          type="button"
          aria-label="Cerrar menú"
          onClick={onClose}
        />
      )}
    </>
  );
};

export default AdminSidebar;
