import { FiEdit3, FiLock, FiTrash2 } from "react-icons/fi";
import { StaffRoleBadge, StaffStatusBadge } from "./StaffBadges.jsx";
import { canManageStaffAccount } from "../../../utils/adminPermissions.js";

const getInitials = (name) =>
  name
    .split(" ")
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();

const StaffRow = ({ user, currentUser, showActions, onEdit, onDelete }) => {
  const manageable = canManageStaffAccount(currentUser, user);
  const isSelf = user.id === currentUser?.uid;

  return (
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
      {showActions ? (
        <td data-label="Acciones">
          {manageable ? (
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
            <span
              className="dg-staff-row__protected"
              title={
                isSelf
                  ? "La cuenta propia se modifica desde Mi cuenta"
                  : "No tenés permiso para administrar esta cuenta"
              }
            >
              <FiLock aria-hidden="true" />
              {isSelf ? "Mi cuenta" : "Protegida"}
            </span>
          )}
        </td>
      ) : null}
    </tr>
  );
};

export default StaffRow;