export const canCreateStaffAccounts = (currentUser) => currentUser?.role === "owner";

export const canManageStaffAccount = (currentUser, targetUser) =>
  currentUser?.role === "owner" &&
  targetUser?.role === "staff" &&
  targetUser.id !== currentUser.id;
