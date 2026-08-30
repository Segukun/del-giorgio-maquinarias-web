import "../../styles/common/machinerycard.css";

const CONDITION_LABELS = {
  nuevo: {
    label: "Nuevo",
    className: "is-new",
  },
  usado: {
    label: "Usado",
    className: "is-used",
  },
};

const MachineryCard = ({ product }) => {
  const condition = CONDITION_LABELS[product.condition];

  const whatsappHref =
    "https://wa.me/542281301249?text=" +
    encodeURIComponent(`Hola, quisiera consultar por ${product.name}.`);

  return (
    <article className="dg-machinery-card">
      <div className="dg-machinery-card__image-wrap">
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
        />

        <div className="dg-machinery-card__badges">
          <span
            className={`dg-machinery-card__badge ${condition.className}`}
          >
            {condition.label}
          </span>
        </div>
      </div>

      <div className="dg-machinery-card__body">
        <h3>{product.name}</h3>

        <p className="dg-machinery-card__meta">
          Año: {product.year} &nbsp;|&nbsp; {product.hours}
        </p>

        <p className="dg-machinery-card__meta">
          {product.detail}
        </p>

        <div className="dg-machinery-card__actions">
          <a
            href={`/maquinaria/${product.id}`}
            className="dg-btn dg-btn--primary dg-btn--small"
          >
            Ver detalle
          </a>

          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="dg-machinery-card__whatsapp"
            aria-label={`Consultar por ${product.name} en WhatsApp`}
          >
            <svg
              viewBox="0 0 32 32"
              width="18"
              height="18"
              fill="currentColor"
            >
              <path d="M16.01 3C9.39 3 4 8.36 4 14.95c0 2.2.6 4.27 1.66 6.06L4 29l8.24-2.15a12.9 12.9 0 0 0 3.77.56h.01c6.62 0 12-5.36 12-11.95C28.02 8.36 22.63 3 16.01 3z" />
            </svg>
          </a>
        </div>
      </div>
    </article>
  );
};

export default MachineryCard;