import Cookies from "js-cookie";

export function saveEmailUser(email: string): void {
  Cookies.set("email-user", email, {
    expires: 7,
    secure: false,
    sameSite: "Strict",
  });
}

export function getEmailUser(): string | undefined {
  return Cookies.get("email-user");
}
