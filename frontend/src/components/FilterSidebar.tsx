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
      {/* TODO: #27 - Configurar min/max reais e step para Reviews de 1 Ano (Ex: min: 0, max: 1000000, step: 1000) */}
      {/* TODO: #27 - Garantir que a alteração manual nos inputs de texto reflita perfeitamente nos sliders sem lag */}
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
      {/* TODO: #27 - Configurar min/max reais e step para Receita de 1 Ano (Ex: min: 0, max: 1000000000, step: 50000) */}
      {/* TODO: #27 - Validar formatação do prefixo e garantir que valores grandes não quebrem o layout do input */}
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
      {/* TODO: #27 - Configurar min/max reais e step para Preço (Ex: min: 0, max: 500, step: 0.01 ou 0.99 para centavos) */}
      {/* TODO: #27 - Corrigir o arredondamento de casas decimais (toFixed(2)) ao arrastar a thumb de preço */}
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
      {/* TODO: #27 - Configurar min/max reais e step para Release Date em semanas (Ex: min: 0, max: 520, step: 1) */}
      {/* TODO: #27 - Adicionar uma legenda ou tooltip convertendo o número de semanas para anos/meses dinamicamente */}
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
