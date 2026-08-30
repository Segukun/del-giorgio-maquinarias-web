import { FaWhatsapp } from "react-icons/fa";
import "../../styles/catalog/productcard.css";

const CONDITION_LABELS = {
  nuevo: { label: "Nuevo", className: "is-new" },
  usado: { label: "Usado", className: "is-used" },
};

export default function ProductCard({ product }) {
  const condition = CONDITION_LABELS[product.condition];

  const whatsappHref =
    "https://wa.me/5493468123456?text=" +
    encodeURIComponent(`Hola, quisiera consultar por ${product.name}.`);

  return (
    <article className="dg-catalog-card">
      <div className="dg-catalog-card__image-wrap">
        <img src={product.image} alt={product.name} loading="lazy" />
        <span className={`dg-catalog-card__badge ${condition.className}`}>
          {condition.label}
        </span>
      </div>

      <div className="dg-catalog-card__body">
        <h3>{product.name}</h3>

        {product.specs.map((spec) => (
          <p className="dg-catalog-card__meta" key={spec.label}>
            {spec.label}: {spec.value}
          </p>
        ))}

        <div className="dg-catalog-card__actions">
          <a
            href={`/maquinaria/${product.id}`}
            className="dg-catalog-card__detail"
          >
            Ver detalle
          </a>
          <a
            href={whatsappHref}
            target="_blank"
            rel="noopener noreferrer"
            className="dg-catalog-card__whatsapp"
            aria-label="Consultar por WhatsApp"
          >
            <FaWhatsapp size={18} />
          </a>
        </div>
      </div>
    </article>
  );
}