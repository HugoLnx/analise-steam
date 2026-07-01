import React from 'react';
import { TagClauseFilter } from './TagClauseFilter';
import type { TagClause } from './TagClauseFilter';
import DualRange from './DualRange';
import { FuncTagClauseFilter } from './FuncTagClauseFilter';
import type { FuncOptionsByCategory, FuncTagClause } from './funcTagClauseUtils';


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

  // Props para TagClauseFilter
  availableTags: string[];
  tagClauses: TagClause[];
  setTagClauses: (clauses: TagClause[]) => void;

  // TODO #31 - Funcionalidades (features/multiplayer/gamepad/steamdeck/languages)
  funcClauses: FuncTagClause[];
  setFuncClauses: (clauses: FuncTagClause[]) => void;
  funcOptionsByCategory: FuncOptionsByCategory;

  onReset?: () => void;
}

const FilterSidebar: React.FC<FilterSidebarProps> = (props) => {
  const {
    setIncludeAnd,
    setIncludeOr,
    setExcludeAnd,
    setExcludeOr,
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
    weeksNoMax, setWeeksNoMax,
    setTagClauses,

    funcClauses,
    setFuncClauses,
    funcOptionsByCategory,

    onReset,
  } = props;

  const formatWeeks = (weeks: string) => {
    const w = Number(weeks);
    if (isNaN(w) || w === 0) return '0w';
    if (w < 4) return `${w}w`;
    if (w < 52) {
      const m = Math.floor(w / 4);
      return `${m}mo`;
    }
    const y = (w / 52).toFixed(1).replace(/\.0$/, '');
    return `${y}y`;
  };
  
  const handleReset = () => {
    if (onReset) {
      onReset();
    }
    setIncludeAnd('');
    setIncludeOr('');
    setExcludeAnd('');
    setExcludeOr('');
    setTitle('');
    setOnlyBr(false);
    setReviewsMin('0');
    setReviewsMax('800');
    setRevenueMin('0');
    setRevenueMax('10000');
    setPriceMin('0');
    setPriceMax('80');
    setWeeksMin('0');
    setWeeksMax('260');
    setRevNoMin(true);
    setRevNoMax(true);
    setRevenueNoMin(true);
    setRevenueNoMax(true);
    setPriceNoMin(true);
    setPriceNoMax(true);
    setWeeksNoMin(true);
    setWeeksNoMax(true);
    setTagClauses([]);
    setFuncClauses([]);
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

      <div className='filter-group'>
        <TagClauseFilter
          availableTags={props.availableTags}
          clauses={props.tagClauses}
          onChange={props.setTagClauses}
        />
      </div>

      {/* TODO #31 - Funcionalidades */}
      <div className='filter-group'>
        <FuncTagClauseFilter
          optionsByCategory={funcOptionsByCategory}
          clauses={funcClauses}
          onChange={setFuncClauses}
        />
      </div>


      <hr />


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
        max={800}
        step={10}
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
        step={100}
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
        max={80}
        step={1}
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
        label={`Release Date: ${weeksNoMin ? 'now' : formatWeeks(weeksMin)} ~ ${weeksNoMax ? '∞' : formatWeeks(weeksMax)} ago`}
        min={0}
        max={260}
        step={4}
        minVal={weeksMin}
        maxVal={weeksMax}
        setMin={setWeeksMin}
        setMax={setWeeksMax}
        noMin={weeksNoMin}
        setNoMin={setWeeksNoMin}
        noMax={weeksNoMax}
        setNoMax={setWeeksNoMax}
      />


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
