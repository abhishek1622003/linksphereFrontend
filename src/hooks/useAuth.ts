import { onAuthStateChanged, User } from "firebase/auth";
import { useEffect, useState } from "react";
import { auth } from "../lib/firebase";

export function useAuth() {
  const [firebaseUser, setFirebaseUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (user) => {
      setFirebaseUser(user);
      setIsLoading(false);
    });
    return () => unsub();
  }, []);

  // Temporarily disable backend API calls - use Firebase user data directly
  const user = firebaseUser ? {
    id: firebaseUser.uid,
    email: firebaseUser.email || "",
    name: firebaseUser.displayName || "User",
    profileImageUrl: firebaseUser.photoURL || "",
    bio: "",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  } : null;

  /* 
  // TODO: Enable this when backend is deployed
  const { data: user, isLoading } = useQuery({
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
  */

  return {
    user,
    isLoading,
    isAuthenticated: !!user,
    firebaseUser,
  };
}
