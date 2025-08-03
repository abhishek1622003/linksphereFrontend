import { onAuthStateChanged, User, getIdToken } from "firebase/auth";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { auth } from "../lib/firebase";

export function useAuth() {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      setAuthLoading(false);
    });
    return () => unsub();
  }, []);

  // Backend API call to get/create user profile
  const { data: user, isLoading: userLoading } = useQuery({
    queryKey: ["/api/auth/user", firebaseUser?.uid],
    queryFn: async () => {
      if (!firebaseUser) return null;
      const token = await getIdToken(firebaseUser);
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Unauthorized");
      return await res.json();
    },
    enabled: !!firebaseUser,
    retry: false,
  });

  return {
    user,
    isLoading: authLoading || userLoading,
    isAuthenticated: !!user,
    firebaseUser,
  };
}
