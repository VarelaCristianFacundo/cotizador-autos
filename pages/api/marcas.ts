// pages/api/marcas.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "GET") {
    res.status(200).json([
      { brand_id: 1, brand: "Ford" },
      { brand_id: 2, brand: "Chevrolet" },
      { brand_id: 3, brand: "Toyota" },
      { brand_id: 4, brand: "Volkswagen" },
      { brand_id: 5, brand: "Renault" },
    ]);
  } else {
    res.setHeader("Allow", ["GET"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
