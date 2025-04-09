// AutocompleteLocalidadComponent.tsx

import { fetchLocationsByProvince } from "@/services/locations";
import { Localidad } from '@/utils/types';
import React, { useEffect, useState } from 'react';

type AutocompleteLocalidadProps = {
    selectedProvince: string;
    setSelectedLocalidad: React.Dispatch<React.SetStateAction<Localidad | null>>;
};

const AutocompleteLocalidadComponent: React.FC<AutocompleteLocalidadProps> = ({
    selectedProvince,
    setSelectedLocalidad,
}) => {
    const [inputValue, setInputValue] = useState('');
    const [suggestions, setSuggestions] = useState<Localidad[]>([]);
    const [loading, setLoading] = useState(false);
    const [allLocations, setAllLocations] = useState<Localidad[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [hasSelected, setHasSelected] = useState(false);

    useEffect(() => {
        if (selectedProvince) {
            const fetchLocations = async () => {
                setLoading(true);
                try {
                    const locationsData = await fetchLocationsByProvince(selectedProvince);
                    // Asumiendo que locationsData ya es un array:
                    setAllLocations(locationsData);
                    setError(null);
                } catch (err) {
                    setError(
                        err instanceof Error ? err.message : 'Error al obtener localidades'
                    );
                } finally {
                    setLoading(false);
                }
            };

            fetchLocations();
        } else {
            setAllLocations([]);
            setInputValue('');
        }
    }, [selectedProvince]);


    useEffect(() => {
        if (inputValue.length >= 3 && !hasSelected && allLocations.length > 0) {
            const filteredSuggestions = allLocations.filter((loc) => {
                const searchTerm = inputValue.toLowerCase();
                return (
                    loc.nombre.toLowerCase().includes(searchTerm) ||
                    loc.codigo_postal.toString().includes(searchTerm)
                );
            });
            setSuggestions(filteredSuggestions);
        } else {
            setSuggestions([]);
        }
    }, [inputValue, allLocations, hasSelected]);

    const handleSelectSuggestion = (suggestion: Localidad) => {
        setSelectedLocalidad(suggestion);
        setInputValue(suggestion.nombre);
        setHasSelected(true);
        setSuggestions([]);
    };

    return (
        <div className="relative mt-4">
            <label htmlFor="localidad" className="text-gray-700">
                Localidad (con Código Postal):
            </label>
            <input
                id="localidad"
                className="block w-full p-2 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:text-logo-blue2"
                value={inputValue}
                onChange={(e) => {
                    setInputValue(e.target.value);
                    setHasSelected(false);
                    setSelectedLocalidad(null); // Resetear la localidad seleccionada
                }}
                placeholder="Escribe la localidad o código postal"
                disabled={allLocations.length === 0}
                required
            />

            {loading && <p>Cargando localidades...</p>}
            {error && <p style={{ color: 'red' }}>Error: {error}</p>}
            {!loading && suggestions.length > 0 && (
                <ul className="absolute z-10 bg-white border border-gray-300 w-full rounded-lg shadow-md mt-1 max-h-60 overflow-auto">
                    {suggestions.map((suggestion) => (
                        <li
                            key={suggestion.id}
                            className="p-2 cursor-pointer hover:bg-gray-200"
                            onClick={() => handleSelectSuggestion(suggestion)}
                        >
                            {suggestion.nombre} - CP: {suggestion.codigo_postal}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AutocompleteLocalidadComponent;
