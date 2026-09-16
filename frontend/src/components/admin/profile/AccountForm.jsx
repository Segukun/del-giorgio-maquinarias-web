import { useState } from "react";
import { validateAdminUserForm } from "../../../utils/adminUserValidation.js";
import { StaffRoleBadge } from "../staff/StaffBadges.jsx";

const AccountForm = ({ user, users, onSubmit }) => {
  const [values, setValues] = useState({
    name: user.name,
    email: user.email,
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
    const nextErrors = validateAdminUserForm(values);
    const emailAlreadyExists = users.some(
      (item) =>
        item.id !== user.id && item.email.toLowerCase() === values.email.trim().toLowerCase(),
    );

    if (emailAlreadyExists) nextErrors.email = "Ya existe una cuenta con este email.";

    if (Object.keys(nextErrors).length) {
      setErrors(nextErrors);
      return;
    }

    onSubmit({ name: values.name, email: values.email });
    setValues((current) => ({ ...current, password: "", confirmPassword: "" }));
  };

  return (
    <form className="dg-account-form" onSubmit={handleSubmit} noValidate>
      <div className="dg-account-form__summary">
        <div className="dg-account-form__avatar" aria-hidden="true">
          {user.name
            .split(" ")
            .slice(0, 2)
            .map((part) => part[0])
            .join("")
            .toUpperCase()}
        </div>
        <div>
          <strong>{user.name}</strong>
          <span>{user.email}</span>
        </div>
        <StaffRoleBadge role={user.role} />
      </div>

      <div className="dg-account-form__grid">
        <label>
          <span>Nombre</span>
          <input
            value={values.name}
            onChange={(event) => update("name", event.target.value)}
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "account-name-error" : undefined}
            autoComplete="name"
          />
          {errors.name ? <small id="account-name-error">{errors.name}</small> : null}
        </label>

        <label>
          <span>Email</span>
          <input
            type="email"
            value={values.email}
            onChange={(event) => update("email", event.target.value)}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? "account-email-error" : undefined}
            autoComplete="email"
          />
          {errors.email ? <small id="account-email-error">{errors.email}</small> : null}
        </label>

        <label>
          <span>Nueva contraseña</span>
          <input
            type="password"
            value={values.password}
            onChange={(event) => update("password", event.target.value)}
            autoComplete="new-password"
          />
          <em>Dejar vacío para mantener la contraseña actual.</em>
        </label>

        <label>
          <span>Confirmar nueva contraseña</span>
          <input
            type="password"
            value={values.confirmPassword}
            onChange={(event) => update("confirmPassword", event.target.value)}
            aria-invalid={Boolean(errors.confirmPassword)}
            aria-describedby={errors.confirmPassword ? "account-confirm-error" : undefined}
            autoComplete="new-password"
          />
          {errors.confirmPassword ? (
            <small id="account-confirm-error">{errors.confirmPassword}</small>
          ) : null}
        </label>
      </div>

      <div className="dg-account-form__footer">
        <p>El tipo de cuenta no puede modificarse desde Mi cuenta.</p>
        <button className="dg-button dg-button--primary" type="submit">
          Guardar cambios
        </button>
      </div>
    </form>
  );
};

export default AccountForm;
