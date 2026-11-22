import { authClient } from "@/lib/auth-client";
import { API_URL } from "@/lib/api";

export async function apiRequest(path, { method = "GET", body, signal } = {}) {
  const { data: tokenData, error: tokenError } = await authClient.token();

  if (tokenError || !tokenData?.token) {
    const error = new Error("Your session has expired. Please sign in again.");
    error.status = 401;
    throw error;
  }

  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      method,
      headers: {
        Authorization: `Bearer ${tokenData.token}`,
        ...(body ? { "Content-Type": "application/json" } : {}),
      },
      body: body ? JSON.stringify(body) : undefined,
      signal,
    });
  } catch (err) {
    if (err.name === "AbortError") throw err;
    const error = new Error("Could not reach the server. Please try again.");
    error.status = 0;
    throw error;
  }

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    const error = new Error(data.message || "Request failed");
    error.status = res.status;
    throw error;
  }

  return data;
}