import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "../firebase/config";
import { fetchUserProfile } from "../firebase/users";
import { fetchAllUsers } from "../firebase/staff";
import AdminSessionContext from "./AdminSessionContext";

export const AdminSessionProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (!firebaseUser) {
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }
      const userProfile = await fetchUserProfile(firebaseUser.uid);
      setUser(firebaseUser);
      setProfile(userProfile);
      setLoading(false);
    });
    return unsubscribe;
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

  return <AdminSessionContext.Provider value={value}>{children}</AdminSessionContext.Provider>;
};

export default AdminSessionProvider;