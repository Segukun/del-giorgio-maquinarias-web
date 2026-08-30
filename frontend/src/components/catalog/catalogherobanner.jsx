import "../../styles/catalog/catalogherobanner.css";

export default function CatalogHeroBanner({ title, subtitle }) {
  return (
    <section
      className="dg-catalog-hero"
      style={{ backgroundImage: "url(/category-cosechadora.jpg)" }}
    >
      <div className="dg-catalog-hero__overlay" />
      <div className="dg-catalog-hero__content">
        <h1>{title}</h1>
        <p>{subtitle}</p>
      </div>
    </section>
  );
}
