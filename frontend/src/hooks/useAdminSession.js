import { useCallback, useContext, useEffect, useState } from "react";
import AdminSessionContext from "../context/AdminSessionContext";
import {
  createStaffUser as createStaffUserRequest,
  updateStaffUser as updateStaffUserRequest,
  deleteStaffUser as deleteStaffUserRequest,
} from "../firebase/staff";

const extractErrorMessage = (err, fallback) => {
  return err?.message ?? fallback;
};

const useAdminSession = () => {
  const { user, profile, isOwner, fetchAllUsers, refreshProfile } = useContext(AdminSessionContext);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const data = await fetchAllUsers();
      setUsers(data);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar las cuentas.");
    } finally {
      setLoading(false);
    }
  }, [fetchAllUsers]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const createStaff = async (form) => {
    setError("");
    try {
      await createStaffUserRequest(form);
      await loadUsers();
      return true;
    } catch (err) {
      console.error(err);
      setError(extractErrorMessage(err, "No se pudo crear la cuenta."));
      return false;
    }
  };

  const updateStaff = async (uid, form) => {
    setError("");
    try {
      await updateStaffUserRequest({ uid, ...form });
      await loadUsers();
      return true;
    } catch (err) {
      console.error(err);
      setError(extractErrorMessage(err, "No se pudo actualizar la cuenta."));
      return false;
    }
  };

  const deleteStaff = async (uid) => {
    setError("");
    try {
      await deleteStaffUserRequest(uid);
      await loadUsers();
      return true;
    } catch (err) {
      console.error(err);
      setError(extractErrorMessage(err, "No se pudo eliminar la cuenta."));
      return false;
    }
  };

  const updateCurrentUser = async (form) => {
    if (!user) return false;
    setError("");
    try {
      await updateStaffUserRequest({ uid: user.uid, ...form });
      await refreshProfile();
      await loadUsers();
      return true;
    } catch (err) {
      console.error(err);
      setError(extractErrorMessage(err, "No se pudo actualizar tu cuenta."));
      return false;
    }
  };

  const currentUser = profile
    ? { uid: user?.uid, name: profile.name, email: profile.email, role: profile.role, status: profile.status }
    : user
      ? { uid: user.uid, name: user.email, email: user.email, role: null, status: null }
      : null;

  return {
    users,
    isOwner,
    loading,
    error,
    currentUser,
    createStaff,
    updateStaff,
    deleteStaff,
    updateCurrentUser,
    reload: loadUsers,
  };
};

export default useAdminSession;