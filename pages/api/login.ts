// pages/api/login.ts
import { PASSWORD_KEY, USER_KEY } from "@/lib/constants/keys";
import { API_LOGIN } from "@/lib/constants/urls";
import type { NextApiRequest, NextApiResponse } from "next";

interface LoginResponse {
  token?: string;
  message?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<LoginResponse>
) {
  if (req.method === "POST") {
    try {
      const { emailUser } = req.body as {
        emailUser: string;
      };

      console.log("usuario--->", emailUser);

      const response = await fetch(API_LOGIN, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: USER_KEY, password: PASSWORD_KEY }),
      });

      const data = await response.json();

      console.log(data);
      if (response.ok) {
        return res.status(200).json({ token: data.access_token });
      } else {
        return res.status(response.status).json({ message: data.message });
      }
    } catch (error) {
      return res.status(500).json({
        message: "Error al conectar con el servicio de autenticación",
      });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    return res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
