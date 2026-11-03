import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";
import { fetchUserProfile } from "../firebase/users";
import { fetchAllUsers } from "../firebase/staff";
import AdminSessionContext from "./AdminSessionContext";
import { reportRuntimeError } from "../runtime/errors.js";

export const AdminSessionProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let active = true;
    let generation = 0;
    let unsubscribe;
    const fail = (error) => {
      reportRuntimeError("admin.session", error);
      if (!active) return;
      setUser(null);
      setProfile(null);
      setFailed(true);
      setLoading(false);
    };
    try {
      unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
        const request = ++generation;
        try {
          const userProfile = firebaseUser ? await fetchUserProfile(firebaseUser.uid) : null;
          if (!active || request !== generation) return;
          setUser(firebaseUser);
          setProfile(userProfile);
          setFailed(false);
          setLoading(false);
        } catch (error) {
          if (request === generation) fail(error);
        }
      }, fail);
    } catch (error) { fail(error); }
    return () => { active = false; unsubscribe?.(); };
  }, []);

  const refreshProfile = async () => {
    if (!user) return;
    const userProfile = await fetchUserProfile(user.uid);
    setProfile(userProfile);
  };

  const value = {
    loading,
    user,
    profile,
    isOwner: profile?.role === "owner",
    refreshProfile,
    fetchAllUsers,
  };

  if (failed) return <p role="alert">No pudimos verificar la sesión administrativa. Recargá la página para volver a intentarlo.</p>;
  return <AdminSessionContext.Provider value={value}>{children}</AdminSessionContext.Provider>;
};

export default AdminSessionProvider;
