import { FiUsers } from "react-icons/fi";
import StaffRow from "./StaffRow.jsx";

const StaffTable = ({ users, canManage, onEdit, onDelete }) => {
  if (!users.length) {
    return (
      <div className="dg-staff-table__empty">
        <FiUsers aria-hidden="true" />
        <strong>No encontramos cuentas</strong>
        <span>Probá con otro nombre o email.</span>
      </div>
    );
  }

  return (
    <div className="dg-staff-table__scroll">
      <table className={`dg-staff-table ${canManage ? "can-manage" : "is-readonly"}`}>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Email</th>
            <th>Tipo de cuenta</th>
            <th>Estado</th>
            {canManage ? <th>Acciones</th> : null}
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <StaffRow
              key={user.id}
              user={user}
              canManage={canManage}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default StaffTable;
