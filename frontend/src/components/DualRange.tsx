import React, { useCallback, useEffect, useState, useRef } from 'react';
//Componente alternativo para MinMaxFilter, usando um range slider duplo para representar o intervalo, com a opção de desabilitar o min ou max para representar "sem limite".
const DualRange: React.FC<{
  label: string;
  min: number;
  max: number;
  minVal: string;
  maxVal: string;
  setMin: (v: string) => void;
  setMax: (v: string) => void;
  noMin: boolean;
  setNoMin: (v: boolean) => void;
  noMax: boolean;
  setNoMax: (v: boolean) => void;
  step?: number;
  prefix?: string;
}> = ({ label, min, max, minVal, maxVal, setMin, setMax, noMin, setNoMin, noMax, setNoMax, step = 1, prefix = "" }) => {
  const [minThumb, setMinThumb] = useState(Number(minVal) || min);
  const [maxThumb, setMaxThumb] = useState(Number(maxVal) || max);
  const rangeRef = useRef<HTMLDivElement>(null);

  const getPercent = useCallback(
    (value: number) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  useEffect(() => {
    if (rangeRef.current) {
      const minPercent = noMin ? 0 : getPercent(minThumb);
      const maxPercent = noMax ? 100 : getPercent(maxThumb);

      rangeRef.current.style.left = `${minPercent}%`;
      rangeRef.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minThumb, maxThumb, getPercent, noMin, noMax]);

  return (
    <div className="filter-group range-group">
      <div className="range-header">
        <label>{label}</label>
        <div className="limit-toggles">
          <label className="tiny-check">
            <input type="checkbox" checked={noMin} onChange={(e) => setNoMin(e.target.checked)} />
            no min
          </label>
          <label className="tiny-check">
            <input type="checkbox" checked={noMax} onChange={(e) => setNoMax(e.target.checked)} />
            no max
          </label>
        </div>
      </div>
      
      <div className="dual-range-visual">
        <div className="multi-range-slider">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={noMin ? min : minThumb}
            onChange={(event) => {
              const value = Math.min(Number(event.target.value), maxThumb - step);
              setMinThumb(value);
              setMin(value.toString());
              setNoMin(false);
            }}
            className={`thumb thumb--left ${noMin ? 'disabled' : ''}`}
            style={{ zIndex: (minThumb > max - 100 || minThumb === maxThumb) ? "10" : "6" }}
            disabled={noMin}
          />
          <div className="thumb-label thumb-label--left" style={{ left: `${noMin ? 0 : getPercent(minThumb)}%` }}>
            {noMin ? '∞' : `${prefix}${minThumb}`}
          </div>

          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={noMax ? max : maxThumb}
            onChange={(event) => {
              const value = Math.max(Number(event.target.value), minThumb + step);
              setMaxThumb(value);
              setMax(value.toString());
              setNoMax(false);
            }}
            className={`thumb thumb--right ${noMax ? 'disabled' : ''}`}
            style={{ zIndex: (minThumb > max - 100 || minThumb === maxThumb) ? "6" : "10" }}
            disabled={noMax}
          />
          <div className="thumb-label thumb-label--right" style={{ left: `${noMax ? 100 : getPercent(maxThumb)}%` }}>
            {noMax ? '∞' : `${prefix}${maxThumb}`}
          </div>

          <div className="slider">
            <div className="slider__track" />
            <div ref={rangeRef} className="slider__range" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default DualRange;