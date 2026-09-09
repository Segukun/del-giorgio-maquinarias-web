import { useEffect, useRef } from "react";
import { FiX } from "react-icons/fi";

const AdminModal = ({ title, eyebrow, children, onClose, size = "medium" }) => {
  const closeButtonRef = useRef(null);

  useEffect(() => {
    closeButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.body.classList.add("dg-modal-open");
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.classList.remove("dg-modal-open");
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose]);

  return (
    <div className="dg-modal" role="presentation" onMouseDown={onClose}>
      <section
        className={`dg-modal__dialog is-${size}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby="dg-modal-title"
        onMouseDown={(event) => event.stopPropagation()}
      >
        <header className="dg-modal__header">
          <div>
            {eyebrow ? <span>{eyebrow}</span> : null}
            <h2 id="dg-modal-title">{title}</h2>
          </div>
          <button ref={closeButtonRef} type="button" onClick={onClose} aria-label="Cerrar">
            <FiX aria-hidden="true" />
          </button>
        </header>
        <div className="dg-modal__body">{children}</div>
      </section>
    </div>
  );
};

export default AdminModal;
