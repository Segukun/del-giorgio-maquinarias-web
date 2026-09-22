import { useEffect, useRef, useState } from "react";
import { FiChevronDown, FiLogOut, FiUser } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import { signOut } from "firebase/auth";
import useAdminSession from "../../../hooks/useAdminSession.js";
import { auth } from "../../../firebase/config.js";

const UserMenu = () => {
  const [open, setOpen] = useState(false);
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const { currentUser } = useAdminSession();

  useEffect(() => {
    if (!open) return undefined;

    const handlePointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) setOpen(false);
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const firstName = currentUser?.name?.split(" ")[0] ?? "Usuario";

  const openAccount = () => {
    setOpen(false);
    navigate("/admin/panel/cuenta");
  };

  const logout = async () => {
    setOpen(false);
    try {
      await signOut(auth);
    } catch (error) {
      console.error("No se pudo cerrar la sesión de Firebase:", error);
      return;
    }
    navigate("/admin/login");
  };

  return (
    <div className="dg-user-menu" ref={containerRef}>
      <button
        className="dg-admin-header__profile"
        type="button"
        aria-label={`Menú de ${firstName}`}
        aria-haspopup="menu"
        aria-expanded={open}
        onClick={() => setOpen((current) => !current)}
      >
        <span className="dg-admin-header__avatar" aria-hidden="true">
          <FiUser />
        </span>
        <span>{firstName}</span>
        <FiChevronDown className={open ? "is-open" : ""} aria-hidden="true" />
      </button>

      {open ? (
        <div className="dg-user-menu__dropdown" role="menu">
          <div className="dg-user-menu__identity">
            <strong>{currentUser?.name}</strong>
            <span>{currentUser?.email}</span>
          </div>
          <button type="button" role="menuitem" onClick={openAccount}>
            <FiUser aria-hidden="true" />
            Mi cuenta
          </button>
          <button className="is-logout" type="button" role="menuitem" onClick={logout}>
            <FiLogOut aria-hidden="true" />
            Cerrar sesión
          </button>
        </div>
      ) : null}
    </div>
  );
};

export default UserMenu;