const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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
  }

  if ((values.password || values.confirmPassword) && values.password !== values.confirmPassword) {
    errors.confirmPassword = "Las contraseñas no coinciden.";
  }

  return errors;
};
