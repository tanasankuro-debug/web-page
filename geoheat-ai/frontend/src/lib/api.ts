import { createClient } from "@/lib/supabase/client";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api/v1";

async function authHeader() {
  const supabase = createClient();
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) throw new Error("Not signed in");
  return { Authorization: `Bearer ${session.access_token}` };
}

export async function apiGet<T>(path: string): Promise<T> {
  const headers = await authHeader();
  const res = await fetch(`${API_BASE}${path}`, { headers });
  const body = await res.json();
  if (!res.ok || !body.success) throw new Error(body.message ?? `Request failed: ${path}`);
  return body.data as T;
}

export async function apiPost<T>(path: string, payload: unknown): Promise<T> {
  const headers = await authHeader();
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const body = await res.json();
  if (!res.ok || !body.success) throw new Error(body.message ?? `Request failed: ${path}`);
  return body.data as T;
}

export async function apiUpload<T>(path: string, formData: FormData): Promise<T> {
  const headers = await authHeader();
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers,
    body: formData,
  });
  const body = await res.json();
  if (!res.ok || !body.success) throw new Error(body.message ?? `Request failed: ${path}`);
  return body.data as T;
}
