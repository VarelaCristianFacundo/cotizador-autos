import { Button } from "@/components/ui/button";
import { fetchLocationsByProvince, fetchProvinces } from "@/services/locations"; // Importar servicios
import { fetchQuote } from "@/services/quote";
import React, { useEffect, useState } from "react";
interface CompanyData {
  cotizacion_id: number;
  cotizaciones: Cotizacion[];
}
interface Province { id: string; nombre: string; }
type ApiResponse = Record<string, CompanyData>;

interface DataModalProps {
  onSuccess: (data: ApiResponse) => void; // Cambiado a ApiResponse
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
  const [dni, setDni] = useState("");
  const [fechaNacimiento, setFechaNacimiento] = useState("");
  const [codigoPostal, setCodigoPostal] = useState("");
  const [provinces, setProvinces] = useState<Province[]>([]);
  const [selectedProvince, setSelectedProvince] = useState("");
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");

  useEffect(() => {
    // Obtener todas las provincias únicas
    const getProvinces = async () => {
      try {
        const data = await fetchProvinces();
        if (data && Array.isArray(data)) {
          // Crear un set de provincias únicas basadas en nombreProvincia
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

    // Obtener localidades por ID de provincia
    const locationsData = await fetchLocationsByProvince(provinceId);
    setLocations(locationsData.location);
  };

  const handleLocationChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const locationId = e.target.value;
    const location = locations.find((loc) => loc.id === parseInt(locationId));

    if (location) {
      setSelectedLocation(locationId);
      setCodigoPostal(location.codigo_postal); // Autocompleta el código postal
    }
  };


  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);

    try {
      const quoteData = {
        id_modelo: modelId,             // ID del modelo seleccionado por el usuario
        anio: ano,                      // Año seleccionado por el usuario
        tipo_vehiculo: "1",             // Tipo de vehículo (hardcodeado en "1")
        tipo_uso: "1",                  // Tipo de uso (hardcodeado en "1")
        es_0_km: "1",                   // 0 Km (hardcodeado en "1")
        location_id: selectedLocation,  // ID de la localidad seleccionada
        location_nombre: locations.find((loc) => loc.id === parseInt(selectedLocation))?.nombre || "",
        is_moto: "0",                   // Hardcodeado como "0"
        provincia: selectedProvince,    // Provincia seleccionada
        codigo_postal: codigoPostal,    // Código postal autocompletado

        // Campos adicionales requeridos
        tipo_doc: "DNI",                // Tipo de documento (hardcodeado como "DNI")
        cliente_dni: dni,               // DNI ingresado por el usuario
        fecha_nacimiento: fechaNacimiento, // Fecha de nacimiento ingresada por el usuario
      };

      const quoteResponse = await fetchQuote(quoteData);
      onSuccess(quoteResponse); // Llama a la función de éxito para mostrar la cotización
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
          <label>DNI:</label>
          <input
            type="text"
            value={dni}
            onChange={(e) => setDni(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <div className="mt-4">
          <label>Fecha de Nacimiento:</label>
          <input
            type="date"
            value={fechaNacimiento}
            onChange={(e) => setFechaNacimiento(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        <div className="mt-4">
          <label>Provincia:</label>
          <select
            value={selectedProvince}
            onChange={handleProvinceChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
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
          <label>Localidad:</label>
          <select
            value={selectedLocation}
            onChange={handleLocationChange}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          >
            <option value="">Selecciona una localidad</option>
            {locations.map((location) => (
              <option key={location.id} value={location.id}>
                {location.nombre}
              </option>
            ))}
          </select>
        </div>

        <div className="mt-4">
          <label>Código Postal:</label>
          <input
            type="text"
            value={codigoPostal}
            readOnly // Agrega readOnly aquí
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
