// utils/fetchWithAuth.ts
import { getToken } from "./auth";

export async function fetchWithAuth(
  url: string,
  options?: RequestInit
): Promise<Response> {
  const token = getToken();
  const headers = new Headers(options?.headers);

  if (token) {
    headers.append("Authorization", `Bearer ${token}`);
  }

  const fetchOptions = {
    ...options,
    headers,
  };

  return fetch(url, fetchOptions);
}
