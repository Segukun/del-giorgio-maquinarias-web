import { FiEdit3, FiLock, FiTrash2 } from "react-icons/fi";
import { StaffRoleBadge, StaffStatusBadge } from "./StaffBadges.jsx";

const getInitials = (name) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const StaffRow = ({ user, canManage, onEdit, onDelete }) => (
  <tr>
    <td data-label="Nombre">
      <div className="dg-staff-row__identity">
        <span aria-hidden="true">{getInitials(user.name)}</span>
        <strong>{user.name}</strong>
      </div>
    </td>
    <td data-label="Email">
      <a href={`mailto:${user.email}`}>{user.email}</a>
    </td>
    <td data-label="Tipo de cuenta">
      <StaffRoleBadge role={user.role} />
    </td>
    <td data-label="Estado">
      <StaffStatusBadge status={user.status} />
    </td>
    {canManage ? (
      <td data-label="Acciones">
        {user.role === "staff" ? (
          <div className="dg-staff-row__actions">
            <button type="button" aria-label={`Editar ${user.name}`} onClick={() => onEdit(user)}>
              <FiEdit3 aria-hidden="true" />
            </button>
            <button
              className="is-danger"
              type="button"
              aria-label={`Eliminar ${user.name}`}
              onClick={() => onDelete(user)}
            >
              <FiTrash2 aria-hidden="true" />
            </button>
          </div>
        ) : (
          <span className="dg-staff-row__protected" title="La cuenta propia se modifica desde Mi cuenta">
            <FiLock aria-hidden="true" />
            Mi cuenta
          </span>
        )}
      </td>
    ) : null}
  </tr>
);

export default StaffRow;
