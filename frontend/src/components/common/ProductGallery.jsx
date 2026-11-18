import { useEffect, useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight, FiMaximize } from "react-icons/fi";
import ImageLightbox from "./ImageLightbox.jsx";
import { nextImageIndex, swipeDirection } from "../../utils/galleryNavigation.js";

const ProductGallery = ({ productName, images, variant = "admin", badge }) => {
  const availableImages = images?.length ? images : [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const touchStart = useRef(null);
  const thumbnails = useRef(null);
  const hasMultipleImages = availableImages.length > 1;
  const isPublic = variant === "public";
  const prefix = isPublic ? "dg-pd" : "dg-product-gallery";
  const selectedIndex = Math.min(activeIndex, Math.max(0, availableImages.length - 1));

  useEffect(() => {
    if (!isPublic) return;
    const strip = thumbnails.current;
    const thumbnail = strip?.children[selectedIndex];
    if (!thumbnail) return;
    // Scroll only the strip: scrollIntoView would also move the whole page.
    const left = thumbnail.offsetLeft;
    if (left < strip.scrollLeft) strip.scrollLeft = left;
    else if (left + thumbnail.offsetWidth > strip.scrollLeft + strip.clientWidth) {
      strip.scrollLeft = left + thumbnail.offsetWidth - strip.clientWidth;
    }
  }, [selectedIndex, isPublic]);

  const stepImage = (step) => {
    setActiveIndex((index) => nextImageIndex(Math.min(index, availableImages.length - 1), step, availableImages.length));
  };

  const showPrevious = () => {
    stepImage(-1);
  };

  const showNext = () => {
    stepImage(1);
  };

  const handleGalleryKeyDown = (event) => {
    if (event.key === "ArrowLeft") {
      event.preventDefault();
      showPrevious();
    }
    if (event.key === "ArrowRight") {
      event.preventDefault();
      showNext();
    }
  };

  const handleTouchStart = (event) => {
    const touch = event.touches.length === 1 ? event.touches[0] : null;
    touchStart.current = touch ? { clientX: touch.clientX, clientY: touch.clientY } : null;
  };

  const handleTouchEnd = (event) => {
    const step = swipeDirection(touchStart.current, event.changedTouches[0]);
    touchStart.current = null;
    if (step) stepImage(step);
  };

  if (!availableImages.length) {
    return isPublic ? <div className="dg-pd__gallery"><div className="dg-pd__gallery-stage"><div className="dg-pd__gallery-empty">Sin imágenes disponibles</div>{badge}</div></div> : <div className="dg-product-gallery__empty">Sin imágenes cargadas</div>;
  }

  return (
    <div className={isPublic ? "dg-pd__gallery" : prefix}>
      <div
        className={isPublic ? "dg-pd__gallery-stage" : `${prefix}__stage`}
        role="group"
        aria-label={`Galería de ${productName}`}
        tabIndex={!isPublic && hasMultipleImages ? 0 : undefined}
        onKeyDown={handleGalleryKeyDown}
        onTouchStart={isPublic ? undefined : handleTouchStart}
        onTouchEnd={isPublic ? undefined : handleTouchEnd}
      >
        {isPublic ? (
          <button className="dg-pd__expand" type="button" aria-label={`Ampliar imagen ${selectedIndex + 1} de ${productName}`} aria-haspopup="dialog" onClick={() => setExpanded(true)}>
            <img src={availableImages[selectedIndex]} alt={`${productName}, imagen ${selectedIndex + 1} de ${availableImages.length}`} />
            <span className="dg-pd__expand-hint"><FiMaximize aria-hidden="true" /> Ampliar</span>
          </button>
        ) : <img src={availableImages[selectedIndex]} alt={`${productName}, imagen ${selectedIndex + 1} de ${availableImages.length}`} />}
        {badge}

        {hasMultipleImages ? (
          <>
            <button
              className={`${prefix}__arrow is-previous`}
              type="button"
              aria-label="Ver imagen anterior"
              onClick={showPrevious}
            >
              <FiChevronLeft aria-hidden="true" />
            </button>
            <button
              className={`${prefix}__arrow is-next`}
              type="button"
              aria-label="Ver imagen siguiente"
              onClick={showNext}
            >
              <FiChevronRight aria-hidden="true" />
            </button>
          </>
        ) : null}
        {(isPublic || hasMultipleImages) && <span className={isPublic ? "dg-pd__image-count" : `${prefix}__counter`} role="status" aria-live="polite" aria-atomic="true">
          {selectedIndex + 1} / {availableImages.length}
        </span>}
      </div>

      {hasMultipleImages ? (
        <div ref={thumbnails} className={`${prefix}__thumbnails`} role="group" aria-label="Seleccionar imagen" onKeyDown={handleGalleryKeyDown}>
          {availableImages.map((image, index) => (
            <button
              key={`${image}-${index}`}
              className={index === selectedIndex ? "is-active" : ""}
              type="button"
              aria-label={`Ver imagen ${index + 1}`}
              aria-current={index === selectedIndex ? "true" : undefined}
              onClick={() => setActiveIndex(index)}
            >
              <img src={image} alt="" />
            </button>
          ))}
        </div>
      ) : null}
      {isPublic && expanded && <ImageLightbox images={availableImages} activeIndex={selectedIndex} productName={productName} onStep={stepImage} onClose={() => setExpanded(false)} />}
    </div>
  );
};

export default ProductGallery;
