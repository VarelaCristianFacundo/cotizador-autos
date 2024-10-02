// utils/auth.ts
import Cookies from "js-cookie";

export function saveToken(token: string): void {
  Cookies.set("jwt", token, { expires: 7, secure: true, sameSite: "Strict" });
}

export function getToken(): string | undefined {
  return Cookies.get("jwt");
}
