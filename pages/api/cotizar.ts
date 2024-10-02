// pages/api/cotizar.ts
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    const { marca, ano, modelo, version, token } = req.body;
    // const token = req.cookies.token; // Asumiendo que el token está almacenado en una cookie

    if (!token) {
      return res
        .status(403)
        .json({ message: "No authentication token provided" });
    }

    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };
    console.info({ ano });

    try {
      const apiUrl = `https://cotizador-adminse.com.ar:9443/api/cotizador?infoauto_anio=${ano}
      &infoauto_id=0450246
      &allianz_clausula_ajuste=20
      &allianz_granizo=1
      &allianz_mediopago=T
      &allianz_periodo=S
      &allianz_tiene_alarma=0
      &cia=allianz
      &client_dni=11111111
      &client_tipo_doc=dni
      &codigo_cia=0036
      &codigo_postal=2000
      &es_0km=0
      &fecha_nacimiento=1980-01-01
      &is_moto=0
      &origen=padin
      &provincia=21
      &sexo=MALE
      &suma_asegurada=0
      &tipo_uso=1
      &value=allianz
      &producer_profile_id=12278
      &producer_id=3346`;

      // Realizando la solicitud a la API externa
      const response = await fetch(apiUrl, requestOptions);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(`API call failed with HTTP status ${response.status}`);
      }

      return res.status(200).json(data);
    } catch (error) {
      console.error(error);
      return res.status(500).json({
        message: "Error al procesar la cotización",
        details: error.message,
      });
    }
  } else {
    res.setHeader("Allow", ["POST"]);
    res.status(405).end("Method Not Allowed");
  }
}
