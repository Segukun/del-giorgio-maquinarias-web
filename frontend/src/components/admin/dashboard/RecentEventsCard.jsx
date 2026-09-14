import { FiClock } from "react-icons/fi";

const formatTime = (date) => {
  if (!date) return "";
  return date.toLocaleTimeString("es-AR", { hour: "2-digit", minute: "2-digit" });
};

const RecentEventsCard = ({ events }) => (
  <div className="dg-dashboard-card">
    <div className="dg-dashboard-card__heading">
      <span>
        <FiClock aria-hidden="true" /> Movimientos recientes
      </span>
    </div>

    {events.length ? (
      <ul className="dg-recent-events-list">
        {events.map((event) => (
          <li key={event.id}>
            <span>
              Se ha consultado por <strong>{event.productName}</strong>
            </span>
            <span className="dg-recent-events-list__time">
              {formatTime(event.createdAt?.toDate?.())}
            </span>
          </li>
        ))}
      </ul>
    ) : (
      <p className="dg-dashboard-card__empty">Todavía no hay consultas registradas.</p>
    )}
  </div>
);

export default RecentEventsCard;