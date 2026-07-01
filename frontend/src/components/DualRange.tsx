import React, { useCallback, useEffect, useRef } from 'react';

// Componente alternativo para MinMaxFilter, usando um range slider duplo para representar o intervalo, 
// com a opção de desabilitar o min ou max para representar "sem limite".
// TODO: #27 - Implementar validações rigorosas nos inputs manuais para que o valor mínimo digitado nunca ultrapasse o valor máximo atual menos o step
// TODO: #27 - Corrigir o comportamento visual da barra slider__range quando os valores atingem os limites extremos (0% ou 100%)
// TODO: #27 - Adicionar suporte nativo à tecla Tab e setas do teclado para acessibilidade nas thumbs dos sliders
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
  
  // Deriva os valores numéricos diretamente das props para evitar estado redundante e avisos de cascading renders.
  const numericMin = minVal === "" ? min : Number(minVal);
  const numericMax = maxVal === "" ? max : Number(maxVal);
  
  const rangeRef = useRef<HTMLDivElement>(null);

  const getPercent = useCallback(
    (value: number) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  // Sincroniza a largura da barra visual (track) com os valores atuais.
  useEffect(() => {
    if (rangeRef.current) {
      const minPercent = noMin ? 0 : Math.max(0, Math.min(100, getPercent(numericMin)));
      const maxPercent = noMax ? 100 : Math.max(0, Math.min(100, getPercent(numericMax)));

      rangeRef.current.style.left = `${minPercent}%`;
      rangeRef.current.style.width = `${Math.max(0, maxPercent - minPercent)}%`;
    }
  }, [numericMin, numericMax, getPercent, noMin, noMax]);

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

      <div className="manual-inputs-row">
        <div className="manual-input-item">
          <span className="input-prefix">{prefix}</span>
          <input
            type="number"
            className="manual-range-input-large"
            value={minVal}
            step={step}
            disabled={noMin}
            onChange={(e) => {
              setMin(e.target.value);
            }}
            placeholder="Min"
          />
        </div>
        <div className="manual-inputs-separator">to</div>
        <div className="manual-input-item">
          <span className="input-prefix">{prefix}</span>
          <input
            type="number"
            className="manual-range-input-large"
            value={maxVal}
            step={step}
            disabled={noMax}
            onChange={(e) => {
              setMax(e.target.value);
            }}
            placeholder="Max"
          />
        </div>
      </div>
      
      <div className="dual-range-visual">
        <div className="multi-range-slider">
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={noMin ? min : numericMin}
            onChange={(event) => {
              const value = Math.min(Number(event.target.value), numericMax - step);
              setMin(value.toString());
              setNoMin(false);
            }}
            className={`thumb thumb--left ${noMin ? 'disabled' : ''}`}
            style={{ zIndex: (numericMin > max - 100 || numericMin === numericMax) ? "10" : "6" }}
            disabled={noMin}
          />

          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={noMax ? max : numericMax}
            onChange={(event) => {
              const value = Math.max(Number(event.target.value), numericMin + step);
              setMax(value.toString());
              setNoMax(false);
            }}
            className={`thumb thumb--right ${noMax ? 'disabled' : ''}`}
            style={{ zIndex: (numericMin > max - 100 || numericMin === numericMax) ? "6" : "10" }}
            disabled={noMax}
          />

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
