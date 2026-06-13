import { useState } from 'react';
//Componente alternativo para MinMaxFilter no lugar do DualRange, usando apenas um range slider para cada filtro, com a opção de desabilitar o min ou max para representar "sem limite".
interface MinMaxFilterProps {
  label: string;
  min: number;
  max: number;
  step?: number;
  defaultMinValue?: number;
  defaultMaxValue?: number;
  defaultMinDisabled?: boolean;
  defaultMaxDisabled?: boolean;
  onMinChange?: (value: number | null) => void;
  onMaxChange?: (value: number | null) => void;
}

export function MinMaxFilter({
  label,
  min,
  max,
  step = 1,
  defaultMinValue,
  defaultMaxValue,
  defaultMinDisabled = false,
  defaultMaxDisabled = false,
  onMinChange,
  onMaxChange
}: MinMaxFilterProps) {
  const [minValue, setMinValue] = useState(defaultMinValue ?? min);
  const [maxValue, setMaxValue] = useState(defaultMaxValue ?? max);
  const [minDisabled, setMinDisabled] = useState(defaultMinDisabled);
  const [maxDisabled, setMaxDisabled] = useState(defaultMaxDisabled);

  const handleMinChange = (value: number) => {
    setMinValue(value);
    if (!minDisabled) {
      onMinChange?.(value);
    }
  };

  const handleMaxChange = (value: number) => {
    setMaxValue(value);
    if (!maxDisabled) {
      onMaxChange?.(value);
    }
  };

  const handleMinDisabledToggle = () => {
    const newDisabled = !minDisabled;
    setMinDisabled(newDisabled);
    onMinChange?.(newDisabled ? null : minValue);
  };

  const handleMaxDisabledToggle = () => {
    const newDisabled = !maxDisabled;
    setMaxDisabled(newDisabled);
    onMaxChange?.(newDisabled ? null : maxValue);
  };

  return (
    <div className="filter-group">
      <label className="filter-label">{label}</label>

      {/* Min Filter */}
      <div className="range-item">
        <label>min</label>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={minValue}
          onChange={(e) => handleMinChange(Number(e.target.value))}
          disabled={minDisabled}
          className={`thumb ${minDisabled ? 'disabled' : ''}`}
        />
        <span className="range-value">
          {minDisabled ? '∞' : minValue}
        </span>
      </div>

      {/* Max Filter */}
      <div className="range-item">
        <label>max</label>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={maxValue}
          onChange={(e) => handleMaxChange(Number(e.target.value))}
          disabled={maxDisabled}
          className={`thumb ${maxDisabled ? 'disabled' : ''}`}
        />
        <span className="range-value">
          {maxDisabled ? '∞' : maxValue}
        </span>
      </div>

      {/* Checkboxes */}
      <div className="limit-toggles" style={{ marginTop: '8px', flexDirection: 'column', alignItems: 'flex-start' }}>
        <label className="tiny-check">
          <input
            type="checkbox"
            checked={minDisabled}
            onChange={handleMinDisabledToggle}
          />
          no min
        </label>
        <label className="tiny-check">
          <input
            type="checkbox"
            checked={maxDisabled}
            onChange={handleMaxDisabledToggle}
          />
          no max
        </label>
      </div>
    </div>
  );
}
