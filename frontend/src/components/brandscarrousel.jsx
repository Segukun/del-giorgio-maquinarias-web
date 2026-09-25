import { useEffect, useState } from "react";
import { fetchBrands } from "../firebase/brands.js";
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

  // Se duplica la lista para lograr un loop continuo sin cortes.
  const loopBrands = [...brands, ...brands];

  return (
    <section className="dg-brands">
      <div className="dg-brands__header">
        <h2>Nuestras marcas</h2>
      </div>

      <div className="dg-brands__track-wrapper">
        <div className="dg-brands__track">
          {loopBrands.map((brand, i) => (
            <div className="dg-brands__item" key={`${brand.id}-${i}`}>
              <img src={brand.image?.url ?? brand.image} alt={brand.name} loading="lazy" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BrandsCarrousel;