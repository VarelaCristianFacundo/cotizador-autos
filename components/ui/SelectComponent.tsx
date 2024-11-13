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
  setError: React.Dispatch<React.SetStateAction<boolean>>; // Nueva prop para manejar el error
};

const SelectComponent: React.FC<SelectProps> = ({
  label,
  selectedValue,
  setSelectedValue,
  className,
  setError,
}) => {
  const [options, setOptions] = useState<Option[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data = await fetchBrands();
        setOptions(data);
        setError(false);
      } catch (err) {
        console.log(err)
        setError(true); // Maneja el error en el estado del componente padre
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [setError]);

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
        disabled={loading || options.length === 0}
      >
        <option value="">{loading ? "Cargando..." : `Seleccionar ${label}`}</option>
        {options.map((option) => (
          <option key={option.brand_id} value={option.brand}>
            {option.brand}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectComponent;
