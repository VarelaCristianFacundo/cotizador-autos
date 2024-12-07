// DataModal.tsx

import { Button } from "@/components/ui/button";
import { fetchProvinces } from "@/services/locations";
import { fetchQuote } from "@/services/quote";
import { ApiResponse, Localidad } from '@/utils/types';
import React, { useEffect, useState } from "react";
import AutocompleteLocalidadComponent from './AutocompleteLocalidadComponent';

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

  // Nuevos campos
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");

  const dni = "12345678";
  const fechaNacimiento = "1990-01-01";

  // Función para mostrar el nombre de la provincia (si necesitas mapear nombres)
  const getDisplayName = (name: string, type: "province") => {
    console.log(type);
    // Ajusta esta lógica si es necesario
    return name;
  };

  useEffect(() => {
    const getProvinces = async () => {
      try {
        const data = await fetchProvinces();
        if (data && Array.isArray(data.province)) {
          const mappedProvinces = data.province.map((prov: { id: number, nombre: string }) => ({
            id: prov.id.toString(),
            nombre: prov.nombre
          }));
          setProvinces(mappedProvinces);
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
    setSelectedLocalidad(null);
  };

  // Mensajes de carga en el botón
  const loadingMessages = [
    "Estamos preparando su cotización...",
    "Analizando ofertas de aseguradoras...",
    "Buscando la mejor cobertura...",
    "Calculando precios especiales...",
    "Aguarde un momento, por favor..."
  ];
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (loading) {
      interval = setInterval(() => {
        setLoadingMessageIndex((prevIndex) => (prevIndex + 1) % loadingMessages.length);
      }, 1000);
    } else {
      setLoadingMessageIndex(0);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [loading, loadingMessages.length]);

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
        email: email,
        nombre: nombre,
        telefono: telefono
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

        {/* Campo Nombre y Apellido */}
        <div className="mb-4">
          <label htmlFor="nombre" className="block mb-2">Nombre y Apellido:</label>
          <input
            id="nombre"
            type="text"
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        {/* Campo Email */}
        <div className="mb-4">
          <label htmlFor="email" className="block mb-2">Email:</label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        {/* Campo Teléfono */}
        <div className="mb-4">
          <label htmlFor="telefono" className="block mb-2">Celular:</label>
          <input
            id="telefono"
            type="tel"
            value={telefono}
            onChange={(e) => setTelefono(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>

        {/* Selección de Provincia */}
        <div className="mb-4">
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

        {/* Autocomplete de Localidad */}
        <AutocompleteLocalidadComponent
          selectedProvince={selectedProvince}
          setSelectedLocalidad={setSelectedLocalidad}
        />

        <Button type="submit" className="w-full mt-4" disabled={loading}>
          {loading ? loadingMessages[loadingMessageIndex] : "Cotizar"}
        </Button>
      </form>
    </div>
  );
};
