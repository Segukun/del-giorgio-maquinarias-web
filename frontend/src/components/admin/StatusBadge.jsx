const STATUS_STYLES = {
  Publicado: "is-published",
  Borrador: "is-draft",
  Pendiente: "is-pending",
};

const StatusBadge = ({ status }) => (
  <span className={`dg-status-badge ${STATUS_STYLES[status] ?? ""}`}>{status}</span>
);

export default StatusBadge;
