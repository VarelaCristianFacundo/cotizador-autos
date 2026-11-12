// AutocompleteLocalidadComponent.tsx

import { fetchLocationsByProvince } from "@/services/locations";
import { Localidad } from '@/utils/types';
import React, { useEffect, useMemo, useState } from 'react';
import { useCombobox } from "./useCombobox";

type AutocompleteLocalidadProps = {
    selectedProvince: string;
    setSelectedLocalidad: React.Dispatch<React.SetStateAction<Localidad | null>>;
};

const normalizar = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

const AutocompleteLocalidadComponent: React.FC<AutocompleteLocalidadProps> = ({
    selectedProvince,
    setSelectedLocalidad,
}) => {
    const [inputValue, setInputValue] = useState('');
    const [loading, setLoading] = useState(false);
    const [allLocations, setAllLocations] = useState<Localidad[]>([]);
    const [error, setError] = useState<string | null>(null);
    const [hasSelected, setHasSelected] = useState(false);
    const [open, setOpen] = useState(false);

    useEffect(() => {
        setInputValue('');
        setHasSelected(false);
        if (!selectedProvince) {
            setAllLocations([]);
            return;
        }
        let cancelled = false;
        setLoading(true);
        fetchLocationsByProvince(selectedProvince)
            .then((data) => {
                if (!cancelled) {
                    setAllLocations(data);
                    setError(null);
                }
            })
            .catch((err) => !cancelled && setError(err instanceof Error ? err.message : 'Error al obtener localidades'))
            .finally(() => !cancelled && setLoading(false));
        return () => {
            cancelled = true;
        };
    }, [selectedProvince]);

    const suggestions = useMemo(() => {
        if (inputValue.length < 3 || hasSelected) return [];
        const term = normalizar(inputValue);
        return allLocations
            .filter((loc) => normalizar(loc.nombre).includes(term) || String(loc.codigo_postal).includes(term))
            .slice(0, 50);
    }, [inputValue, hasSelected, allLocations]);

    const handleSelectSuggestion = (suggestion: Localidad) => {
        setSelectedLocalidad(suggestion);
        setInputValue(suggestion.nombre);
        setHasSelected(true);
        setOpen(false);
    };

    const { activeIndex, setActiveIndex, onKeyDown } = useCombobox(suggestions, handleSelectSuggestion, () => setOpen(false));
    const showList = open && suggestions.length > 0;

    return (
        <div className="relative">
            <label htmlFor="localidad" className="field-label">Localidad</label>
            <input
                id="localidad"
                className="field"
                autoComplete="off"
                role="combobox"
                aria-expanded={showList}
                aria-controls="localidad-listbox"
                aria-autocomplete="list"
                aria-activedescendant={showList ? `localidad-opt-${activeIndex}` : undefined}
                value={inputValue}
                onChange={(e) => {
                    setInputValue(e.target.value);
                    setHasSelected(false);
                    setSelectedLocalidad(null);
                    setOpen(true);
                }}
                onKeyDown={onKeyDown}
                onFocus={() => setOpen(true)}
                onBlur={() => setOpen(false)}
                placeholder={allLocations.length ? "Escribí al menos 3 letras" : "Primero elegí la provincia"}
                disabled={allLocations.length === 0}
                required
            />

            <div role="status" aria-live="polite">
                {loading && <p className="mt-2 text-xs text-ink/60">Cargando localidades…</p>}
                {error && <p className="mt-2 text-xs text-red-700">Error: {error}</p>}
                {open && !hasSelected && inputValue.length >= 3 && suggestions.length === 0 && !loading && (
                    <p className="mt-2 text-xs text-ink/65">No encontramos esa localidad en la provincia elegida.</p>
                )}
            </div>
            {showList && (
                <ul id="localidad-listbox" role="listbox" className="suggestions">
                    {suggestions.map((suggestion, i) => (
                        <li
                            key={suggestion.id}
                            id={`localidad-opt-${i}`}
                            role="option"
                            aria-selected={i === activeIndex}
                            className={i === activeIndex ? "bg-brand-50 text-ink" : ""}
                            onMouseEnter={() => setActiveIndex(i)}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                handleSelectSuggestion(suggestion);
                            }}
                        >
                            {suggestion.nombre}
                            {suggestion.codigo_postal && <span className="ml-2 text-xs text-ink/60">CP {suggestion.codigo_postal}</span>}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AutocompleteLocalidadComponent;
