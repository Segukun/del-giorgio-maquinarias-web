import { FiAward } from "react-icons/fi";

const TopMachinesCard = ({ products, onViewMore }) => {
  const maxViews = products[0]?.viewCount ?? 1;

  return (
    <div className="dg-dashboard-card">
      <div className="dg-dashboard-card__heading">
        <span>
          <FiAward aria-hidden="true" /> Top máquinas
        </span>
        {onViewMore ? (
          <button type="button" onClick={onViewMore}>
            Ver más
          </button>
        ) : null}
      </div>

      {products.length ? (
        <table className="dg-top-machines-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Máquina</th>
              <th>Visitas</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product, index) => (
              <tr key={product.id}>
                <td>{index + 1}</td>
                <td>{product.name}</td>
                <td>
                  <div className="dg-top-machines-bar">
                    <div
                      className="dg-top-machines-bar__fill"
                      style={{ width: `${(product.viewCount / maxViews) * 100}%` }}
                    />
                    <span>{product.viewCount}</span>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="dg-dashboard-card__empty">Todavía no hay vistas registradas.</p>
      )}
    </div>
  );
};

export default TopMachinesCard;