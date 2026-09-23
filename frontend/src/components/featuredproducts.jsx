import { useState } from "react";
import "../styles/featuredproducts.css";

const ALL_PRODUCTS = [
  {
    id: 1,
    name: "John Deere 6155J",
    image: "/tractor-red.png",
    year: 2018,
    hours: "5.200 hs",
    detail: "Potencia: 155 HP",
    condition: "usado",
  },
  {
    id: 2,
    name: "Crucianelli Pionera 3520",
    image: "/sembradora-red.png",
    year: 2021,
    hours: "0 km",
    detail: "21 líneas a 52,5 cm",
    condition: "nuevo",
  },
  {
    id: 3,
    name: "New Holland CX740",
    image: "/cosechadora-yellow.png",
    year: 2016,
    hours: "2.800 hs",
    detail: "Plataforma 35 pies",
    condition: "usado",
  },
  {
    id: 4,
    name: "Rastra TBeH 28 Discos",
    image: "/rastra-red.png",
    year: 2019,
    hours: "Muy buen estado",
    detail: "28 discos dentados",
    condition: "usado",
  },
  {
    id: 5,
    name: "Rastrillo Rotativo",
    image: "/rastrillo-roto.png",
    year: 2017,
    hours: "Buen estado",
    detail: "Ancho de trabajo 6,5 m",
    condition: "usado",
  },
];

const CONDITION_LABELS = {
  nuevo: { label: "Nuevo", className: "is-new" },
  usado: { label: "Usado", className: "is-used" },
};

const PAGE_SIZE = 4;

const FeaturedProducts = () => {
  const [visible, setVisible] = useState(PAGE_SIZE);

  const hasMore = visible < ALL_PRODUCTS.length;
  const isExpanded = visible > PAGE_SIZE;

  const showMore = () => setVisible((v) => Math.min(v + PAGE_SIZE, ALL_PRODUCTS.length));
  const showLess = () => setVisible(PAGE_SIZE);

  const products = ALL_PRODUCTS.slice(0, visible);

  const whatsappHref = (name) =>
    "https://wa.me/542281301249?text=" +
    encodeURIComponent(`Hola, quisiera consultar por ${name}.`);

  return (
    <section className="dg-featured">
      <div className="dg-featured__header">
        <h2>Destacadas</h2>
      </div>

      <div className="dg-featured__grid">
        {products.map((p) => {
          const condition = CONDITION_LABELS[p.condition];
          return (
            <article key={p.id} className="dg-product-card">
              <div className="dg-product-card__image-wrap">
                <img src={p.image} alt={p.name} loading="lazy" />
                <div className="dg-product-card__badges">
                  <span className={`dg-product-card__badge ${condition.className}`}>
                    {condition.label}
                  </span>
                </div>
              </div>

              <div className="dg-product-card__body">
                <h3>{p.name}</h3>
                <p className="dg-product-card__meta">
                  Año: {p.year} &nbsp;|&nbsp; {p.hours}
                </p>
                <p className="dg-product-card__meta">{p.detail}</p>

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
}

export default FeaturedProducts;