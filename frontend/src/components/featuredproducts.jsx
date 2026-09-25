import { useEffect, useState } from "react";
import { fetchProducts } from "../firebase/products.js";
import { trackWhatsappClick } from "../firebase/tracking.js";
import "../styles/featuredproducts.css";

const CONDITION_LABELS = {
  Nuevo: { label: "Nuevo", className: "is-new" },
  Usado: { label: "Usado", className: "is-used" },
};

const PAGE_SIZE = 4;

const FeaturedProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [visible, setVisible] = useState(PAGE_SIZE);

  useEffect(() => {
    let isMounted = true;

    const loadFeatured = async () => {
      try {
        const data = await fetchProducts();
        if (!isMounted) return;
        const featured = data.filter(
          (product) => product.featured && product.status === "Publicado",
        );
        setProducts(featured);
      } catch (error) {
        console.error("No se pudieron cargar las máquinas destacadas:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadFeatured();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading || !products.length) return null;

  const hasMore = visible < products.length;
  const isExpanded = visible > PAGE_SIZE;

  const showMore = () => setVisible((v) => Math.min(v + PAGE_SIZE, products.length));
  const showLess = () => setVisible(PAGE_SIZE);

  const visibleProducts = products.slice(0, visible);

  const whatsappHref = (name) =>
    "https://wa.me/542281301249?text=" +
    encodeURIComponent(`Hola, quisiera consultar por ${name}.`);

  return (
    <section className="dg-featured">
      <div className="dg-featured__header">
        <h2>Destacadas</h2>
      </div>

      <div className="dg-featured__grid">
        {visibleProducts.map((p) => {
          const condition = CONDITION_LABELS[p.condition] ?? CONDITION_LABELS.Usado;
          const hoursText = p.condition === "Usado" ? p.hoursTag : "Nuevo";

          return (
            <article key={p.id} className="dg-product-card">
              <div className="dg-product-card__image-wrap">
                <img src={p.images?.[0]} alt={p.name} loading="lazy" />
                <div className="dg-product-card__badges">
                  <span className={`dg-product-card__badge ${condition.className}`}>
                    {condition.label}
                  </span>
                </div>
              </div>

              <div className="dg-product-card__body">
                <h3>{p.name}</h3>
                <p className="dg-product-card__meta">
                  Año: {p.year} &nbsp;|&nbsp; {hoursText}
                </p>

                <div className="dg-product-card__actions">
                  <a href={`/maquinaria/${p.id}`} className="dg-btn dg-btn--primary dg-btn--small">
                    Ver detalle
                  </a>

                  <a
                    href={whatsappHref(p.name)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="dg-product-card__whatsapp"
                    aria-label="Consultar por WhatsApp"
                    onClick={()=> trackWhatsappClick()}
                  >
                    <svg viewBox="0 0 32 32" width="18" height="18" fill="currentColor">
                      <path d="M16.01 3C9.39 3 4 8.36 4 14.95c0 2.2.6 4.27 1.66 6.06L4 29l8.24-2.15a12.9 12.9 0 0 0 3.77.56h.01c6.62 0 12-5.36 12-11.95C28.02 8.36 22.63 3 16.01 3z" />
                    </svg>
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {(hasMore || isExpanded) && (
        <div className="dg-featured__footer">
          {hasMore ? (
            <button className="dg-btn dg-btn--outline-dark" onClick={showMore}>
              Ver más destacadas
            </button>
          ) : (
            <button className="dg-btn dg-btn--outline-dark" onClick={showLess}>
              Ver menos
            </button>
          )}
        </div>
      )}
    </section>
  );
};

export default FeaturedProducts;