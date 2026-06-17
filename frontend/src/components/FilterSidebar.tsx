import React from 'react';
import { TagClauseFilter } from './TagClauseFilter';
import type { TagClause } from './TagClauseFilter';
import DualRange from './DualRange';

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
    setTagClauses([]);
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
        max={1000000}
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
        max={1000000000}
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
        max={500}
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
        label="Release Date"
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

      {/* Código anterior, com filtersTags separados <hr />

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
      </div> */}

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
