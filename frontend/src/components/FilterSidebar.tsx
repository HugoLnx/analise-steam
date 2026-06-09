import React from 'react';

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
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
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
  weeksMax, setWeeksMax
}) => {
  
  const handleReset = () => {
    setIncludeAnd('');
    setIncludeOr('');
    setExcludeAnd('');
    setExcludeOr('');
    setTitle('');
    setOnlyBr(false);
    setReviewsMin('');
    setReviewsMax('');
    setRevenueMin('');
    setRevenueMax('');
    setPriceMin('');
    setPriceMax('');
    setWeeksMin('');
    setWeeksMax('');
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

      <div className="filter-group range-group">
        <label>Reviews 1 Year</label>
        <div className="range-inputs">
          <div className="range-field">
            <span>min</span>
            <input type="number" value={reviewsMin} onChange={(e) => setReviewsMin(e.target.value)} />
          </div>
          <div className="range-field">
            <span>max</span>
            <input type="number" value={reviewsMax} onChange={(e) => setReviewsMax(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="filter-group range-group">
        <label>Revenue 1 Year</label>
        <div className="range-inputs">
          <div className="range-field">
            <span>min</span>
            <input type="number" value={revenueMin} onChange={(e) => setRevenueMin(e.target.value)} />
          </div>
          <div className="range-field">
            <span>max</span>
            <input type="number" value={revenueMax} onChange={(e) => setRevenueMax(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="filter-group range-group">
        <label>Price</label>
        <div className="range-inputs">
          <div className="range-field">
            <span>min</span>
            <input type="number" value={priceMin} onChange={(e) => setPriceMin(e.target.value)} />
          </div>
          <div className="range-field">
            <span>max</span>
            <input type="number" value={priceMax} onChange={(e) => setPriceMax(e.target.value)} />
          </div>
        </div>
      </div>

      <div className="filter-group range-group">
        <label>Released Weeks Ago</label>
        <div className="range-inputs">
          <div className="range-field">
            <span>min</span>
            <input type="number" value={weeksMin} onChange={(e) => setWeeksMin(e.target.value)} />
          </div>
          <div className="range-field">
            <span>max</span>
            <input type="number" value={weeksMax} onChange={(e) => setWeeksMax(e.target.value)} />
          </div>
        </div>
      </div>

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
