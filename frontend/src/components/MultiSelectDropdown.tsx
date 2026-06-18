import { useState, useRef, useEffect } from 'react';
import { ChevronDown, X } from 'lucide-react';

interface MultiSelectDropdownProps {
  label: string;
  options: string[];
  selectedValues: string[];
  onChange: (values: string[]) => void;
  placeholder?: string;
  hideLabel?: boolean;
}
// TODO: #30 - Adicionar um campo <input type="text"> para busca textual dentro do menu aberto (dropdown-menu)
// TODO: #30 - Filtrar a lista de `options` exibidas com base no valor digitado (ex: options.filter(opt => opt.toLowerCase().includes(searchTerm.toLowerCase())))
// TODO: #30 - Exibir uma mensagem como "Nenhuma tag encontrada" caso o filtro não retorne nenhum resultado
export function MultiSelectDropdown({
  label,
  options,
  selectedValues,
  onChange,
  placeholder = "Select...",
  hideLabel = false
}: MultiSelectDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleToggle = (value: string) => {
    if (selectedValues.includes(value)) {
      onChange(selectedValues.filter(v => v !== value));
    } else {
      onChange([...selectedValues, value]);
    }
  };

  const handleRemove = (value: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(selectedValues.filter(v => v !== value));
  };

  return (
    <div className={`filter-group dropdown-container ${hideLabel ? 'no-label' : ''}`} ref={dropdownRef}>
      {!hideLabel && (
        <label className="filter-label">
          {label}
        </label>
      )}

      <div className="relative-container">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="dropdown-trigger"
        >
          <span>
            {selectedValues.length > 0 ? `${selectedValues.length} selected` : placeholder}
          </span>
          <ChevronDown size={14} className={`arrow-icon ${isOpen ? 'open' : ''}`} />
        </button>

        {isOpen && (
          <div className="dropdown-menu">
            {options.map(option => (
              <label
                key={option}
                className="dropdown-item"
              >
                <input
                  type="checkbox"
                  checked={selectedValues.includes(option)}
                  onChange={() => handleToggle(option)}
                />
                <span>{option}</span>
              </label>
            ))}
          </div>
        )}
      </div>

      {selectedValues.length > 0 && (
        <div className="selected-tags">
          {selectedValues.map(value => (
            <span
              key={value}
              className="selected-tag"
            >
              {value}
              <button
                onClick={(e) => handleRemove(value, e)}
                className="remove-tag-btn"
              >
                <X size={10} />
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
