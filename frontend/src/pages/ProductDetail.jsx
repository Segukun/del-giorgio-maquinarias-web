import { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/config.js";
import { trackProductView, trackWhatsappClick } from "../firebase/tracking.js";
import "../styles/productdetail.css";

const WHATSAPP_NUMBER = "542281301249";

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  const navigate = useNavigate()
  useEffect(() => {
    let isMounted = true;

    const loadProduct = async () => {
      setLoading(true);
      setNotFound(false);
      try {
        const snap = await getDoc(doc(db, "products", id));
        if (!isMounted) return;
        if (!snap.exists()) {
          setNotFound(true);
          return;
        }
        const data = { id: snap.id, ...snap.data() };
        setProduct(data);
        setActiveImage(0);
        trackProductView(data.id, data.name);
      } catch (error) {
        console.error("No se pudo cargar el producto:", error);
        setNotFound(true);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadProduct();
    window.scrollTo({ top: 0, behavior: "instant" });
    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div className="dg-pd-state">
        <p>Cargando máquina...</p>
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="dg-pd-state">
        <h1>Lo sentimos! No encontramos esta máquina</h1>
        <p>Puede que ya no esté disponible o el enlace sea incorrecto.</p>
        <a 
          href="#" 
          onClick={(e) => {
            e.preventDefault(); // Evita que la página se recargue
            window.history.back(); // Vuelve a la página anterior
          }} 
          className="dg-pd__cta-secondary"
        >
          Volver
        </a>
      </div>
    );
  }

  const images = product.images?.length ? product.images : [];
  const hasImages = images.length > 0;
  const isUsed = product.condition === "Usado";
  const hoursLabel = isUsed ? product.hoursTag : "Nuevo";

  const specs = [
    { label: "Marca", value: product.brand },
    { label: "Categoría", value: product.category },
    { label: "Condición", value: product.condition },
    { label: "Año", value: product.year },
    ...(isUsed ? [{ label: "Uso", value: product.hoursTag }] : []),
    ...(product.extraFields ?? []).map((field) => ({ label: field.label, value: field.value })),
  ].filter((spec) => spec.value);

  const whatsappHref =
    `https://wa.me/${WHATSAPP_NUMBER}?text=` +
    encodeURIComponent(`Hola, quisiera consultar por ${product.name}.`);

  return (
    <div className="dg-pd">
      <nav className="dg-pd__breadcrumb" aria-label="Ruta de navegación">
        <button 
          onClick={() => navigate(-1)}
          style={{ background: 'none', border: 'none', padding: 0, font: 'inherit', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5" />
            <path d="M12 19l-7-7 7-7" />
          </svg>
          Volver
        </button>
      </nav>

      <div className="dg-pd__layout">
        {/* ---------- Galería ---------- */}
        <div className="dg-pd__gallery">
          <div className="dg-pd__gallery-stage">
            {hasImages ? (
              <img src={images[activeImage]} alt={product.name} />
            ) : (
              <div className="dg-pd__gallery-empty">Sin imágenes disponibles</div>
            )}

            <span className={`dg-pd__badge ${isUsed ? "is-used" : "is-new"}`}>
              {isUsed ? "Usado" : "Nuevo"}
            </span>

            {images.length > 1 ? (
              <span className="dg-pd__image-count">
                {activeImage + 1} / {images.length}
              </span>
            ) : null}
          </div>

          {images.length > 1 ? (
            <div className="dg-pd__thumbnails">
              {images.map((url, index) => (
                <button
                  key={url}
                  type="button"
                  className={index === activeImage ? "is-active" : ""}
                  onClick={() => setActiveImage(index)}
                  aria-label={`Ver imagen ${index + 1} de ${product.name}`}
                >
                  <img src={url} alt="" />
                </button>
              ))}
            </div>
          ) : null}
        </div>

        {/* ---------- Panel de información ---------- */}
        <aside className="dg-pd__info">
          <div className="dg-pd__info-sticky">
            <p className="dg-pd__brand">{product.brand}</p>
            <h1>{product.name}</h1>

            <div className="dg-pd__highlight-row">
              <span>Año {product.year}</span>
              <span className="dg-pd__dot" aria-hidden="true">•</span>
              <span>{hoursLabel}</span>
            </div>

            <a
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              className="dg-pd__whatsapp-btn"
              onClick={() => trackWhatsappClick()}
            >
              <svg viewBox="0 0 32 32" width="20" height="20" fill="currentColor" aria-hidden="true">
                <path d="M16.01 3C9.39 3 4 8.36 4 14.95c0 2.2.6 4.27 1.66 6.06L4 29l8.24-2.15a12.9 12.9 0 0 0 3.77.56h.01c6.62 0 12-5.36 12-11.95C28.02 8.36 22.63 3 16.01 3z" />
              </svg>
              Consultar por WhatsApp
            </a>

            <p className="dg-pd__whatsapp-hint">
              Consultá sin compromiso. Te respondemos por WhatsApp para coordinar lo que necesites.
            </p>
          </div>
        </aside>
      </div>

      {/* ---------- Descripción y ficha técnica ---------- */}
      <div className="dg-pd__details">
        {product.detail ? (
          <section className="dg-pd__section dg-pd__section--description">
            <h2>Descripción</h2>
            <p>{product.detail}</p>
          </section>
        ) : null}

        {specs.length ? (
          <section className="dg-pd__section">
            <h2>Ficha técnica</h2>
            <dl className="dg-pd__spec-list">
              {specs.map((spec) => (
                <div key={spec.label}>
                  <dt>{spec.label}</dt>
                  <dd>{spec.value}</dd>
                </div>
              ))}
            </dl>
          </section>
        ) : null}
      </div>
    </div>
  );
};

export default ProductDetail;