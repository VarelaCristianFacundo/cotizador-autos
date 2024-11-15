import { fetchBrands } from "@/services/brands";
import React, { useEffect, useState } from "react";

type Option = {
  brand_id: string | null;
  brand: string;
};

type SelectProps = {
  label: string;
  selectedValue: string;
  setSelectedValue: React.Dispatch<React.SetStateAction<string>>;
  className?: string;
  setError: React.Dispatch<React.SetStateAction<boolean>>;
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

  // Marcas prioritarias
  const prioritizedBrands = [
    "Volkswagen",
    "Renault",
    "Peugeot",
    "Chevrolet",
    "Ford",
    "Fiat",
    "Citroen",
    "Toyota",
    "Honda",
    "Jeep",
    "Nissan",
  ];

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const data: Option[] = await fetchBrands();

        // Eliminar duplicados basados en el nombre de la marca (insensible a mayúsculas)
        const uniqueDataMap = new Map<string, Option>();

        data.forEach((item: Option) => {
          const brandName = item.brand.toUpperCase();
          if (!uniqueDataMap.has(brandName)) {
            uniqueDataMap.set(brandName, item);
          }
        });

        const uniqueData = Array.from(uniqueDataMap.values());

        // Convertir las marcas prioritarias a mayúsculas y almacenarlas
        const prioritizedBrandsUpper = prioritizedBrands.map((brand) =>
          brand.toUpperCase()
        );

        // Crear un mapa de marcas prioritarias a sus índices
        const prioritizedBrandsIndexMap = new Map<string, number>();
        prioritizedBrandsUpper.forEach((brand, index) => {
          prioritizedBrandsIndexMap.set(brand, index);
        });

        // Ordenar las opciones con orden específico para las marcas prioritarias
        const sortedOptions = uniqueData.sort((a, b) => {
          const brandA = a.brand.toUpperCase();
          const brandB = b.brand.toUpperCase();

          const indexA = prioritizedBrandsIndexMap.get(brandA);
          const indexB = prioritizedBrandsIndexMap.get(brandB);

          const isAPrioritized = indexA !== undefined;
          const isBPrioritized = indexB !== undefined;

          if (isAPrioritized && isBPrioritized) {
            return indexA! - indexB!; // Ordenar según el índice en prioritizedBrands
          } else if (isAPrioritized) {
            return -1; // a es prioritaria y b no
          } else if (isBPrioritized) {
            return 1; // b es prioritaria y a no
          } else {
            return brandA.localeCompare(brandB); // Ordenar alfabéticamente
          }
        });

        setOptions(sortedOptions);
        setError(false);
      } catch (err) {
        console.log(err);
        setError(true);
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
        <option value="">
          {loading ? "Cargando..." : `Seleccionar ${label}`}
        </option>
        {options.map((option) => (
          <option key={option.brand_id || option.brand} value={option.brand}>
            {option.brand}
          </option>
        ))}
      </select>
    </div>
  );
};

export default SelectComponent;
