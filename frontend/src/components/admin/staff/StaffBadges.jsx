export const StaffRoleBadge = ({ role }) => (
  <span className={`dg-staff-badge dg-staff-badge--role is-${role}`}>
    {role === "owner" ? "Propietario" : "Personal"}
  </span>
);

export const StaffStatusBadge = ({ status }) => (
  <span className={`dg-staff-badge dg-staff-badge--status is-${status}`}>
    {status === "active" ? "Activo" : "Inactivo"}
  </span>
);
