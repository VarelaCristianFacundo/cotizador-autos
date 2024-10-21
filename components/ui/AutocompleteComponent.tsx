import { fetchModelsByBrandAndYear } from "@/services/cars"; // Servicio para obtener modelos
import React, { useEffect, useState } from "react";

type CarModel = {
    id: number;
    model: string;
    year: string;
    brand: string;
};

type AutocompleteProps = {
    anio: string;
    marca: string;
    selectedModelo: string;
    setSelectedModelo: React.Dispatch<React.SetStateAction<string>>;
    setSelectedModeloId: React.Dispatch<React.SetStateAction<string>>;
};

const AutocompleteComponent: React.FC<AutocompleteProps> = ({
    anio,
    marca,
    setSelectedModelo,
    setSelectedModeloId,
}) => {
    const [inputValue, setInputValue] = useState("");
    const [suggestions, setSuggestions] = useState<CarModel[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [hasSelected, setHasSelected] = useState(false);

    useEffect(() => {
        const fetchModels = async () => {
            if (inputValue.length >= 3 && !hasSelected) {
                setLoading(true);
                setError(null);

                try {
                    const response = await fetchModelsByBrandAndYear({
                        anio: parseInt(anio, 10),
                        marca,
                        modelo: inputValue,
                    });
                    setSuggestions(response.car);
                } catch (err) {
                    setError(err instanceof Error ? err.message : "Error al obtener los modelos");
                } finally {
                    setLoading(false);
                }
            } else {
                setSuggestions([]);  // Limpiar sugerencias si hay menos de 3 letras o si ya se seleccionó
            }
        };

        fetchModels();
    }, [inputValue, anio, marca, hasSelected]);

    const handleSelectSuggestion = (suggestion: CarModel) => {
        setSelectedModelo(suggestion.model);  // Asigna el nombre del modelo seleccionado
        setSelectedModeloId(suggestion.id.toString());  // Asigna el ID del modelo seleccionado
        setInputValue(suggestion.model);  // Muestra la selección en el input
        setHasSelected(true);  // Marca como que se ha seleccionado una opción
        setSuggestions([]);  // Limpia las sugerencias
    };

    return (
        <div className="relative">
            <label htmlFor="modelo" className="text-gray-700">Modelo</label>
            <input
                id="modelo"
                className="block w-full p-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:text-logo-blue2"
                value={inputValue}
                onChange={(e) => {
                    setInputValue(e.target.value);
                    setHasSelected(false);  // Permitir nuevas búsquedas si el usuario vuelve a escribir
                }}
                placeholder="Escribe el modelo"
            />

            {/* Mostrar sugerencias como un dropdown */}
            {loading && <p>Cargando modelos...</p>}
            {error && <p style={{ color: "red" }}>Error: {error}</p>}
            {!loading && suggestions.length > 0 && (
                <ul className="absolute z-10 bg-white border border-gray-300 w-full rounded-lg shadow-md mt-1 max-h-60 overflow-auto">
                    {suggestions.map((suggestion) => (
                        <li
                            key={suggestion.id}
                            className="p-2 cursor-pointer hover:bg-gray-200"
                            onClick={() => handleSelectSuggestion(suggestion)}  // Selecciona el modelo y su ID
                        >
                            {suggestion.model} - {suggestion.year} {/* Muestra modelo y año */}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AutocompleteComponent;
