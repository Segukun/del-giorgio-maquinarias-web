const ActiveStatusBadge = ({ isActive }) => (
  <span className={`dg-active-status ${isActive ? "is-active" : "is-inactive"}`}>
    {isActive ? "Activa" : "Inactiva"}
  </span>
);

export default ActiveStatusBadge;
