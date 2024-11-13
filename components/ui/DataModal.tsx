import { Button } from "@/components/ui/button";
import { fetchLocationsByProvince, fetchProvinces } from "@/services/locations";
import { fetchQuote } from "@/services/quote";
import { ApiResponse, Localidad } from '@/utils/types';
import React, { useEffect, useState } from "react";

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
  const [locations, setLocations] = useState<Localidad[]>([]); // Array que controla el estado del select de localidad
  const [selectedLocation, setSelectedLocation] = useState("");
  const [codigoPostal, setCodigoPostal] = useState(""); // Solo mantiene el código postal asociado a la localidad seleccionada

  // Constantes de datos fijos
  const dni = "12345678";
  const fechaNacimiento = "1990-01-01";

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

  const handleProvinceChange = async (e: React.ChangeEvent<HTMLSelectElement>) => {
    const provinceId = e.target.value;
    setSelectedProvince(provinceId);

    // Deshabilita el select de localidad mientras se realiza la solicitud de datos
    setLocations([]);

    const locationsData = await fetchLocationsByProvince(provinceId);
    setLocations(locationsData.location); // Habilita el select de localidad cuando locations tiene datos
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const locationId = e.target.value;
    const location = locations.find((loc) => loc.id === parseInt(locationId));

    if (location) {
      setSelectedLocation(locationId);
      setCodigoPostal(location.codigo_postal); // Guardar el código postal de la localidad seleccionada
    }
  };

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
        location_id: selectedLocation,
        location_nombre: locations.find((loc) => loc.id === parseInt(selectedLocation))?.nombre || "",
        is_moto: "0",
        provincia: selectedProvince,

        // Campos adicionales requeridos en el backend
        tipo_doc: "DNI",
        cliente_dni: dni,
        fecha_nacimiento: fechaNacimiento,
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
                {province.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4">
          <label>Localidad (con Código Postal):</label>
          <select
            value={selectedLocation}
            onChange={handleLocationChange}
            className="w-full p-2 mt-2 border border-gray-300 rounded-lg"
            required
            disabled={locations.length === 0} // Habilita el select solo cuando locations tiene datos
          >
            <option value="">Selecciona una localidad</option>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.nombre} - CP: {location.codigo_postal}
              </option>
            ))}
          </select>
        </div>

        <Button type="submit" className="w-full mt-4" disabled={loading}>
          {loading ? "Cotizando..." : "Cotizar"}
        </Button>
      </form>
    </div>
  );
};
