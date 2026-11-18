import { ROLES } from "../../../firebase/users.js";

export const StaffRoleBadge = ({ role }) => (
  <span className={`dg-staff-badge dg-staff-badge--role is-${role}`}>
    {ROLES[role] ?? "Personal"}
  </span>
);

export const StaffStatusBadge = ({ status }) => (
  <span className={`dg-staff-badge dg-staff-badge--status is-${status}`}>
    {status === "active" ? "Activo" : "Inactivo"}
  </span>
);