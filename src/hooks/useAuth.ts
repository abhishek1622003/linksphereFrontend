import { useQuery } from "@tanstack/react-query";
import { getIdToken, onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../lib/firebase";

export function useAuth() {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => setFirebaseUser(user));
    return () => unsub();
  }, []);

  const { data: user, isLoading } = useQuery({
    queryKey: ["/api/auth/user", firebaseUser?.uid],
    queryFn: async () => {
      if (!firebaseUser) return null;
      const token = await getIdToken(firebaseUser);
      const res = await fetch("/api/auth/user", {
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
    isLoading,
    isAuthenticated: !!user,
    firebaseUser,
  };
}
