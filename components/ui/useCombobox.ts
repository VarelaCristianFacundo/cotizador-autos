import { KeyboardEvent, useEffect, useState } from "react";

/** Navegación por teclado (↑ ↓ Enter Esc) para listas de sugerencias tipo combobox. */
export function useCombobox<T>(items: T[], onSelect: (item: T) => void, onClose: () => void) {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => setActiveIndex(0), [items]);

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (!items.length) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1) % items.length);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 + items.length) % items.length);
    } else if (e.key === "Enter") {
      e.preventDefault();
      onSelect(items[activeIndex]);
    } else if (e.key === "Escape") {
      onClose();
    }
  };

  return { activeIndex, setActiveIndex, onKeyDown };
}
