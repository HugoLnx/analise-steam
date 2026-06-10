import React, { useCallback, useEffect, useState, useRef } from 'react';

interface FilterSidebarProps {
  includeAnd: string;
  setIncludeAnd: (val: string) => void;
  includeOr: string;
  setIncludeOr: (val: string) => void;
  excludeAnd: string;
  setExcludeAnd: (val: string) => void;
  excludeOr: string;
  setExcludeOr: (val: string) => void;
  onSearch: () => void;
  
  // Novos Filtros
  title: string;
  setTitle: (val: string) => void;
  onlyBr: boolean;
  setOnlyBr: (val: boolean) => void;
  reviewsMin: string;
  setReviewsMin: (val: string) => void;
  reviewsMax: string;
  setReviewsMax: (val: string) => void;
  revenueMin: string;
  setRevenueMin: (val: string) => void;
  revenueMax: string;
  setRevenueMax: (val: string) => void;
  priceMin: string;
  setPriceMin: (val: string) => void;
  priceMax: string;
  setPriceMax: (val: string) => void;
  weeksMin: string;
  setWeeksMin: (val: string) => void;
  weeksMax: string;
  setWeeksMax: (val: string) => void;

  // No Min/Max states
  revNoMin: boolean; setRevNoMin: (v: boolean) => void;
  revNoMax: boolean; setRevNoMax: (v: boolean) => void;
  revenueNoMin: boolean; setRevenueNoMin: (v: boolean) => void;
  revenueNoMax: boolean; setRevenueNoMax: (v: boolean) => void;
  priceNoMin: boolean; setPriceNoMin: (v: boolean) => void;
  priceNoMax: boolean; setPriceNoMax: (v: boolean) => void;
  weeksNoMin: boolean; setWeeksNoMin: (v: boolean) => void;
  weeksNoMax: boolean; setWeeksNoMax: (v: boolean) => void;
}

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

const FilterSidebar: React.FC<FilterSidebarProps> = (props) => {
  const {
    includeAnd, setIncludeAnd,
    includeOr, setIncludeOr,
    excludeAnd, setExcludeAnd,
    excludeOr, setExcludeOr,
    onSearch,
    title, setTitle,
    onlyBr, setOnlyBr,
    reviewsMin, setReviewsMin,
    reviewsMax, setReviewsMax,
    revenueMin, setRevenueMin,
    revenueMax, setRevenueMax,
    priceMin, setPriceMin,
    priceMax, setPriceMax,
    weeksMin, setWeeksMin,
    weeksMax, setWeeksMax,
    revNoMin, setRevNoMin,
    revNoMax, setRevNoMax,
    revenueNoMin, setRevenueNoMin,
    revenueNoMax, setRevenueNoMax,
    priceNoMin, setPriceNoMin,
    priceNoMax, setPriceNoMax,
    weeksNoMin, setWeeksNoMin,
    weeksNoMax, setWeeksNoMax
  } = props;
  
  const handleReset = () => {
    setIncludeAnd('');
    setIncludeOr('');
    setExcludeAnd('');
    setExcludeOr('');
    setTitle('');
    setOnlyBr(false);
    setReviewsMin('0');
    setReviewsMax('10000');
    setRevenueMin('0');
    setRevenueMax('10000');
    setPriceMin('0');
    setPriceMax('200');
    setWeeksMin('0');
    setWeeksMax('520');
    setRevNoMin(true);
    setRevNoMax(true);
    setRevenueNoMin(true);
    setRevenueNoMax(true);
    setPriceNoMin(true);
    setPriceNoMax(true);
    setWeeksNoMin(true);
    setWeeksNoMax(true);
  };

  return (
    <aside className="sidebar">
      <h3>
        <span style={{ fontSize: '1.2rem' }}>⇌</span> Filters
      </h3>

      <div className="filter-group">
        <label>Title</label>
        <input
          type="text"
          placeholder="Game name..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
      </div>

      <div className="filter-group checkbox-group">
        <label>
          <input
            type="checkbox"
            checked={onlyBr}
            onChange={(e) => setOnlyBr(e.target.checked)}
          />
          Only BR Games
        </label>
      </div>

      <hr />

      <DualRange
        label="Reviews 1 Year"
        min={0}
        max={10000}
        minVal={reviewsMin}
        maxVal={reviewsMax}
        setMin={setReviewsMin}
        setMax={setReviewsMax}
        noMin={revNoMin}
        setNoMin={setRevNoMin}
        noMax={revNoMax}
        setNoMax={setRevNoMax}
      />

      <DualRange
        label="Revenue 1 Year"
        min={0}
        max={10000}
        minVal={revenueMin}
        maxVal={revenueMax}
        setMin={setRevenueMin}
        setMax={setRevenueMax}
        noMin={revenueNoMin}
        setNoMin={setRevenueNoMin}
        noMax={revenueNoMax}
        setNoMax={setRevenueNoMax}
        prefix="$"
      />

      <DualRange
        label="Price"
        min={0}
        max={200}
        step={0.01}
        minVal={priceMin}
        maxVal={priceMax}
        setMin={setPriceMin}
        setMax={setPriceMax}
        noMin={priceNoMin}
        setNoMin={setPriceNoMin}
        noMax={priceNoMax}
        setNoMax={setPriceNoMax}
        prefix="$"
      />

      <DualRange
        label="Weeks Ago"
        min={0}
        max={520}
        minVal={weeksMin}
        maxVal={weeksMax}
        setMin={setWeeksMin}
        setMax={setWeeksMax}
        noMin={weeksNoMin}
        setNoMin={setWeeksNoMin}
        noMax={weeksNoMax}
        setNoMax={setWeeksNoMax}
      />

      <hr />

      <div className="filter-group">
        <label>Tags INCLUDE (AND)</label>
        <input
          type="text"
          placeholder="e.g. Action, RPG"
          value={includeAnd}
          onChange={(e) => setIncludeAnd(e.target.value)}
        />
      </div>

      <div className="filter-group">
        <label>Tags INCLUDE (OR)</label>
        <input
          type="text"
          placeholder="e.g. Indie, Adventure"
          value={includeOr}
          onChange={(e) => setIncludeOr(e.target.value)}
        />
      </div>

      <div className="filter-group">
        <label>Tags EXCLUDE (AND)</label>
        <input
          type="text"
          placeholder="Tags to exclude..."
          value={excludeAnd}
          onChange={(e) => setExcludeAnd(e.target.value)}
        />
      </div>

      <div className="filter-group">
        <label>Tags EXCLUDE (OR)</label>
        <input
          type="text"
          placeholder="Tags to exclude..."
          value={excludeOr}
          onChange={(e) => setExcludeOr(e.target.value)}
        />
      </div>

      <div className="sidebar-buttons">
        <button className="btn-reset" onClick={handleReset}>
          Reset
        </button>
        <button className="btn-search" onClick={onSearch}>
          Aplicar Filtros
        </button>
      </div>
    </aside>
  );
};

export default FilterSidebar;
