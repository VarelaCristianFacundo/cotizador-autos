// pages/api/cotizar.ts
import { buildUrlWithDefaults } from "@/utils/buildURL";
import { propsAllianz, propsRus } from "@/utils/const";
import { AllianzI, MercantilI, RusI } from "@/utils/interfaces.aseguradoras";
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

    console.log("token---<>", token);
    const requestOptions = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    };

    try {
      const allianz: AllianzI = {
        infoauto_anio: ano,
      };

      const mercantil: MercantilI = {
        infoauto_anio: ano,
      };

      const rus: RusI = {
        // infoauto_anio: ano,
      };

      const apiUrl: string =
        "https://cotizador-adminse.com.ar:9443" +
        buildUrlWithDefaults(allianz, propsAllianz);

      console.info("apiUrl --->", apiUrl);

      // Realizando la solicitud a la API externa
      const response = await fetch(apiUrl, requestOptions);
      const data = await response.json();
      console.info("Responso data --->", data);
      console.info("Responso errors --->", data.cotizaciones[0].errors);

      console.info("Responso coberturas --->", data.cotizaciones[0].coberturas);

      console.info(
        "Responso coberturas TIPO C --->",
        data.cotizaciones[0].coberturas[0]
      );

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
