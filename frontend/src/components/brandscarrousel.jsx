import "../styles/brandscarrousel.css";

const BRANDS = [
  { name: "Case IH", logo: "/brand/case-ih.png" },
  { name: "New Holland", logo: "/brand/new-holland.png" },
  { name: "John Deere", logo: "/brand/john-deere.png" },
  { name: "AGCO", logo: "/brand/agco.png" },
  { name: "Claas", logo: "/brand/claas.png" },
  { name: "Kuhn", logo: "/brand/kuhn.png" },
  { name: "Metalfor", logo: "/brand/metalfor.png" },
  { name: "Jacto", logo: "/brand/jacto.png" },
];

// Se duplica la lista para lograr un loop continuo sin cortes.
const LOOP_BRANDS = [...BRANDS, ...BRANDS];

const BrandsCarrousel = () => {
  return (
    <section className="dg-brands">
      <div className="dg-brands__header">
        <h2>Nuestras marcas</h2>
      </div>

      <div className="dg-brands__track-wrapper">
        <div className="dg-brands__track">
          {LOOP_BRANDS.map((brand, i) => (
            <div className="dg-brands__item" key={`${brand.name}-${i}`}>
              <img src={brand.logo} alt={brand.name} loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default BrandsCarrousel;
