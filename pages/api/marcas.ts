// pages/api/marcas.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    res.status(200).json([
      { id: 1, nombre: "Ford" },
      { id: 2, nombre: "Chevrolet" },
      { id: 2, nombre: "Toyota" },
      { id: 2, nombre: "Volkswagen" },
      { id: 2, nombre: "Renault" },
    ]);
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
