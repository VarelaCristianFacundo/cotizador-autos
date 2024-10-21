import { Button } from "@/components/ui/button";
import { fetchQuote } from "@/services/quote";
import React, { useState } from "react";

// const fetchToken = async (): Promise<string> => {
//   try {
//     const response = await fetch("http://127.0.0.1:8000/auth");
//     const token = await response.json();
//     return token;
//   } catch (error) {
//     console.error("Error al obtener el token:", error);
//     throw new Error("No se pudo obtener el token");
//   }
// };

interface DataModalProps {
  onSuccess: (cotizaciones: Cotizacion[]) => void;
  onClose: () => void;
  ano: string;
  modelId: string;
}
type Cotizacion = {
  aseguradora: string;
  precio: number;
  cobertura: string;
};
export const DataModal: React.FC<DataModalProps> = ({
  onSuccess,
  onClose,
  ano,
  modelId,
}) => {
  const [loading, setLoading] = useState(false);
  const [codigoPostal, setCodigoPostal] = useState("");

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const quoteData = {
        id_modelo: modelId,
        anio: ano,
        tipo_vehiculo: "1",
        tipo_uso: "1",
        es_0_km: "1",
        location_id: "3177",
        is_moto: "0",
        provincia: "2",
        codigo_postal: codigoPostal,
      };

      const quoteResponse = await fetchQuote(quoteData);
      onSuccess(quoteResponse);
      setLoading(false);
      onClose();
    } catch (error) {
      console.error("Error al cotizar:", error);
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1 className="text-lg font-semibold">Completa los datos para cotizar</h1>

        <div className="mt-4">
          <label>Código Postal:</label>
          <input
            type="text"
            value={codigoPostal}
            onChange={(e) => setCodigoPostal(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <Button type="submit" className="w-full mt-4" disabled={loading}>
          {loading ? "Cotizando..." : "Cotizar"}
        </Button>
      </form>
    </div>
  );
};
