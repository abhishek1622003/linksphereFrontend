import { QueryClient, QueryFunction } from "@tanstack/react-query";
import { auth } from "./firebase";
import { getIdToken } from "firebase/auth";

async function throwIfResNotOk(res: Response) {
  if (!res.ok) {
    const text = (await res.text()) || res.statusText;
    throw new Error(`${res.status}: ${text}`);
  }
}

export async function apiRequest(
  method: string,
  endpoint: string,
  data?: unknown
): Promise<Response> {
  let token = "";
  if (auth.currentUser) {
    console.log("🔑 Getting Firebase token for user:", auth.currentUser.uid);
    token = await getIdToken(auth.currentUser);
    console.log("✅ Got Firebase token:", token ? "present" : "missing");
  } else {
    console.log("❌ No authenticated user found");
  }
  
  const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
  const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`;
  
  const headers: Record<string, string> = {};
  if (data) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;

  console.log(`🔗 API Request: ${method} ${url}`);
  console.log("📋 Headers:", headers);
  if (data) console.log("📦 Data:", data);

  const res = await fetch(url, {
    method,
    headers,
    body: data ? JSON.stringify(data) : undefined,
    credentials: "include",
  });

  console.log(`📈 Response: ${res.status} ${res.statusText}`);
  await throwIfResNotOk(res);
  return res;
}

type UnauthorizedBehavior = "returnNull" | "throw";
export const getQueryFn: <T>(options: {
  on401: UnauthorizedBehavior;
}) => QueryFunction<T> =
  ({ on401: unauthorizedBehavior }) =>
  async ({ queryKey }) => {
    const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
    const endpoint = queryKey.join("/");
    const url = endpoint.startsWith('http') ? endpoint : `${baseUrl}${endpoint}`;
    
    console.log(`🔗 Query: ${url}`);
    
    const res = await fetch(url, {
      credentials: "include",
    });

    if (unauthorizedBehavior === "returnNull" && res.status === 401) {
      return null;
    }

    await throwIfResNotOk(res);
    return await res.json();
  };

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      queryFn: getQueryFn({ on401: "throw" }),
      refetchInterval: false,
      refetchOnWindowFocus: false,
      staleTime: Infinity,
      retry: false,
    },
    mutations: {
      retry: false,
    },
  },
});
