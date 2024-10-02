import React, { useEffect, useState } from "react";

type Option = {
  id: number;
  nombre: string;
};

type SelectProps = {
  label: string;
  selectedValue: string;
  setSelectedValue: React.Dispatch<React.SetStateAction<string>>;
  endpoint: string;
  className?: string;
};

const SelectComponent: React.FC<SelectProps> = ({
  label,
  selectedValue,
  setSelectedValue,
  endpoint,
  className,
}) => {
  const [options, setOptions] = useState<Option[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        console.info("useEffect");
        const response = await fetch(endpoint);
        const data = await response.json();
        console.log({ data });
        setOptions(data);
      } catch (error) {
        console.error("Failed to fetch data:", error);
      }
    };
    fetchData();
  }, [endpoint]);

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
      >
        <option value="">Seleccionar {label}</option>
        {options.map((option) => (
          <option key={option.id} value={option.nombre}>
            {option.nombre}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectComponent;
