// Debe mantenerse alineado con las reglas de functions/index.js.
// Esto solo decide qué mostrar en pantalla; la seguridad real
// la impone el servidor.

const MANAGEABLE_ROLES = {
  owner: ["admin", "staff"],
  admin: ["staff"],
  staff: [],
};

const CREATABLE_ROLES = {
  owner: ["staff", "admin"],
  admin: ["staff"],
  staff: [],
};

const getCurrentId = (currentUser) => currentUser?.uid ?? currentUser?.id;

export const getCreatableRoles = (currentUser) =>
  CREATABLE_ROLES[currentUser?.role] ?? [];

export const canCreateStaffAccounts = (currentUser) =>
  getCreatableRoles(currentUser).length > 0;

export const canManageStaffAccount = (currentUser, targetUser) => {
  if (!currentUser || !targetUser) return false;
  if (targetUser.id === getCurrentId(currentUser)) return false;
  return (MANAGEABLE_ROLES[currentUser.role] ?? []).includes(targetUser.role);
};

// Roles que se pueden elegir en el formulario.
// Sin targetUser = cuenta nueva; con targetUser = edición.
export const getAssignableRoles = (currentUser, targetUser) => {
  if (!targetUser) return getCreatableRoles(currentUser);
  if (!canManageStaffAccount(currentUser, targetUser)) return [];

  if (currentUser.role === "owner") return ["staff", "admin"];

  // Un admin solo puede promover a staff; no puede degradar admins.
  if (currentUser.role === "admin" && targetUser.role === "staff") {
    return ["staff", "admin"];
  }

  return [];
};