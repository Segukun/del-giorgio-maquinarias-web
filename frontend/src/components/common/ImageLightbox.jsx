import { useLayoutEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { FiChevronLeft, FiChevronRight, FiX } from "react-icons/fi";
import { swipeDirection } from "../../utils/galleryNavigation.js";

export default function ImageLightbox({ images, activeIndex, productName, onStep, onClose }) {
  const dialogRef = useRef(null);
  const touchStart = useRef(null);
  const swiped = useRef(false);
  const backdropStart = useRef(false);

  useLayoutEffect(() => {
    const dialog = dialogRef.current;
    const opener = document.activeElement;
    const { scrollX, scrollY } = window;
    const body = document.body;
    const properties = ["position", "top", "left", "width", "overflow", "paddingRight"];
    const original = Object.fromEntries(properties.map((name) => [name, body.style[name]]));
    const scrollbar = window.innerWidth - document.documentElement.clientWidth;
    const padding = Number.parseFloat(window.getComputedStyle(body).paddingRight) || 0;
    Object.assign(body.style, {
      position: "fixed", top: `-${scrollY}px`, left: `-${scrollX}px`,
      width: "100%", overflow: "hidden", paddingRight: `${padding + scrollbar}px`,
    });
    dialog.showModal();
    return () => {
      dialog.close();
      Object.assign(body.style, original);
      window.scrollTo({ left: scrollX, top: scrollY, behavior: "instant" });
      if (opener?.isConnected) opener.focus({ preventScroll: true });
    };
  }, []);

  return createPortal(
    <dialog
      ref={dialogRef}
      className="dg-lightbox"
      aria-label={`Vista ampliada de ${productName}`}
      onCancel={(event) => { event.preventDefault(); onClose(); }}
      onKeyDown={(event) => {
        if (event.key === "ArrowLeft" || event.key === "ArrowRight") {
          event.preventDefault();
          onStep(event.key === "ArrowLeft" ? -1 : 1);
        }
      }}
      onPointerDown={(event) => { backdropStart.current = event.target === event.currentTarget; }}
      onClick={(event) => {
        if (backdropStart.current && event.target === event.currentTarget && !swiped.current) onClose();
        swiped.current = false;
      }}
      onTouchStart={(event) => {
        swiped.current = false;
        const touch = event.touches.length === 1 ? event.touches[0] : null;
        touchStart.current = touch ? { clientX: touch.clientX, clientY: touch.clientY } : null;
      }}
      onTouchEnd={(event) => {
        const step = swipeDirection(touchStart.current, event.changedTouches[0]);
        touchStart.current = null;
        if (step) { swiped.current = true; onStep(step); }
      }}
      onTouchCancel={() => { touchStart.current = null; }}
    >
      <button className="dg-lightbox__close" type="button" aria-label="Cerrar vista ampliada" onClick={onClose} autoFocus>
        <FiX aria-hidden="true" />
      </button>
      <img className="dg-lightbox__image" src={images[activeIndex]} alt={`${productName}, imagen ${activeIndex + 1} de ${images.length}`} draggable="false" />
      {images.length > 1 && <>
        <button className="dg-lightbox__arrow is-previous" type="button" aria-label="Ver imagen anterior" onClick={() => onStep(-1)}><FiChevronLeft aria-hidden="true" /></button>
        <button className="dg-lightbox__arrow is-next" type="button" aria-label="Ver imagen siguiente" onClick={() => onStep(1)}><FiChevronRight aria-hidden="true" /></button>
      </>}
      <span className="dg-lightbox__count" role="status" aria-live="polite" aria-atomic="true">{activeIndex + 1} / {images.length}</span>
    </dialog>, document.body,
  );
}
