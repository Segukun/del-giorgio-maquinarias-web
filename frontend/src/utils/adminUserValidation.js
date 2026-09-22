const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MIN_PASSWORD_LENGTH = 6;

export const validateAdminUserForm = (values, { passwordRequired = false } = {}) => {
  const errors = {};

  if (!values.name.trim()) errors.name = "Ingresá un nombre.";

  if (!values.email.trim()) {
    errors.email = "Ingresá un email.";
  } else if (!EMAIL_PATTERN.test(values.email.trim())) {
    errors.email = "Ingresá un email válido.";
  }

  if (passwordRequired && !values.password) {
    errors.password = "Ingresá una contraseña.";
  } else if (values.password && values.password.length < MIN_PASSWORD_LENGTH) {
    errors.password = `La contraseña debe tener al menos ${MIN_PASSWORD_LENGTH} caracteres.`;
  }

  if ((values.password || values.confirmPassword) && values.password !== values.confirmPassword) {
    errors.confirmPassword = "Las contraseñas no coinciden.";
  }

  return errors;
};