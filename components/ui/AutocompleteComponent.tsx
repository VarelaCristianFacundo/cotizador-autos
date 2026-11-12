import { fetchModelsByBrandAndYear } from "@/services/cars";
import React, { useEffect, useState } from "react";
import { useCombobox } from "./useCombobox";

type CarModel = {
    id: number | string;
    model: string;
    year: string;
    brand: string;
};

type AutocompleteProps = {
    anio: string;
    marca: string;
    selectedModelo: string;
    setSelectedModelo: (value: string) => void;
    setSelectedModeloId: (value: string) => void;
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
    const [searched, setSearched] = useState(false);
    const [open, setOpen] = useState(false);
    const enabled = Boolean(marca && anio);

    // Si cambia la marca o el año, el modelo elegido deja de ser válido
    useEffect(() => {
        setInputValue("");
        setHasSelected(false);
        setSuggestions([]);
    }, [marca, anio]);

    useEffect(() => {
        if (inputValue.length < 3 || hasSelected || !enabled) {
            setSuggestions([]);
            setSearched(false);
            return;
        }
        let cancelled = false;
        const t = setTimeout(async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await fetchModelsByBrandAndYear({
                    anio: anio === "0KM" ? 0 : parseInt(anio, 10),
                    marca,
                    modelo: inputValue,
                });
                if (!cancelled) {
                    setSuggestions(response.car ?? []);
                    setSearched(true);
                    setOpen(true);
                }
            } catch (err) {
                if (!cancelled) setError(err instanceof Error ? err.message : "Error al obtener los modelos");
            } finally {
                if (!cancelled) setLoading(false);
            }
        }, 250);
        return () => {
            cancelled = true;
            clearTimeout(t);
        };
    }, [inputValue, anio, marca, hasSelected, enabled]);

    const handleSelectSuggestion = (suggestion: CarModel) => {
        setSelectedModelo(suggestion.model);
        setSelectedModeloId(suggestion.id.toString());
        setInputValue(suggestion.model);
        setHasSelected(true);
        setSuggestions([]);
        setOpen(false);
    };

    const { activeIndex, setActiveIndex, onKeyDown } = useCombobox(suggestions, handleSelectSuggestion, () => setOpen(false));
    const showList = open && !loading && suggestions.length > 0;

    return (
        <div className="relative">
            <label htmlFor="modelo" className="field-label">Modelo y versión</label>
            <input
                id="modelo"
                className="field"
                autoComplete="off"
                role="combobox"
                aria-expanded={showList}
                aria-controls="modelo-listbox"
                aria-autocomplete="list"
                aria-activedescendant={showList ? `modelo-opt-${activeIndex}` : undefined}
                disabled={!enabled}
                value={inputValue}
                onChange={(e) => {
                    setInputValue(e.target.value);
                    setHasSelected(false);
                    setSelectedModelo("");
                    setSelectedModeloId("");
                }}
                onKeyDown={onKeyDown}
                onFocus={(e) => {
                    setOpen(true);
                    if (window.innerWidth < 640) e.currentTarget.scrollIntoView({ block: "center", behavior: "smooth" });
                }}
                onBlur={() => setOpen(false)}
                placeholder={enabled ? "Ej: Gol Trend, Cronos, Hilux…" : "Primero elegí marca y año"}
            />

            <div role="status" aria-live="polite">
                {loading && <p className="mt-2 text-xs text-ink/60">Buscando versiones…</p>}
                {error && <p className="mt-2 text-xs text-red-700">Error: {error}</p>}
                {!loading && searched && open && !hasSelected && suggestions.length === 0 && (
                    <p className="mt-2 text-xs text-ink/65">No encontramos ese modelo para el año elegido. Probá con otro nombre.</p>
                )}
            </div>
            {showList && (
                <ul id="modelo-listbox" role="listbox" className="suggestions">
                    {suggestions.map((suggestion, i) => (
                        <li
                            key={suggestion.id}
                            id={`modelo-opt-${i}`}
                            role="option"
                            aria-selected={i === activeIndex}
                            className={i === activeIndex ? "bg-brand-50 text-ink" : ""}
                            onMouseEnter={() => setActiveIndex(i)}
                            onMouseDown={(e) => {
                                e.preventDefault();
                                handleSelectSuggestion(suggestion);
                            }}
                        >
                            <span className="font-medium text-ink">{suggestion.model}</span>
                            {suggestion.year && <span className="ml-2 text-xs text-ink/60">{suggestion.year === "0KM" ? "0 km" : suggestion.year}</span>}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default AutocompleteComponent;
