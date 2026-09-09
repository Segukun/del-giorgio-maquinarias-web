import { useRef, useState } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";

const SWIPE_THRESHOLD = 42;

const ProductGallery = ({ productName, images }) => {
  const availableImages = images?.length ? images : [];
  const [activeIndex, setActiveIndex] = useState(0);
  const touchStartX = useRef(null);
  const hasMultipleImages = availableImages.length > 1;

  const showPrevious = () => {
    setActiveIndex((index) => (index - 1 + availableImages.length) % availableImages.length);
  };

  const showNext = () => {
    setActiveIndex((index) => (index + 1) % availableImages.length);
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
    touchStartX.current = event.touches[0]?.clientX ?? null;
  };

  const handleTouchEnd = (event) => {
    if (touchStartX.current === null) return;

    const touchEndX = event.changedTouches[0]?.clientX ?? touchStartX.current;
    const distance = touchEndX - touchStartX.current;
    touchStartX.current = null;

    if (Math.abs(distance) < SWIPE_THRESHOLD) return;
    if (distance > 0) showPrevious();
    else showNext();
  };

  if (!availableImages.length) {
    return <div className="dg-product-gallery__empty">Sin imágenes cargadas</div>;
  }

  return (
    <div className="dg-product-gallery">
      <div
        className="dg-product-gallery__stage"
        role="group"
        aria-label={`Galería de ${productName}`}
        tabIndex={hasMultipleImages ? 0 : -1}
        onKeyDown={handleGalleryKeyDown}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <img
          src={availableImages[activeIndex]}
          alt={`${productName}, imagen ${activeIndex + 1} de ${availableImages.length}`}
        />

        {hasMultipleImages ? (
          <>
            <button
              className="dg-product-gallery__arrow is-previous"
              type="button"
              aria-label="Ver imagen anterior"
              onClick={showPrevious}
            >
              <FiChevronLeft aria-hidden="true" />
            </button>
            <button
              className="dg-product-gallery__arrow is-next"
              type="button"
              aria-label="Ver imagen siguiente"
              onClick={showNext}
            >
              <FiChevronRight aria-hidden="true" />
            </button>
            <span className="dg-product-gallery__counter" aria-live="polite">
              {activeIndex + 1} / {availableImages.length}
            </span>
          </>
        ) : null}
      </div>

      {hasMultipleImages ? (
        <div className="dg-product-gallery__thumbnails" aria-label="Seleccionar imagen">
          {availableImages.map((image, index) => (
            <button
              key={`${image}-${index}`}
              className={index === activeIndex ? "is-active" : ""}
              type="button"
              aria-label={`Ver imagen ${index + 1}`}
              aria-current={index === activeIndex ? "true" : undefined}
              onClick={() => setActiveIndex(index)}
            >
              <img src={image} alt="" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
};

export default ProductGallery;
