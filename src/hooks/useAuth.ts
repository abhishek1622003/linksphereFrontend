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
  const { data: user, isLoading: userLoading, error } = useQuery({
    queryKey: ["/api/auth/user", firebaseUser?.uid],
    queryFn: async () => {
      if (!firebaseUser) return null;
      console.log("🔍 Fetching user from backend...", firebaseUser.uid);
      const token = await getIdToken(firebaseUser);
      console.log("🔑 Got Firebase token");
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/user`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log("📡 Backend response:", res.status, res.statusText);
      if (!res.ok) {
        const errorText = await res.text();
        console.error("❌ Backend error:", errorText);
        throw new Error(`Backend error: ${res.status} ${errorText}`);
      }
      const userData = await res.json();
      console.log("✅ User data received:", userData);
      return userData;
    },
    enabled: !!firebaseUser,
    retry: false,
  });

  // Log authentication state for debugging
  useEffect(() => {
    console.log("🔐 Auth State:", {
      firebaseUser: !!firebaseUser,
      backendUser: !!user,
      authLoading,
      userLoading,
      error: error?.message
    });
  }, [firebaseUser, user, authLoading, userLoading, error]);

  return {
    user,
    isLoading: authLoading || userLoading,
    isAuthenticated: !!user,
    firebaseUser,
  };
}
