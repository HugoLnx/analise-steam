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
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({
  includeAnd,
  setIncludeAnd,
  includeOr,
  setIncludeOr,
  excludeAnd,
  setExcludeAnd,
  excludeOr,
  setExcludeOr,
  onSearch,
}) => {
  return (
    <aside className="sidebar">
      <h3>
        <span style={{ fontSize: '1.2rem' }}>⇌</span> Filter By
      </h3>

      <div className="filter-group">
        <label>INCLUDE (AND)</label>
        <input
          type="text"
          placeholder="Search tags..."
          value={includeAnd}
          onChange={(e) => setIncludeAnd(e.target.value)}
        />
      </div>

      <div className="filter-group">
        <label>INCLUDE (OR)</label>
        <input
          type="text"
          placeholder="Search tags..."
          value={includeOr}
          onChange={(e) => setIncludeOr(e.target.value)}
        />
      </div>

      <div className="filter-group">
        <label>EXCLUDE (AND)</label>
        <input
          type="text"
          placeholder="Search tags..."
          value={excludeAnd}
          onChange={(e) => setExcludeAnd(e.target.value)}
        />
      </div>

      <div className="filter-group">
        <label>EXCLUDE (OR)</label>
        <input
          type="text"
          placeholder="Search tags..."
          value={excludeOr}
          onChange={(e) => setExcludeOr(e.target.value)}
        />
      </div>

      <button className="btn-search" onClick={onSearch}>
        Aplicar Filtros
      </button>
    </aside>
  );
};

export default FilterSidebar;
