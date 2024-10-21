import { fetchBrands } from "@/services/brands";
import React, { useEffect, useState } from "react";

type Option = {
  brand_id: string;
  brand: string;
};

type SelectProps = {
  label: string;
  selectedValue: string;
  setSelectedValue: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
};

const SelectComponent: React.FC<SelectProps> = ({
  label,
  selectedValue,
  setSelectedValue,
  className,
}) => {
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchBrands();
        setOptions(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Error desconocido");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className={className}>
      <label htmlFor={label.toLowerCase()} className="text-gray-700">
        {label}
      </label>
      <select
        id={label.toLowerCase()}
        className="block w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:text-logo-blue2"
        value={selectedValue}
        onChange={(e) => setSelectedValue(e.target.value)}
        disabled={loading || error !== null}
      >
        <option value="">{loading ? "Cargando..." : `Seleccionar ${label}`}</option>
        {error ? (
          <option value="" disabled>{`Error: ${error}`}</option>
        ) : (
          options.map((option) => (
            <option key={option.brand_id} value={option.brand}>
              {option.brand}
            </option>
          ))
        )}
      </select>
    </div>
  );
};

export default SelectComponent;
