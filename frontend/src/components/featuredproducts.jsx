import { useState } from "react";
import MachineryCard from "./common/machinerycard";
import "../styles/featuredproducts.css";

const PAGE_SIZE = 4;

const FeaturedProducts = ({ products }) => {
  const [visible, setVisible] = useState(PAGE_SIZE);

  const hasMore = visible < products.length;
  const isExpanded = visible > PAGE_SIZE;

  const showMore = () =>
    setVisible((v) => Math.min(v + PAGE_SIZE, products.length));

  const showLess = () => setVisible(PAGE_SIZE);

  return (
    <section className="dg-featured">
      <div className="dg-featured__header">
        <h2>Destacadas</h2>
      </div>

      <div className="dg-featured__grid">
        {products.slice(0, visible).map((product) => (
          <MachineryCard
            key={product.id}
            product={product}
          />
        ))}
      </div>

      {(hasMore || isExpanded) && (
        <div className="dg-featured__footer">
          {hasMore ? (
            <button
              className="dg-btn dg-btn--outline-dark"
              onClick={showMore}
            >
              Ver más destacadas
            </button>
          ) : (
            <button
              className="dg-btn dg-btn--outline-dark"
              onClick={showLess}
            >
              Ver menos
            </button>
          )}
        </div>
      )}
    </section>
  );
};

export default FeaturedProducts;