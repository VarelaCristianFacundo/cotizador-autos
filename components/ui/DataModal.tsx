// DataModal.tsx

import { fetchProvinces } from "@/services/locations";
import { fetchQuote } from "@/services/quote";
import { ApiResponse, Localidad } from '@/utils/types';
import { Loader2, Lock } from "lucide-react";
import React, { useEffect, useState } from "react";
import AutocompleteLocalidadComponent from './AutocompleteLocalidadComponent';

interface Province { id: string; nombre: string; }

interface DataModalProps {
  onSuccess: (data: ApiResponse) => void;
  onClose: () => void;
  ano: string;
  modelId: string;
}

const loadingMessages = [
  "Preparando tu cotización…",
  "Consultando aseguradoras…",
  "Comparando coberturas…",
  "Buscando el mejor precio…",
];

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
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [telefono, setTelefono] = useState("");
  const [formError, setFormError] = useState<string | null>(null);
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  const dni = "12345678";
  const fechaNacimiento = "1990-01-01";

  useEffect(() => {
    const getProvinces = async () => {
      try {
        const data = await fetchProvinces();
        if (data && Array.isArray(data.province)) {
          setProvinces(data.province.map((prov: { id: number | string, nombre: string }) => ({
            id: prov.id.toString(),
            nombre: prov.nombre
          })));
        } else {
          setProvinces([]);
        }
      } catch (error) {
        console.error("Error fetching provinces:", error);
        setProvinces([]);
      }
    };
    getProvinces();
  }, []);

  useEffect(() => {
    if (!loading) {
      setLoadingMessageIndex(0);
      return;
    }
    const interval = setInterval(() => {
      setLoadingMessageIndex((i) => (i + 1) % loadingMessages.length);
    }, 900);
    return () => clearInterval(interval);
  }, [loading]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!selectedLocalidad) {
      setFormError("Elegí una localidad de la lista.");
      return;
    }
    setFormError(null);
    setLoading(true);

    try {
      const quoteData = {
        id_modelo: modelId,
        anio: ano,
        tipo_vehiculo: "1",
        tipo_uso: "1",
        es_0_km: ano === "0KM" ? "1" : "0",
        location_id: selectedLocalidad.id.toString(),
        location_nombre: selectedLocalidad.nombre,
        is_moto: "0",
        provincia: selectedProvince,
        tipo_doc: "DNI",
        cliente_dni: dni,
        fecha_nacimiento: fechaNacimiento,
        codigo_postal: selectedLocalidad.codigo_postal,
        email,
        nombre,
        telefono,
      };

      const quoteResponse = await fetchQuote(quoteData);
      onSuccess(quoteResponse);
      onClose();
    } catch (error) {
      console.error("Error al cotizar:", error);
      setFormError("No pudimos generar la cotización. Probá de nuevo en unos segundos.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="nombre" className="field-label">Nombre y apellido</label>
        <input id="nombre" type="text" autoComplete="name" value={nombre}
          onChange={(e) => setNombre(e.target.value)} className="field" placeholder="Juan Pérez" required />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="email" className="field-label">Email</label>
          <input id="email" type="email" autoComplete="email" value={email}
            onChange={(e) => setEmail(e.target.value)} className="field" placeholder="tu@email.com" required />
        </div>
        <div>
          <label htmlFor="telefono" className="field-label">Celular</label>
          <input id="telefono" type="tel" autoComplete="tel" inputMode="tel" value={telefono}
            onChange={(e) => setTelefono(e.target.value)} className="field" placeholder="11 2345 6789" required />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label htmlFor="provincia" className="field-label">Provincia</label>
          <select id="provincia" value={selectedProvince}
            onChange={(e) => { setSelectedProvince(e.target.value); setSelectedLocalidad(null); }}
            className="field" required>
            <option value="">Elegí la provincia</option>
            {provinces.map((province) => (
              <option key={province.id} value={province.id}>{province.nombre}</option>
            ))}
          </select>
        </div>
        <AutocompleteLocalidadComponent
          selectedProvince={selectedProvince}
          setSelectedLocalidad={setSelectedLocalidad}
        />
      </div>

      {formError && (
        <p role="alert" className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">{formError}</p>
      )}

      <button type="submit" className="btn-primary w-full" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            <span aria-live="polite">{loadingMessages[loadingMessageIndex]}</span>
          </>
        ) : (
          "Ver precios"
        )}
      </button>

      <p className="flex items-center justify-center gap-1.5 text-xs text-ink/60">
        <Lock className="h-3.5 w-3.5" />
        Tus datos son confidenciales y solo los usamos para asesorarte.
      </p>
    </form>
  );
};
