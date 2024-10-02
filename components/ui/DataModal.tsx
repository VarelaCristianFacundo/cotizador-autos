import { getToken } from "@/utils/auth";
import React, { useState } from "react";

interface DataProps {
  onSuccess?: () => void;
  marca: string;
  ano: string;
  modelo: string;
  version: string;
}

export const DataModal: React.FC<DataProps> = ({
  onSuccess,
  marca,
  ano,
  modelo,
  version,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const token = getToken();

    try {
      const response = await fetch("/api/cotizar", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Asegúrate de enviar también el token de autenticación si es necesario
        },
        body: JSON.stringify({ marca, ano, modelo, version, token }),
      });

      if (!response.ok) {
        throw new Error(`Error: ${response.status}`);
      }

      const data = await response.json();

      console.info({ data });
      setLoading(false);

      // Llama al callback onSuccess si existe y la respuesta es exitosa
      if (onSuccess) {
        onSuccess();
      }

      // Aquí podrías redirigir al usuario o mostrar un mensaje de éxito
      alert("Cotización realizada con éxito");
    } catch (error: any) {
      setError(error.message);
      setLoading(false);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <h1>Cotización de Vehículo</h1>
        <p>Marca: {marca}</p>
        <p>Año: {ano}</p>
        <p>Modelo: {modelo}</p>
        <p>Versión: {version}</p>
        <button type="submit" disabled={loading}>
          {loading ? "Cotizando..." : "Cotizar"}
        </button>
      </form>
      {error && <p style={{ color: "red" }}>Error: {error}</p>}
    </div>
  );
};
