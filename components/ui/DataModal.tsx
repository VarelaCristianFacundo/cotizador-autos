// DataModal.tsx

import { Button } from "@/components/ui/button";
import { fetchProvinces } from "@/services/locations";
import { fetchQuote } from "@/services/quote";
import { ApiResponse, Localidad } from '@/utils/types';
import React, { useEffect, useState } from "react";
import AutocompleteLocalidadComponent from './AutocompleteLocalidadComponent'; // Asegúrate de importar el nuevo componente

interface Province { id: string; nombre: string; }

interface DataModalProps {
  onSuccess: (data: ApiResponse) => void;
  onClose: () => void;
  ano: string;
  modelId: string;
}

export const DataModal: React.FC<DataModalProps> = ({
  onSuccess,
  onClose,
  ano,
  modelId,
}) => {
  const [loading, setLoading] = useState(false);
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedLocalidad, setSelectedLocalidad] = useState<Localidad | null>(null);

  const dni = "12345678";
  const fechaNacimiento = "1990-01-01";

  // Utility to mask display names based on province values
  const getDisplayName = (name: string, type: "province") => {
    if (type === "province") {
      if (name === "CAPITAL") return "BUENOS AIRES";
      if (name === "BUENOS AIRES") return "CAPITAL FEDERAL";
    }
    return name;
  };

  useEffect(() => {
    const getProvinces = async () => {
      try {
        const data = await fetchProvinces();
        if (data && Array.isArray(data)) {
          const uniqueProvinces = Array.from(
            new Set(data.map((item) => item.nombreProvincia))
          ).map((provincia) => {
            const provinciaItem = data.find(
              (item) => item.nombreProvincia === provincia
            );
            return { id: provinciaItem?.codigoProvincia, nombre: provincia };
          });

          setProvinces(uniqueProvinces);
        } else {
          console.error("La respuesta no contiene provincias válidas");
          setProvinces([]);
        }
      } catch (error) {
        console.error("Error fetching provinces:", error);
        setProvinces([]);
      }
    };
    getProvinces();
  }, []);

  const handleProvinceChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provinceId = e.target.value;
    setSelectedProvince(provinceId);
    setSelectedLocalidad(null); // Resetear la localidad seleccionada
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      if (!selectedLocalidad) {
        alert('Por favor, selecciona una localidad');
        setLoading(false);
        return;
      }

      const quoteData = {
        id_modelo: modelId,
        anio: ano,
        tipo_vehiculo: "1",
        tipo_uso: "1",
        es_0_km: "1",
        location_id: selectedLocalidad.id.toString(),
        location_nombre: selectedLocalidad.nombre,
        is_moto: "0",
        provincia: selectedProvince,
        tipo_doc: "DNI",
        cliente_dni: dni,
        fecha_nacimiento: fechaNacimiento,
        codigo_postal: selectedLocalidad.codigo_postal,
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

        <div>
          <label>Provincia:</label>
          <select
            value={selectedProvince}
            onChange={handleProvinceChange}
            className="w-full p-2 mt-2 border border-gray-300 rounded-lg"
            required
          >
            <option value="">Selecciona una provincia</option>
            {provinces.map((province) => (
              <option key={province.id} value={province.id}>
                {getDisplayName(province.nombre, "province")}
              </option>
            ))}
          </select>
        </div>

        {/* Integrar el componente de autocompletado de Localidad */}
        <AutocompleteLocalidadComponent
          selectedProvince={selectedProvince}
          setSelectedLocalidad={setSelectedLocalidad}
        />

        <Button type="submit" className="w-full mt-4" disabled={loading}>
          {loading ? "Cotizando..." : "Cotizar"}
        </Button>
      </form>
    </div>
  );
};
