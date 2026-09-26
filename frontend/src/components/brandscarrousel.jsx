import { Link } from "react-router-dom";
import { fetchBrands } from "../firebase/brands.js";
import { useEffect, useState } from "react";
import "../styles/brandscarrousel.css";

const BrandsCarrousel = () => {
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadBrands = async () => {
      try {
        const data = await fetchBrands();
        if (!isMounted) return;
        setBrands(data.filter((brand) => brand.isActive));
      } catch (error) {
        console.error("No se pudieron cargar las marcas:", error);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadBrands();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading || !brands.length) return null;

  const loopBrands = [...brands, ...brands];

  return (
    <section className="dg-brands">
      <div className="dg-brands__header">
        <h2>Nuestras marcas</h2>
      </div>

      <div className="dg-brands__track-wrapper">
        <div className="dg-brands__track">
          {loopBrands.map((brand, i) => (
            <Link
              className="dg-brands__item"
              key={`${brand.id}-${i}`}
              to={`/catalogo?marca=${encodeURIComponent(brand.name)}&label=${encodeURIComponent(brand.name)}`}
              aria-label={`Ver maquinaria de ${brand.name}`}
            >
              <img src={brand.image?.url ?? brand.image} alt={brand.name} loading="lazy" />
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandsCarrousel;