import { useState } from "react";
import AdminSessionContext from "../context/AdminSessionContext.js";
import { MOCK_ADMIN_USERS, MOCK_CURRENT_USER_ID } from "../data/adminUsers.js";
import {
  canCreateStaffAccounts,
  canManageStaffAccount,
} from "../utils/adminPermissions.js";

const AdminSessionProvider = ({ children }) => {
  const [users, setUsers] = useState(MOCK_ADMIN_USERS);
  const [currentUserId] = useState(MOCK_CURRENT_USER_ID);

  const currentUser = users.find((user) => user.id === currentUserId) ?? null;
  const isOwner = canCreateStaffAccounts(currentUser);

  const createStaff = ({ name, email }) => {
    if (!canCreateStaffAccounts(currentUser)) return false;

    setUsers((current) => [
      ...current,
      {
        id: `staff-${Date.now()}`,
        name: name.trim(),
        email: email.trim().toLowerCase(),
        role: "staff",
        status: "active",
      },
    ]);
    return true;
  };

  const updateStaff = (id, { name, email }) => {
    const target = users.find((user) => user.id === id);
    if (!canManageStaffAccount(currentUser, target)) {
      return false;
    }

    setUsers((current) =>
      current.map((user) =>
        user.id === id
          ? { ...user, name: name.trim(), email: email.trim().toLowerCase() }
          : user,
      ),
    );
    return true;
  };

  const deleteStaff = (id) => {
    const target = users.find((user) => user.id === id);
    if (!canManageStaffAccount(currentUser, target)) {
      return false;
    }

    setUsers((current) => current.filter((user) => user.id !== id));
    return true;
  };

  const updateCurrentUser = ({ name, email }) => {
    if (!currentUser) return false;

    setUsers((current) =>
      current.map((user) =>
        user.id === currentUserId
          ? { ...user, name: name.trim(), email: email.trim().toLowerCase() }
          : user,
      ),
    );
    return true;
  };

  return (
    <AdminSessionContext.Provider
      value={{
        users,
        currentUser,
        isOwner,
        createStaff,
        updateStaff,
        deleteStaff,
        updateCurrentUser,
      }}
    >
      {children}
    </AdminSessionContext.Provider>
  );
};

export default AdminSessionProvider;
