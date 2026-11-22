// শেষের "/" বা বাড়তি স্পেস থাকলেও কেটে দেয়
export const API_URL = (process.env.NEXT_PUBLIC_API_URL || "")
  .trim()
  .replace(/\/+$/, "");

export async function apiGet(path, { token, signal } = {}) {
  let res;
  try {
    res = await fetch(`${API_URL}${path}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
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