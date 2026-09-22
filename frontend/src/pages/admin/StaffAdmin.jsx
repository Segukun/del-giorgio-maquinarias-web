import { useMemo, useState } from "react";
import { FiCheckCircle, FiEye, FiPlus, FiUsers, FiX } from "react-icons/fi";
import AdminLayout from "../../components/admin/AdminLayout.jsx";
import DeleteStaffModal from "../../components/admin/staff/DeleteStaffModal.jsx";
import StaffFormModal from "../../components/admin/staff/StaffFormModal.jsx";
import StaffTable from "../../components/admin/staff/StaffTable.jsx";
import StaffToolbar from "../../components/admin/staff/StaffToolbar.jsx";
import useAdminSession from "../../hooks/useAdminSession.js";
import "../../styles/admin/layout.css";
import "../../styles/admin/products.css";
import "../../styles/admin/staff.css";

const normalize = (value) =>
  value
    .toLocaleLowerCase("es")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

const StaffAdmin = () => {
  const { users, isOwner, createStaff, updateStaff, deleteStaff } = useAdminSession();
  const [query, setQuery] = useState("");
  const [modal, setModal] = useState(null);
  const [notice, setNotice] = useState("");

  const filteredUsers = useMemo(() => {
    const normalizedQuery = normalize(query.trim());
    if (!normalizedQuery) return users;

    return users.filter((user) =>
      normalize(`${user.name} ${user.email}`).includes(normalizedQuery),
    );
  }, [query, users]);

  const handleSave = async (form, isEditing) => {
    const succeeded = isEditing
      ? await updateStaff(modal.user.id, form)
      : await createStaff(form);

    if (!succeeded) return;

    setModal(null);
    setNotice(
      isEditing
        ? `${form.name} se actualizó correctamente.`
        : `${form.name} se agregó como personal.`,
    );
  };

  const handleDelete = async (id) => {
    const user = users.find((item) => item.id === id);
    const succeeded = await deleteStaff(id);
    if (!succeeded) return;

    setModal(null);
    setNotice(`${user?.name ?? "La cuenta"} se eliminó correctamente.`);
  };

  return (
    <AdminLayout
      onUnavailable={(section) =>
        setNotice(`La sección ${section} queda preparada para una próxima etapa.`)
      }
    >
      <section className="dg-products-admin dg-staff-admin" aria-labelledby="staff-admin-title">
        <div className="dg-products-admin__heading">
          <div className="dg-products-admin__title-group">
            <span className="dg-products-admin__title-icon" aria-hidden="true">
              <FiUsers />
            </span>
            <div>
              <h1 id="staff-admin-title">Gestión de personal</h1>
              <p>{users.length} cuentas registradas</p>
            </div>
          </div>

          {isOwner ? (
            <button
              className="dg-button dg-button--primary dg-products-admin__new"
              type="button"
              onClick={() => setModal({ type: "form", user: null })}
            >
              <FiPlus aria-hidden="true" />
              Nuevo usuario
            </button>
          ) : null}
        </div>

        {!isOwner ? (
          <div className="dg-staff-readonly" role="note">
            <FiEye aria-hidden="true" />
            <div>
              <strong>Vista de solo lectura</strong>
              <span>Podés consultar las cuentas, pero solo el propietario puede administrarlas.</span>
            </div>
          </div>
        ) : null}

        {notice ? (
          <div className="dg-admin-notice" role="status">
            <FiCheckCircle aria-hidden="true" />
            <span>{notice}</span>
            <button type="button" aria-label="Cerrar aviso" onClick={() => setNotice("")}>
              <FiX aria-hidden="true" />
            </button>
          </div>
        ) : null}

        <div className="dg-products-admin__panel">
          <StaffToolbar query={query} onQueryChange={setQuery} />
          <StaffTable
            users={filteredUsers}
            canManage={isOwner}
            onEdit={(user) => setModal({ type: "form", user })}
            onDelete={(user) => setModal({ type: "delete", user })}
          />
          <div className="dg-staff-admin__footer" aria-live="polite">
            {filteredUsers.length === users.length
              ? `${users.length} cuentas registradas`
              : `${filteredUsers.length} de ${users.length} cuentas`}
          </div>
        </div>
      </section>

      {modal?.type === "form" && isOwner ? (
        <StaffFormModal
          user={modal.user}
          users={users}
          onClose={() => setModal(null)}
          onSubmit={handleSave}
        />
      ) : null}

      {modal?.type === "delete" && isOwner ? (
        <DeleteStaffModal
          user={modal.user}
          onClose={() => setModal(null)}
          onConfirm={handleDelete}
        />
      ) : null}
    </AdminLayout>
  );
};

export default StaffAdmin;
