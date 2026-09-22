import { useState } from "react";
import AdminModal from "../AdminModal.jsx";
import { validateAdminUserForm } from "../../../utils/adminUserValidation.js";

const StaffFormModal = ({ user, users, onClose, onSubmit }) => {
  const isEditing = Boolean(user);
  const [values, setValues] = useState({
    name: user?.name ?? "",
    email: user?.email ?? "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});

  const update = (field, value) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: "" }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    const nextErrors = validateAdminUserForm(values, { passwordRequired: !isEditing });
    const emailAlreadyExists = users.some(
      (item) =>
        item.id !== user?.id && item.email.toLowerCase() === values.email.trim().toLowerCase(),
    );

    if (emailAlreadyExists) nextErrors.email = "Ya existe una cuenta con este email.";

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    onSubmit(
      {
        name: values.name,
        email: values.email,
        password: values.password || undefined, // vacío al editar = no cambiar contraseña
      },
      isEditing,
    );
  };

  return (
    <AdminModal
      title={isEditing ? "Editar cuenta" : "Nuevo usuario"}
      eyebrow={isEditing ? "Cuenta de personal" : "Alta de personal"}
      onClose={onClose}
      size="large"
    >
      <form className="dg-account-form dg-account-form--modal" onSubmit={handleSubmit} noValidate>
        <div className="dg-account-form__role-note">
          <strong>Tipo de cuenta: Personal</strong>
          <span>Desde esta sección no se pueden crear ni convertir cuentas de propietario.</span>
        </div>

        <div className="dg-account-form__grid">
          <label>
            <span>Nombre</span>
            <input
              value={values.name}
              onChange={(event) => update("name", event.target.value)}
              aria-invalid={Boolean(errors.name)}
              aria-describedby={errors.name ? "staff-name-error" : undefined}
              autoComplete="name"
            />
            {errors.name ? <small id="staff-name-error">{errors.name}</small> : null}
          </label>

          <label>
            <span>Email</span>
            <input
              type="email"
              value={values.email}
              onChange={(event) => update("email", event.target.value)}
              aria-invalid={Boolean(errors.email)}
              aria-describedby={errors.email ? "staff-email-error" : undefined}
              autoComplete="email"
            />
            {errors.email ? <small id="staff-email-error">{errors.email}</small> : null}
          </label>

          <label>
            <span>{isEditing ? "Nueva contraseña" : "Contraseña"}</span>
            <input
              type="password"
              minLength={6}
              value={values.password}
              onChange={(event) => update("password", event.target.value)}
              aria-invalid={Boolean(errors.password)}
              aria-describedby={errors.password ? "staff-password-error" : undefined}
              autoComplete="new-password"
            />
            {errors.password ? <small id="staff-password-error">{errors.password}</small> : null}
            {isEditing ? <em>Dejar vacío para mantener la contraseña actual.</em> : null}
          </label>

          <label>
            <span>{isEditing ? "Confirmar nueva contraseña" : "Confirmar contraseña"}</span>
            <input
              type="password"
              minLength={6}
              value={values.confirmPassword}
              onChange={(event) => update("confirmPassword", event.target.value)}
              aria-invalid={Boolean(errors.confirmPassword)}
              aria-describedby={errors.confirmPassword ? "staff-confirm-error" : undefined}
              autoComplete="new-password"
            />
            {errors.confirmPassword ? (
              <small id="staff-confirm-error">{errors.confirmPassword}</small>
            ) : null}
          </label>
        </div>

        <div className="dg-modal__actions">
          <button className="dg-button dg-button--secondary" type="button" onClick={onClose}>
            Cancelar
          </button>
          <button className="dg-button dg-button--primary" type="submit">
            {isEditing ? "Aplicar cambios" : "Crear usuario"}
          </button>
        </div>
      </form>
    </AdminModal>
  );
};

export default StaffFormModal;
