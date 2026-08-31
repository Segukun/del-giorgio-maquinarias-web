import "../../styles/catalog/productgrid.css";
import MachineryCard from "../common/machinerycard";

const ProductGrid = ({ products, visibleCount, onLoadMore }) => {
  const visible = products.slice(0, visibleCount);
  const hasMore = visibleCount < products.length;

  return (
    <div className="dg-productgrid">
      <div className="dg-productgrid__grid">
        {visible.map((product) => (
          <MachineryCard key={product.id} product={product} />
        ))}
      </div>

      {hasMore && (
        <div className="dg-productgrid__footer">
          <button type="button" className="dg-productgrid__load-more" onClick={onLoadMore}>
            Cargar más resultados
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M6 9l6 6 6-6" />
            </svg>
          </button>
        </div>
      )}
    </div>
  );
}

export default ProductGrid;