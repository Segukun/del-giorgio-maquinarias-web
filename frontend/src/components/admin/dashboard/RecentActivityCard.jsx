import { FiClock, FiEdit2, FiPlusCircle, FiTrash2 } from "react-icons/fi";
import { ACTION_LABELS } from "../../../firebase/adminActivity";

const ICONS = {
  create_product: FiPlusCircle,
  update_product: FiEdit2,
  delete_product: FiTrash2,
  create_brand: FiPlusCircle,
  update_brand: FiEdit2,
  delete_brand: FiTrash2,
  create_category: FiPlusCircle,
  update_category: FiEdit2,
  delete_category: FiTrash2,
};

const timeAgo = (date) => {
  if (!date) return "";
  const diffMs = Date.now() - date.getTime();
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  if (diffHours < 1) return "hace unos minutos";
  if (diffHours < 24) return `hace ${diffHours} ${diffHours === 1 ? "hora" : "horas"}`;
  const diffDays = Math.floor(diffHours / 24);
  return `hace ${diffDays} ${diffDays === 1 ? "día" : "días"}`;
};

const RecentActivityCard = ({ activity, onViewMore }) => (
  <div className="dg-dashboard-card">
    <div className="dg-dashboard-card__heading">
      <span>
        <FiClock aria-hidden="true" /> Actividad reciente
      </span>
      {onViewMore ? (
        <button type="button" onClick={onViewMore}>
          Ver más
        </button>
      ) : null}
    </div>

    {activity.length ? (
      <ul className="dg-activity-list">
        {activity.map((item) => {
          const Icon = ICONS[item.action] ?? FiEdit2;
          return (
            <li key={item.id}>
              <span className="dg-activity-list__icon" aria-hidden="true">
                <Icon />
              </span>
              <span className="dg-activity-list__text">
                <strong>{item.userName ?? item.userEmail}</strong>{" "}
                {ACTION_LABELS[item.action] ?? "realizó una acción en"} {item.targetName}
              </span>
              <span className="dg-activity-list__time">{timeAgo(item.createdAt?.toDate?.())}</span>
            </li>
          );
        })}
      </ul>
    ) : (
      <p className="dg-dashboard-card__empty">Todavía no hay actividad registrada.</p>
    )}
  </div>
);

export default RecentActivityCard;